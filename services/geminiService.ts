import { GoogleGenAI, Type } from "@google/genai";
import { GenerationConfig, Quiz, LearningPath, InterviewQuestion } from '../types';
import { learningData } from '../constants';
import MarkdownIt from 'markdown-it';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const proModel = 'gemini-2.5-pro';

const md = new MarkdownIt();

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
    const prompt = `Explain the following ${language} code snippet. Break down what each part does in a clear, concise way for a beginner. Format the output as clean HTML markup.

\`\`\`${language}
${code}
\`\`\``;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const simplifyTopic = async (topicDescription: string): Promise<string> => {
    const prompt = `Explain this topic in simpler terms, like I'm a complete beginner. Use an analogy if it helps. Format the output as clean HTML markup.\n\nTopic: "${topicDescription}"`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateQuiz = async (topicTitle: string, topicContent: string): Promise<Quiz> => {
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

export const reviewCode = async (code: string, language: string, exerciseDescription: string): Promise<string> => {
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
    const prompt = `Suggest a small, beginner-friendly project idea using ${language} that incorporates the following topics: ${topics.join(', ')}. Describe the project, its core features, and why it's a good way to practice these skills. Format the output as clean HTML markup.`;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};


export const searchTopics = async (query: string): Promise<string> => {
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
    const prompt = `I have a bug in my ${language} code. Please analyze it, identify the error, explain what's wrong, and provide the corrected code. Format the output as clean HTML, using <pre><code> for code blocks.

Buggy Code:
\`\`\`${language}
${code}
\`\`\``;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return md.render(response.text);
};

export const generateLearningPath = async (goal: string): Promise<LearningPath | null> => {
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


// --- API Forge Gemini Functions ---

export const generateApiStream = (config: GenerationConfig) => {
    const systemInstruction = `You are an expert full-stack software architect specializing in generating complete, production-ready backend APIs. Your task is to take a user's prompt and technical stack selection, and generate a fully functional API.

You must follow these steps precisely:
1.  **Analyze the Prompt:** Understand the user's requirements, identifying entities, relationships, and required features (like authentication).
2.  **Plan the Architecture:** Define the database schema, API endpoints (with CRUD operations), controllers, services/logic, and data models.
3.  **Generate Code:** Write clean, well-structured, and idiomatic code for the selected language and framework. The code should be split into logical files (e.g., server.js, routes/user.js, models/product.js).
4.  **Generate Documentation:** Create API documentation in Markdown format suitable for Postman or Swagger.
5.  **Generate Explanation:** Provide a clear, concise explanation of the generated code's architecture, file structure, and key logic.
6.  **Generate Deployment Guide:** Give simple, step-by-step instructions for deploying the generated application to a popular service like Vercel, Render, or Railway.

**Output Format:**
You MUST structure your response as a single, continuous stream. Use the following special markers to delineate each section. Do NOT nest these markers.

[START_CODE:{{file_path}}]
// code for the file goes here
[END_CODE]

[START_EXPLANATION]
A markdown explanation of the architecture.
[END_EXPLANATION]

[START_DOCS]
A markdown-formatted API documentation.
[END_DOCS]

[START_DEPLOYMENT]
A markdown-formatted deployment guide.
[END_DEPLOYMENT]

The response should be comprehensive and complete.`;

    const userPrompt = `Generate a backend API based on the following specifications:
-   **User's Goal:** "${config.prompt}"
-   **Language:** ${config.language}
-   **Framework:** ${config.framework}
-   **Database:** ${config.database}

Please generate all necessary files, including package.json or equivalent dependency file, server entry point, routes, controllers, and models. Ensure database connection logic is included. If authentication is requested, implement a simple JWT-based system.`;

    return ai.models.generateContentStream({
        model: proModel,
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

export const refineCodeStream = async (chatHistory: { role: string; parts: string }[], refinementPrompt: string) => {
    
    const formattedHistory = chatHistory.map(message => ({
        role: message.role,
        parts: [{ text: message.parts }]
    }));

    const chat = ai.chats.create({
        model: proModel,
        history: formattedHistory,
    });
    
    return chat.sendMessageStream({ message: `Based on the previously generated code, please apply this refinement: "${refinementPrompt}". Provide only the updated code snippets or new files required. Explain your changes briefly.` });
};
