import { LearningCategory, FrameworkOption, TechOption, DatabaseOption } from './types';

export const learningData: LearningCategory[] = [
    {
        name: "Web Development (Frontend)",
        languages: [
            {
                slug: "javascript",
                name: "JavaScript",
                description: "The language of the web.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
                topics: [
                    {
                        slug: "variables",
                        title: "Variables and Data Types",
                        description: "Learn the fundamentals of storing and using data.",
                        longDescription: "In JavaScript, variables are containers for storing data values. We use `var`, `let`, and `const` to declare variables. JavaScript has several data types, including strings, numbers, booleans, objects, and more.",
                        codeExample: "let message = 'Hello, World!';\nconst PI = 3.14;\nlet isLearning = true;",
                        externalLinks: [{ name: "MDN: Variables", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations" }],
                        exercises: [
                            {
                                id: "ex1",
                                description: "Declare a constant named `APP_NAME` and assign it the value 'StackTutor'. Then, make it available for other modules.",
                                starterCode: "// Your code here\n\n// To make the variable available, assign it to module.exports\n// For example: module.exports = { MyVar: 'value' };",
                                solution: "const APP_NAME = 'StackTutor';\n\nmodule.exports = { APP_NAME };",
                                testCases: [{ input: "APP_NAME", expectedOutput: "StackTutor" }]
                            }
                        ]
                    },
                    {
                        slug: "functions",
                        title: "Functions",
                        description: "Understand how to create reusable blocks of code.",
                        longDescription: "Functions are one of the fundamental building blocks in JavaScript. A function is a reusable set of statements to perform a task or calculate a value.",
                        codeExample: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Alice'));",
                        externalLinks: [{ name: "MDN: Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" }],
                    }
                ]
            },
            {
                slug: "typescript",
                name: "TypeScript",
                description: "JavaScript that scales.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
                topics: [
                     {
                        slug: "types",
                        title: "Basic Types",
                        description: "Add static types to your JavaScript code.",
                        longDescription: "TypeScript extends JavaScript by adding types. By understanding and using types like `string`, `number`, and `boolean`, you can catch errors early and build more robust applications.",
                        codeExample: "let framework: string = 'React';\nlet version: number = 18;\nlet isAwesome: boolean = true;",
                        externalLinks: [{ name: "TypeScript Handbook: Basic Types", url: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html" }],
                    }
                ]
            },
            {
                slug: "html",
                name: "HTML",
                description: "Structure your web content.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg",
                topics: [
                     {
                        slug: "tags",
                        title: "HTML Tags",
                        description: "Learn about the basic building blocks of HTML.",
                        longDescription: "HTML tags are keywords surrounded by angle brackets that define how your web browser will format and display the content. Most tags have a start tag and an end tag.",
                        codeExample: "<h1>This is a heading</h1>\n<p>This is a paragraph.</p>",
                        externalLinks: [{ name: "MDN: HTML basics", url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics" }],
                    }
                ]
            }
        ]
    },
    {
        name: "Web Development (Backend)",
        languages: [
            {
                slug: "nodejs",
                name: "Node.js",
                description: "Run JavaScript on the server.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
                topics: [
                    {
                        slug: "express-intro",
                        title: "Introduction to Express",
                        description: "Build web servers and APIs with this popular framework.",
                        longDescription: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
                        codeExample: "const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(`Example app listening on port ${port}`);\n});",
                        externalLinks: [{ name: "Express.js Official Website", url: "https://expressjs.com/" }],
                    }
                ]
            },
             {
                slug: "python",
                name: "Python",
                description: "A versatile language for scripting, web, and data.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
                topics: [
                    {
                        slug: "data-structures",
                        title: "Data Structures",
                        description: "Learn about lists, dictionaries, and tuples.",
                        longDescription: "Python has several built-in data structures that are essential for any programmer, including lists for ordered sequences, dictionaries for key-value pairs, and tuples for immutable sequences.",
                        codeExample: "my_list = [1, 2, 3]\nmy_dict = {'key': 'value'}\nmy_tuple = (4, 5, 6)",
                        externalLinks: [{ name: "Official Python Docs: Data Structures", url: "https://docs.python.org/3/tutorial/datastructures.html" }],
                    }
                ]
            }
        ]
    }
];

export const techStack: {
    languages: TechOption[];
    frameworks: FrameworkOption[];
    databases: DatabaseOption[];
} = {
    languages: [
        { id: 'nodejs', name: 'Node.js' },
        { id: 'python', name: 'Python' },
        { id: 'php', name: 'PHP' },
        { id: 'java', name: 'Java' },
    ],
    frameworks: [
        { id: 'express', name: 'Express.js', language: 'nodejs' },
        { id: 'nestjs', name: 'NestJS', language: 'nodejs' },
        { id: 'fastapi', name: 'FastAPI', language: 'python' },
        { id: 'django', name: 'Django', language: 'python' },
        { id: 'laravel', name: 'Laravel', language: 'php' },
        { id: 'symfony', name: 'Symfony', language: 'php' },
        { id: 'spring', name: 'Spring Boot', language: 'java' },
    ],
    databases: [
        { id: 'mongodb', name: 'MongoDB' },
        { id: 'postgresql', name: 'PostgreSQL' },
        { id: 'mysql', name: 'MySQL' },
        { id: 'sqlite', name: 'SQLite' },
    ],
};
