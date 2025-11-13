import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, Quiz, LearningPath, InterviewQuestion, GeneratedCode } from '../types';
import { learningData } from '../constants';
import MarkdownIt from 'markdown-it';

const getAiClient = (): GoogleGenAI | null => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API_KEY environment variable is not set. AI features will be disabled.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

const textModel = 'gemini-2.5-flash';
const proModel = 'gemini-2.5-pro';

const md = new MarkdownIt();

const handleMissingApiKeyError = (type: 'html' | 'json' | 'stream' | 'text') => {
    const errorMessage = "AI features are unavailable because the API key is not configured. Please contact the site administrator.";
    switch(type) {
        case 'html':
            return md.render(`## Error\n\n${errorMessage}`);
        case 'json':
        case 'stream':
        case 'text':
            throw new Error(errorMessage);
    }
}


// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // result is "data:mime/type;base64,..." - we only need the part after the comma
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

const parseJsonFromMarkdown = <T>(markdown: string): T | null => {
    try {
        const jsonMatch = markdown.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
            return JSON.parse(jsonMatch[1]);
        }
        return null;
    } catch (e) {
        console.error("Failed to parse JSON from markdown:", e);
        return null;
    }
};

// --- StackTutor Gemini Functions ---

export const explainCode = async (code: string, language: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `Explain the following ${language} code snippet. Break down what each part does in a clear, concise way for a beginner. Format the output as clean HTML markup.

\`\`\`${language}
${code}
\`\`\``;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const simplifyTopic = async (topicDescription: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `Explain this topic in simpler terms, like I'm a complete beginner. Use an analogy if it helps. Format the output as clean HTML markup.\n\nTopic: "${topicDescription}"`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateQuiz = async (topicTitle: string, topicContent: string): Promise<Quiz> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('json');

    const response = await ai.models.generateContent({
        model: textModel,
        contents: `Create a 3-question multiple-choice quiz about the following topic. For each question, provide 4 options, indicate the correct answer, and give a brief explanation for why it's correct.
        
Topic: ${topicTitle}
Content: ${topicContent}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                correctAnswer: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                            },
                            required: ["question", "options", "correctAnswer", "explanation"],
                        },
                    },
                },
                required: ["questions"],
            },
        }
    });
    
    const quizData = JSON.parse(response.text);
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error('AI failed to generate a valid quiz.');
    }
    return quizData;
};

export const generateQuizFromTopicText = async (topicText: string): Promise<Quiz> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('json');

    const response = await ai.models.generateContent({
        model: textModel,
        contents: `Create a 3-question multiple-choice quiz about the following topic. Be comprehensive based on the text provided. For each question, provide 4 options, indicate the correct answer, and give a brief explanation for why it's correct.
        
Topic Text:
${topicText}`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING },
                                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                                correctAnswer: { type: Type.STRING },
                                explanation: { type: Type.STRING },
                            },
                            required: ["question", "options", "correctAnswer", "explanation"],
                        },
                    },
                },
                required: ["questions"],
            },
        }
    });
    
    const quizData = JSON.parse(response.text);
    if (!quizData || !quizData.questions || quizData.questions.length === 0) {
        throw new Error('AI failed to generate a valid quiz.');
    }
    return quizData;
};

export const reviewCode = async (code: string, language: string, exerciseDescription: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `As a senior software engineer, review the following ${language} code solution for the exercise described. Provide feedback on correctness, efficiency, code style, and best practices. Suggest improvements or a refactored version if applicable. Format the output as clean HTML markup.

Exercise: "${exerciseDescription}"

Code:
\`\`\`${language}
${code}
\`\`\``;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateProjectIdea = async (language: string, topics: string[]): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `Suggest a small, beginner-friendly project idea using ${language} that incorporates the following topics: ${topics.join(', ')}. Describe the project, its core features, and why it's a good way to practice these skills. Format the output as clean HTML markup.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};


export const searchTopics = async (query: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const allTopics = learningData.flatMap(category =>
        category.languages.flatMap(lang =>
            lang.topics.map(topic => ({
                ...topic,
                languageName: lang.name,
                languageSlug: lang.slug,
                category: category.name
            }))
        )
    ).map(t => `Topic: ${t.title} (in ${t.languageName}) - Slug: ${t.languageSlug}/${t.slug} - Description: ${t.description}`).join('\n');

    const prompt = `You are a helpful search assistant for a learning platform called StackTutor. Based on the user's query, find the most relevant topics from the list below and present them as HTML links. The link format should be a simple anchor tag with an href like "#" and special data attributes: \`data-type="topic"\`, \`data-language-slug="..."\`, and \`data-topic-slug="..."\`.

User Query: "${query}"

Available Topics:
${allTopics}

Your response should be a friendly summary of the best results, including the HTML links.`;

    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const debugCode = async (code: string, language: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `I have a bug in my ${language} code. Please analyze it, identify the error, explain what's wrong, and provide the corrected code. Format the output as clean HTML, using <pre><code> for code blocks.

Buggy Code:
\`\`\`${language}
${code}
\`\`\``;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateLearningPath = async (goal: string): Promise<LearningPath | null> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('json');

    const allTopics = learningData.flatMap(category =>
        category.languages.map(lang => ({
            languageName: lang.name,
            languageSlug: lang.slug,
            topics: lang.topics.map(t => ({ topicSlug: t.slug, topicTitle: t.title, description: t.description }))
        }))
    );

    const response = await ai.models.generateContent({
        model: textModel,
        contents: `A user wants to achieve a learning goal. Your task is to create a personalized learning path using the available topics. The user's goal is: "${goal}".
        
You must create a step-by-step path. For each step, you must specify the 'languageSlug', 'languageName', 'topicSlug', 'topicTitle', and a brief 'reason' why this topic is the next logical step. The path should have a main 'title' and a 'description'.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    steps: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                languageSlug: { type: Type.STRING },
                                languageName: { type: Type.STRING },
                                topicSlug: { type: Type.STRING },
                                topicTitle: { type: Type.STRING },
                                reason: { type: Type.STRING },
                            },
                            required: ["languageSlug", "languageName", "topicSlug", "topicTitle", "reason"],
                        },
                    },
                },
                required: ["title", "description", "steps"],
            },
        },
    });

    return JSON.parse(response.text);
};

export const getInterviewQuestion = async (technology: string): Promise<InterviewQuestion | null> => {
     const ai = getAiClient();
     if (!ai) return handleMissingApiKeyError('json');

     const response = await ai.models.generateContent({
        model: textModel,
        contents: `Generate a beginner-to-intermediate level technical interview question for a developer specializing in ${technology}. The question should be a practical coding problem. Provide a clear 'question' title and 'instructions' on what needs to be implemented.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                },
                required: ["question", "instructions"],
            },
        },
    });
    return JSON.parse(response.text);
};

export const evaluateInterviewAttempt = async (question: string, userCode: string, userExplanation: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `Act as a senior technical interviewer. Evaluate the candidate's submission for the following question. Provide constructive feedback on the code's correctness, efficiency, and clarity, as well as the quality of their explanation. Format the output as clean HTML.

Question: "${question}"

Candidate's Code:
\`\`\`
${userCode}
\`\`\`

Candidate's Explanation:
"${userExplanation}"`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const translateCode = async (sourceCode: string, sourceLanguage: string, targetLanguage: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('text');

    const prompt = `Translate the following code snippet from ${sourceLanguage} to ${targetLanguage}.
Provide *only* the raw translated code, without any surrounding text, explanations, or markdown fences like \`\`\`.

Source Code (${sourceLanguage}):
\`\`\`
${sourceCode}
\`\`\`
`;
    const response = await ai.models.generateContent({ model: proModel, contents: prompt });
    return response.text.trim();
};

export const generateUnitTests = async (sourceCode: string, language: string, framework: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('text');

    const prompt = `You are an expert software engineer specializing in Test-Driven Development (TDD).
Your task is to write a comprehensive suite of unit tests for the following ${language} code using the ${framework} testing framework.

**Instructions:**
1.  Analyze the provided code to understand its functionality, inputs, and outputs.
2.  Write a complete test file, including all necessary imports and boilerplate for the ${framework} framework.
3.  Create multiple test cases to cover:
    -   Happy path / typical usage.
    -   Edge cases (e.g., empty inputs, nulls, zeros, boundary values).
    -   Error handling (if applicable).
4.  If the code has dependencies (e.g., modules, services), create mock versions of them.
5.  Provide *only* the raw test code, without any surrounding text, explanations, or markdown fences like \`\`\`.

**Source Code (${language}):**
\`\`\`
${sourceCode}
\`\`\`
`;
    const response = await ai.models.generateContent({ model: proModel, contents: prompt });
    return response.text.trim();
};

export const improveCode = async (code: string, language: string): Promise<{ improvedCode: string; explanation: string; }> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('json');

    const prompt = `As an expert software engineer, review the following ${language} code. Refactor it to improve its quality by addressing the following aspects:
- Readability and clarity
- Performance and efficiency
- Adherence to modern best practices and idiomatic style
- Error handling

Provide the improved code and a clear, concise explanation of the changes you made and why they are improvements.`;

    const response = await ai.models.generateContent({
        model: proModel,
        contents: `
${prompt}

\`\`\`${language}
${code}
\`\`\`
`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    improvedCode: {
                        type: Type.STRING,
                        description: "The refactored and improved code snippet."
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A markdown-formatted explanation of the changes made."
                    }
                },
                required: ["improvedCode", "explanation"]
            }
        }
    });

    return JSON.parse(response.text);
};


// --- API Forge Gemini Functions ---

export const generateApiStream = (config: GenerationConfig) => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('stream');

    const systemInstruction = `You are an expert software architect. Your task is to generate a complete backend API based on a user's prompt and tech stack selection. Generate all necessary files, including package definitions, server entry points, routes, controllers, and models. The code should be well-structured and idiomatic for the chosen language and framework.

You MUST structure your response as a single, continuous stream. Use the following special markers to delineate each file. Do NOT nest these markers.

[START_CODE:{{file_path}}]
// code for the file goes here
[END_CODE]`;

    const testingInstruction = config.generateTests
        ? `\n-   **Testing Framework:** ${config.testingFramework}. Also generate a corresponding unit test file for each controller and model.`
        : '';
    
    const docsInstruction = config.generateDocs
        ? `\n-   **API Documentation:** Also generate a comprehensive OpenAPI 3.0 specification file named \`openapi.json\` that documents all the API endpoints.`
        : '';

    const validationInstruction = config.addValidation
        ? `\n-   **Input Validation:** Implement input validation middleware for all create (POST) and update (PUT/PATCH) endpoints. Use a standard, popular validation library for the selected stack (e.g., express-validator for Express, Pydantic for FastAPI, etc.). Validation rules should ensure required fields are present and that data types are correct based on the defined models.`
        : '';

    const userPrompt = `Generate a backend API based on the following specifications:
-   **User's Goal:** "${config.prompt}"
-   **Language:** ${config.language}
-   **Framework:** ${config.framework}
-   **Database:** ${config.database}${testingInstruction}${docsInstruction}${validationInstruction}

Please generate all necessary files. The response must only contain code blocks in the specified format.`;

    return ai.models.generateContentStream({
        model: proModel,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

// --- Code Mentor Gemini Functions ---

export const generateCodingChallenge = async (language: string, concept: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('text');

    const prompt = `Generate a very simple, beginner-friendly coding challenge about "${concept}" in the ${language} programming language. 
    The challenge should be a single paragraph. Do not include any starter code or solution. Just provide the problem description.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return response.text;
};

export const getCodeHint = async (challenge: string, userCode: string, language: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('text');

    const prompt = `A beginner programmer is working on the following challenge in ${language}:
Challenge: "${challenge}"

This is their current code:
\`\`\`${language}
${userCode}
\`\`\`

They are stuck and need a hint. Provide a small, helpful hint to guide them in the right direction. Do not give them the full solution. Just one or two sentences to unblock them.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return response.text;
};

export const evaluateSolution = async (challenge: string, userCode: string, language: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');
    
    const prompt = `As a friendly and encouraging code mentor, evaluate a beginner's solution for a coding challenge.
Challenge: "${challenge}"

Their solution in ${language} is:
\`\`\`${language}
${userCode}
\`\`\`

Provide feedback in three parts, formatted as clean HTML markup:
1.  Start with positive reinforcement.
2.  Gently point out any errors or areas for improvement (e.g., correctness, style, efficiency).
3.  Show and explain an optimal or idiomatic solution.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const getPracticeFeedback = async (code: string, language: string, executionError: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('html');

    const prompt = `You are an expert and friendly code mentor. A user is practicing their ${language} skills in a code playground.
Analyze their code.

Their code is:
\`\`\`${language}
${code}
\`\`\`

${executionError 
    ? `When they ran it, they got this error: "${executionError}". Explain what this error means, why it happened, and how to fix it.`
    : `The code ran without errors. Review it for best practices, suggest improvements for clarity or efficiency, or offer a follow-up challenge based on what they've written.`
}

Provide feedback formatted as clean HTML markup. Use <pre><code> for any code blocks in your response.`;

    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateUiFromImage = async (file: File, prompt: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return handleMissingApiKeyError('text');
    
    const base64Image = await fileToBase64(file);
    const imagePart = {
        inlineData: {
            mimeType: file.type,
            data: base64Image,
        },
    };

    const systemInstruction = `You are an expert frontend developer. Your task is to take an image of a UI design and an optional text prompt, and generate a single HTML file that recreates the design.
-   Use Tailwind CSS for styling. You can assume Tailwind is set up and available.
-   Generate clean, semantic HTML5.
-   Try to match the colors, layout, and typography from the image.
-   If the user provides a prompt, use it for additional context (e.g., "make the buttons interactive", "use this specific color palette").
-   Your response must be ONLY the raw HTML code, without any surrounding text, explanations, or markdown fences like \`\`\`.`;

    const userPrompt = `Recreate the UI from the provided image. Additional instructions: "${prompt || 'None'}"`;
    
    const contents = {
        parts: [imagePart, { text: userPrompt }],
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', // Vision capable model
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response.text.trim();
};