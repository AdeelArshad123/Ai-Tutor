import { LiveSession } from "@google/genai";

// --- User & Auth ---
export interface User {
  username: string;
}

// --- UI & Theming ---
export interface BreadcrumbItem {
    label: string;
    view?: View;
}

// --- Navigation ---
export type View =
  | { name: 'home' }
  | { name: 'language'; language: Language }
  | { name: 'topic'; language: Language; topic: Topic }
  | { name: 'search'; query: string }
  | { name: 'debugger' }
  | { name: 'learningPath' }
  | { name: 'interviewPrep' }
  | { name: 'apiGenerator' }
  | { name: 'liveTutor' }
  | { name: 'codeTranslator' }
  | { name: 'quizGenerator' }
  | { name: 'codeMentor' }
  | { name: 'playground' }
  | { name: 'educators' }
  | { name: 'unitTestGenerator' }
  | { name: 'uiDrafter' }
  | { name: 'codeImprover' }
  | { name: 'login' }
  | { name: 'signup' };

// --- Learning Content ---
export interface ResourceLink {
    name: string;
    url: string;
    type: 'documentation' | 'article' | 'youtube' | 'github' | 'tutor' | 'educators';
    description: string;
}

export interface Educator {
    name: string;
    description: string;
    avatarUrl: string;
    links: {
        youtube?: string;
        website?: string;
        github?: string;
    };
}


export interface TestCase {
    input: string;
    expectedOutput: any;
}

export interface Exercise {
    id: string;
    description: string;
    starterCode: string;
    solution: string;
    testCases: TestCase[];
}

export interface Topic {
    slug: string;
    title: string;
    description: string;
    longDescription: string;
    codeExample: string;
    externalLinks: { name: string; url: string }[];
    exercises?: Exercise[];
    resources?: ResourceLink[];
}

export interface Language {
    slug: string;
    name: string;
    description: string;
    logo: string;
    topics: Topic[];
    resources?: ResourceLink[];
}

export interface LearningCategory {
    name: string;
    languages: Language[];
}

// --- Tech Stack for API Generator ---
export interface TechOption {
    id: string;
    name: string;
}

// FIX: Add language property to associate framework with a language
export interface FrameworkOption extends TechOption {
    language: string;
}

export interface DatabaseOption extends TechOption {}

// --- Gemini Service & AI Features ---
export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface Quiz {
    questions: QuizQuestion[];
}

export interface LearningPathStep {
    languageSlug: string;
    languageName: string;
    topicSlug: string;
    topicTitle: string;
    reason: string;
}

export interface LearningPath {
    title: string;
    description: string;
    steps: LearningPathStep[];
}

export interface InterviewQuestion {
    question: string;
    instructions: string;
}

export interface GenerationConfig {
    prompt: string;
    language: string;
    framework: string;
    database: string;
    generateTests: boolean;
    testingFramework: string;
    generateDocs: boolean;
    addValidation: boolean;
}

export interface GeneratedCode {
    filePath: string;
    code: string;
}

// FIX: Add ApiGenerationHistoryItem to resolve import error in utils/history.ts
export interface ApiGenerationHistoryItem {
    id: string;
    createdAt: string;
    config: GenerationConfig;
}

export interface LiveTutorState {
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    transcript: Array<{ speaker: 'user' | 'ai', text: string }>;
    session: LiveSession | null;
    inputAudioContext: AudioContext | null;
    outputAudioContext: AudioContext | null;
    stream: MediaStream | null;
    processor: ScriptProcessorNode | null;
    source: MediaStreamAudioSourceNode | null;
}

// --- OpenAPI Specification Types for API Preview ---
export interface OpenApiParameter {
    name: string;
    in: 'query' | 'header' | 'path' | 'cookie';
    description: string;
    required?: boolean;
    schema: {
        type: string;
        format?: string;
    };
}

export interface OpenApiResponse {
    description: string;
    content?: {
        [mimeType: string]: {
            schema: any;
            example?: any;
        };
    };
}

export interface OpenApiOperation {
    summary: string;
    description?: string;
    operationId?: string;
    parameters?: OpenApiParameter[];
    requestBody?: {
        content: {
            [mimeType: string]: {
                schema: any;
                example?: any;
            };
        };
    };
    responses: {
        [statusCode: string]: OpenApiResponse;
    };
    tags?: string[];
}

export interface OpenApiPathItem {
    get?: OpenApiOperation;
    put?: OpenApiOperation;
    post?: OpenApiOperation;
    delete?: OpenApiOperation;
    patch?: OpenApiOperation;
}

export interface OpenApiSpec {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: {
        [path: string]: OpenApiPathItem;
    };
    components?: {
        schemas?: any;
    };
}