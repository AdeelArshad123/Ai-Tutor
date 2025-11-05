import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, LiveSession } from '@google/genai';
import { User } from '../types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// --- Audio Helper Functions ---

function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}


const LiveTutorPage: React.FC<{ onBack: () => void; user: User; }> = ({ onBack, user }) => {
    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [transcript, setTranscript] = useState<Array<{ speaker: 'user' | 'ai', text: string }>>([]);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const audioContextRefs = useRef<{
        input: AudioContext | null;
        output: AudioContext | null;
        stream: MediaStream | null;
        processor: ScriptProcessorNode | null;
        source: MediaStreamAudioSourceNode | null;
    }>({ input: null, output: null, stream: null, processor: null, source: null });

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (sessionPromiseRef.current) {
                sessionPromiseRef.current.then(session => session.close());
            }
            if (audioContextRefs.current.stream) {
                audioContextRefs.current.stream.getTracks().forEach(track => track.stop());
            }
            if (audioContextRefs.current.input) {
                audioContextRefs.current.input.close();
            }
            if (audioContextRefs.current.output) {
                audioContextRefs.current.output.close();
            }
        };
    }, []);

    const handleConnect = async () => {
        if (status === 'connected' || status === 'connecting') return;

        setStatus('connecting');
        setTranscript([]);
        let currentInputTranscription = '';
        let currentOutputTranscription = '';

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRefs.current.stream = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRefs.current.input = inputAudioContext;
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRefs.current.output = outputAudioContext;

            let nextStartTime = 0;
            const sources = new Set<AudioBufferSourceNode>();

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        audioContextRefs.current.source = source;
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        audioContextRefs.current.processor = scriptProcessor;

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromiseRef.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle transcription
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                             currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const finalInput = currentInputTranscription;
                            const finalOutput = currentOutputTranscription;
                            
                            setTranscript(prev => {
                                let newTranscript = [...prev];
                                if(finalInput.trim()) newTranscript.push({ speaker: 'user', text: finalInput });
                                if(finalOutput.trim()) newTranscript.push({ speaker: 'ai', text: finalOutput });
                                return newTranscript;
                            });
                           
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }

                        // Handle audio playback
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio) {
                            nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            const sourceNode = outputAudioContext.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outputAudioContext.destination);
                            sourceNode.addEventListener('ended', () => sources.delete(sourceNode));
                            sourceNode.start(nextStartTime);
                            nextStartTime += audioBuffer.duration;
                            sources.add(sourceNode);
                        }
                        if (message.serverContent?.interrupted) {
                            sources.forEach(s => s.stop());
                            sources.clear();
                            nextStartTime = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus('error');
                        handleDisconnect();
                    },
                    onclose: () => {
                        handleDisconnect(false); // Don't try to close session again
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: `You are a friendly and helpful AI tutor for a platform called StackTutor. The user's name is ${user.username}. Keep your answers concise and conversational.`
                },
            });

        } catch (error) {
            console.error('Failed to start session:', error);
            setStatus('error');
        }
    };
    
    const handleDisconnect = (shouldCloseSession = true) => {
        if (shouldCloseSession && sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
        }
        sessionPromiseRef.current = null;

        if (audioContextRefs.current.stream) {
            audioContextRefs.current.stream.getTracks().forEach(track => track.stop());
            audioContextRefs.current.stream = null;
        }
        if (audioContextRefs.current.processor) {
            audioContextRefs.current.processor.disconnect();
            audioContextRefs.current.processor = null;
        }
         if (audioContextRefs.current.source) {
            audioContextRefs.current.source.disconnect();
            audioContextRefs.current.source = null;
        }
        if (status !== 'error') {
            setStatus('disconnected');
        }
    };

    const getStatusIndicator = () => {
        switch (status) {
            case 'connected': return <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>;
            case 'connecting': return <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>;
            case 'error': return <div className="w-3 h-3 rounded-full bg-red-500"></div>;
            case 'disconnected': return <div className="w-3 h-3 rounded-full bg-slate-500"></div>;
        }
    };

    return (
        <div>
            <button onClick={onBack} className="mb-6 bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                &larr; Back to Home
            </button>

            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Live AI Voice Tutor</h1>
                <p className="text-slate-400 mt-2">Speak directly with an AI to get help with your questions.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        {getStatusIndicator()}
                        <span className="capitalize">{status}</span>
                    </div>
                    {status === 'connected' || status === 'connecting' ? (
                         <button onClick={() => handleDisconnect()} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg transition-colors">
                            End Session
                        </button>
                    ) : (
                        <button onClick={handleConnect} className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white py-2 px-4 rounded-lg hover:from-cyan-500 hover:to-teal-500 transition-all">
                            Start Session
                        </button>
                    )}
                </div>

                <div className="h-96 bg-black/20 rounded-lg p-4 overflow-y-auto space-y-4 border border-white/10">
                    {transcript.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            <p>{status === 'disconnected' ? 'Start a session to begin the conversation.' : 'Start speaking...'}</p>
                        </div>
                    )}
                    {transcript.map((entry, index) => (
                        <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-md rounded-lg px-3 py-2 ${entry.speaker === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                <p className="font-bold text-sm mb-1">{entry.speaker === 'user' ? user.username : 'AI Tutor'}</p>
                                <p>{entry.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {status === 'error' && <p className="text-red-400 text-center mt-4">A connection error occurred. Please try starting a new session.</p>}
            </div>
        </div>
    );
};

export default LiveTutorPage;
