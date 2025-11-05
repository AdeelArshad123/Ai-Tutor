// Types for StackTutor Learning Platform
export interface User {
  username: string;
}

export interface ExternalLink {
    name: string;
    url: string;
}

export interface TestCase {
    input: string;
    expectedOutput: string;
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
    externalLinks: ExternalLink[];
    exercises?: Exercise[];
}

export interface Language {
    slug: string;
    name: string;
    description: string;
    logo: string;
    topics: Topic[];
}

export interface LearningCategory {
    name: string;
    languages: Language[];
}

export interface Quiz {
    questions: {
        question: string;
        options: string[];
        correctAnswer: string;
        explanation: string;
    }[];
}

export interface PathStep {
    languageSlug: string;
    languageName: string;
    topicSlug: string;
    topicTitle: string;
    reason: string;
}

export interface LearningPath {
    title: string;
    description: string;
    steps: PathStep[];
}

export interface InterviewQuestion {
    question: string;
    instructions: string;
}


// Types for API Forge
export interface TechOption {
  id: string;
  name: string;
}

export interface FrameworkOption extends TechOption {
  language: 'nodejs' | 'python' | 'php' | 'java';
}

export interface DatabaseOption extends TechOption {}

export interface GenerationConfig {
  language: string;
  framework: string;
  database: string;
  prompt: string;
}

export interface GeneratedCode {
    filePath: string;
    code: string;
}

export interface GenerationResult {
    code: GeneratedCode[];
    explanation: string;
    docs: string;
    deployment: string;
}

export interface AiChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
