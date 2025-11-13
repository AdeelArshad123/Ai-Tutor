import { LearningCategory, FrameworkOption, TechOption, DatabaseOption, ResourceLink, Educator } from './types';

export const learningData: LearningCategory[] = [
    {
        name: "Web Development (Frontend)",
        languages: [
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
                    },
                    {
                        slug: "semantic-html",
                        title: "Semantic HTML",
                        description: "Use meaningful tags to structure your content.",
                        longDescription: "Semantic HTML tags provide meaning to the web page rather than just presentation. They are crucial for SEO and accessibility, helping search engines and screen readers understand the structure of your page.",
                        codeExample: "<header>\n  <h1>My Website</h1>\n</header>\n<nav>\n  <a href=\"/home\">Home</a>\n</nav>\n<main>\n  <article>\n    <h2>Article Title</h2>\n  </article>\n</main>\n<footer>\n  <p>Copyright 2024</p>\n</footer>",
                        externalLinks: [{ name: "MDN: Semantic HTML", url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html" }],
                    },
                    {
                        slug: "forms",
                        title: "Forms",
                        description: "Collect user input with forms.",
                        longDescription: "HTML forms are used to collect user input. The <form> element is a container for different types of input elements, such as text fields, checkboxes, radio buttons, submit buttons, and more.",
                        codeExample: "<form action=\"/submit-data\" method=\"post\">\n  <label for=\"username\">Username:</label>\n  <input type=\"text\" id=\"username\" name=\"username\">\n  <br>\n  <label for=\"password\">Password:</label>\n  <input type=\"password\" id=\"password\" name=\"password\">\n  <br>\n  <input type=\"submit\" value=\"Submit\">\n</form>",
                        externalLinks: [{ name: "MDN: Your first form", url: "https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form" }],
                    }
                ]
            },
            {
                slug: "css",
                name: "CSS",
                description: "Style your web applications.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg",
                topics: [
                     {
                        slug: "selectors",
                        title: "Selectors and Properties",
                        description: "Target and style elements on your page.",
                        longDescription: "CSS (Cascading Style Sheets) is used to style and lay out web pages. You use selectors to target HTML elements and apply properties to change their appearance.",
                        codeExample: "/* Selects all paragraphs */\np {\n  color: blue;\n  font-size: 16px;\n}\n\n/* Selects an element with id 'header' */\n#header {\n  background-color: lightgray;\n}",
                        externalLinks: [{ name: "MDN: CSS basics", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/Getting_started" }],
                    },
                    {
                        slug: "flexbox",
                        title: "Flexbox",
                        description: "A modern layout model for user interfaces.",
                        longDescription: "The Flexbox Layout module aims at providing a more efficient way to lay out, align and distribute space among items in a container, even when their size is unknown and/or dynamic.",
                        codeExample: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}",
                        externalLinks: [{ name: "CSS-Tricks: A Complete Guide to Flexbox", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/" }],
                    },
                     {
                        slug: "grid",
                        title: "CSS Grid",
                        description: "A two-dimensional layout system for the web.",
                        longDescription: "CSS Grid Layout is the most powerful layout system available in CSS. It is a 2-dimensional system, meaning it can handle both columns and rows, unlike flexbox which is largely a 1-dimensional system.",
                        codeExample: ".wrapper {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}",
                        externalLinks: [{ name: "CSS-Tricks: A Complete Guide to Grid", url: "https://css-tricks.com/snippets/css/complete-guide-grid/" }],
                    },
                     {
                        slug: "responsive-design",
                        title: "Responsive Design",
                        description: "Make your web pages look good on all devices.",
                        longDescription: "Responsive Web Design is about using HTML and CSS to automatically resize, hide, shrink, or enlarge, a website, to make it look good on all devices (desktops, tablets, and phones).",
                        codeExample: "/* On screens that are 600px wide or less, make the columns stack on top of each other */\n@media screen and (max-width: 600px) {\n  .column {\n    width: 100%;\n  }\n}",
                        externalLinks: [{ name: "MDN: Responsive Design", url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" }],
                    }
                ]
            },
            {
                slug: "javascript",
                name: "JavaScript",
                description: "The language of the web.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
                resources: [
                    { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: 'documentation', description: "The definitive and most trusted resource for web technologies, including JavaScript." },
                    { name: "javascript.info", url: "https://javascript.info/", type: 'article', description: "A modern JavaScript tutorial from basic to advanced topics with simple, but detailed explanations." },
                    { name: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia", type: 'youtube', description: "High-quality web development and programming tutorials, including many JavaScript projects." },
                    { name: "The Net Ninja", url: "https://www.youtube.com/@TheNetNinja", type: 'youtube', description: "Hundreds of free programming tutorials on modern JavaScript, Node.js, React, and more." },
                    { name: "You Don't Know JS", url: "https://github.com/getify/You-Dont-Know-JS", type: 'github', description: "A popular book series that dives deep into the core mechanisms of the JavaScript language." },
                ],
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
                        ],
                        resources: [
                            { name: "Video: Variables & Data Types", url: "https://www.youtube.com/watch?v=2l_n_3t2i3k", type: 'youtube', description: "A great visual explanation of variables from The Net Ninja." },
                            { name: "MDN: JavaScript data types", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures", type: 'documentation', description: "In-depth documentation on all of JavaScript's data types." },
                        ]
                    },
                    {
                        slug: "functions",
                        title: "Functions",
                        description: "Understand how to create reusable blocks of code.",
                        longDescription: "Functions are one of the fundamental building blocks in JavaScript. A function is a reusable set of statements to perform a task or calculate a value.",
                        codeExample: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Alice'));",
                        externalLinks: [{ name: "MDN: Functions", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions" }],
                    },
                    {
                        slug: "es6-features",
                        title: "ES6+ Features",
                        description: "Explore modern JavaScript syntax and features.",
                        longDescription: "ES6 (ECMAScript 2015) introduced many powerful features like arrow functions, `let` and `const`, template literals, destructuring, and the spread/rest operators, which are now standard in modern JS development.",
                        codeExample: "// Arrow Function\nconst add = (a, b) => a + b;\n\n// Destructuring\nconst { name, age } = { name: 'Bob', age: 30 };\n\n// Spread Operator\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];",
                        externalLinks: [{ name: "ES6 Features Guide", url: "https://www.w3schools.com/js/js_es6.asp" }],
                    },
                     {
                        slug: "async-await",
                        title: "Async/Await",
                        description: "Write asynchronous code that looks synchronous.",
                        longDescription: "Async/await is modern syntax for handling asynchronous operations, built on top of Promises. It makes asynchronous code easier to write and read by avoiding chains of `.then()` callbacks.",
                        codeExample: "async function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    console.log(data);\n  } catch (error) {\n    console.error('Fetching data failed:', error);\n  }\n}\n\nfetchData();",
                        externalLinks: [{ name: "MDN: async/await", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function" }],
                        resources: [
                            { name: "Fireship: The Async/Await Episode I Was Born To Make", url: "https://www.youtube.com/watch?v=vn3tm0quoqE", type: 'youtube', description: "A fast-paced and entertaining explanation of async/await." },
                            { name: "javascript.info: Async/await", url: "https://javascript.info/async-await", type: 'article', description: "A comprehensive article with clear examples and explanations." },
                        ]
                    },
                     {
                        slug: "dom-manipulation",
                        title: "DOM Manipulation",
                        description: "Interact with and change the content of a web page.",
                        longDescription: "The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. JavaScript is the primary language used to manipulate the DOM.",
                        codeExample: "// Find an element by its ID\nconst title = document.getElementById('main-title');\n\n// Change its text content\ntitle.textContent = 'Welcome to the DOM!';\n\n// Create a new element and add it to the page\nconst newItem = document.createElement('li');\nnewItem.textContent = 'New item';\ndocument.querySelector('ul').appendChild(newItem);",
                        externalLinks: [{ name: "MDN: Introduction to the DOM", url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction" }],
                    },
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
                    },
                    {
                        slug: "interfaces-vs-types",
                        title: "Interfaces vs. Types",
                        description: "Understand two ways to define object shapes.",
                        longDescription: "Both Interfaces and Type Aliases can be used to describe the shape of an object or a function signature. However, there are subtle differences. Interfaces are extendable, while type aliases can represent more complex structures like unions.",
                        codeExample: "interface User {\n  id: number;\n  name: string;\n}\n\ntype Product = {\n  id: string;\n  price: number;\n};",
                        externalLinks: [{ name: "TypeScript Docs: Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" }],
                    },
                    {
                        slug: "generics",
                        title: "Generics",
                        description: "Create reusable components that work with any data type.",
                        longDescription: "Generics allow you to create components that can work over a variety of types rather than a single one. This allows users to consume these components and use their own types.",
                        codeExample: "function identity<T>(arg: T): T {\n    return arg;\n}\n\nlet output = identity<string>(\"myString\");",
                        externalLinks: [{ name: "TypeScript Handbook: Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" }],
                    }
                ]
            },
            {
                slug: "react",
                name: "React",
                description: "A JavaScript library for building user interfaces.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
                resources: [
                    { name: "Official React Docs", url: "https://react.dev/", type: 'documentation', description: "The best place to start learning React, with interactive examples and tutorials." },
                    { name: "Kent C. Dodds Blog", url: "https://kentcdodds.com/blog", type: 'tutor', description: "A renowned educator in the React ecosystem, providing high-quality articles and courses." },
                    { name: "Awesome React", url: "https://github.com/enaqx/awesome-react", type: 'github', description: "A curated list of awesome things related to React, from tutorials to tools." },
                ],
                topics: [
                     {
                        slug: "components",
                        title: "Components",
                        description: "Build encapsulated components that manage their own state.",
                        longDescription: "Components are the core building block of React applications. They let you split the UI into independent, reusable pieces, and think about each piece in isolation.",
                        codeExample: "import React from 'react';\n\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nexport default Welcome;",
                        externalLinks: [{ name: "React Docs: Components", url: "https://react.dev/learn/your-first-component" }],
                    },
                    {
                        slug: "hooks",
                        title: "React Hooks",
                        description: "Use state and other React features without writing a class.",
                        longDescription: "Hooks are functions that let you “hook into” React state and lifecycle features from function components. The most common hooks are `useState` for managing local state and `useEffect` for handling side effects.",
                        codeExample: "import React, { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`;\n  });\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Click me\n    </button>\n  );\n}",
                        externalLinks: [{ name: "React Docs: Hooks", url: "https://react.dev/reference/react" }],
                    },
                     {
                        slug: "react-router",
                        title: "React Router",
                        description: "The standard library for routing in React.",
                        longDescription: "React Router enables client-side routing, allowing your app to have multiple views or pages without a page refresh. It keeps your UI in sync with the URL.",
                        codeExample: "// This is a simplified example of route setup\nimport { BrowserRouter, Routes, Route } from 'react-router-dom';\n\nfunction App() {\n  return (\n    <BrowserRouter>\n      <Routes>\n        <Route path=\"/\" element={<Home />} />\n        <Route path=\"/about\" element={<About />} />\n      </Routes>\n    </BrowserRouter>\n  );\n}",
                        externalLinks: [{ name: "React Router Docs", url: "https://reactrouter.com/en/main" }],
                    }
                ]
            },
             {
                slug: "vuejs",
                name: "Vue.js",
                description: "The Progressive JavaScript Framework.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original.svg",
                topics: [
                     {
                        slug: "instance",
                        title: "The Vue Instance",
                        description: "Learn about the heart of a Vue application.",
                        longDescription: "Every Vue application is bootstrapped by creating a new Vue instance with the `createApp` function. It serves as the root of your component tree.",
                        codeExample: "import { createApp } from 'vue'\n\ncreateApp({\n  data() {\n    return {\n      message: 'Hello Vue!'\n    }\n  }\n}).mount('#app')",
                        externalLinks: [{ name: "Vue Docs: Creating an Application", url: "https://vuejs.org/guide/essentials/application.html" }],
                    },
                     {
                        slug: "components",
                        title: "Vue Components",
                        description: "Create reusable, self-contained blocks of code.",
                        longDescription: "Components are reusable Vue instances with a name. We can use them as custom elements inside a root Vue instance created with `new Vue`. They help in organizing complex UIs.",
                        codeExample: "<template>\n  <button @click=\"count++\">{{ count }}</button>\n</template>\n\n<script>\nexport default {\n  data() {\n    return {\n      count: 0\n    }\n  }\n}\n</script>",
                        externalLinks: [{ name: "Vue Docs: Components Basics", url: "https://vuejs.org/guide/essentials/component-basics.html" }],
                    }
                ]
            },
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
                resources: [
                     { name: "Official Node.js Docs", url: "https://nodejs.org/en/docs", type: 'documentation', description: "The official documentation for the Node.js runtime." },
                     { name: "Express.js Official Site", url: "https://expressjs.com/", type: 'documentation', description: "The official site for the most popular Node.js web framework." },
                     { name: "Awesome Node.js", url: "https://github.com/sindresorhus/awesome-nodejs", type: 'github', description: "A deluxe curated list of delightful Node.js packages and resources." },
                ],
                topics: [
                    {
                        slug: "express-intro",
                        title: "Introduction to Express",
                        description: "Build web servers and APIs with this popular framework.",
                        longDescription: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
                        codeExample: "const express = require('express');\nconst app = express();\nconst port = 3000;\n\napp.get('/', (req, res) => {\n  res.send('Hello World!');\n});\n\napp.listen(port, () => {\n  console.log(`Example app listening on port ${port}`);\n});",
                        externalLinks: [{ name: "Express.js Official Website", url: "https://expressjs.com/" }],
                    },
                    {
                        slug: "rest-api",
                        title: "Building a REST API",
                        description: "Design and build RESTful APIs with Node.js and Express.",
                        longDescription: "Learn the principles of REST (Representational State Transfer) and apply them to build a structured API with routes for handling different HTTP methods like GET, POST, PUT, and DELETE.",
                        codeExample: "// A simple GET route for fetching all users\napp.get('/api/users', (req, res) => {\n  // In a real app, you would fetch from a database\n  const users = [{ id: 1, name: 'Alice' }];\n  res.json(users);\n});\n\n// A simple POST route for creating a user\napp.post('/api/users', (req, res) => {\n  const newUser = req.body;\n  // Logic to save the user to a database\n  res.status(201).json(newUser);\n});",
                        externalLinks: [{ name: "MDN: What is a REST API?", url: "https://developer.mozilla.org/en-US/docs/Glossary/REST" }],
                    },
                    {
                        slug: "express-middleware",
                        title: "Express Middleware",
                        description: "Understand functions that have access to the request and response objects.",
                        longDescription: "Middleware functions are functions that execute during the lifecycle of a request to the Express server. Each middleware has access to the request (req), response (res), and the next middleware function in the application’s request-response cycle.",
                        codeExample: "const myLogger = function (req, res, next) {\n  console.log('LOGGED');\n  next(); // Pass control to the next middleware\n};\n\napp.use(myLogger);",
                        externalLinks: [{ name: "Express.js: Using middleware", url: "https://expressjs.com/en/guide/using-middleware.html" }],
                    }
                ]
            },
             {
                slug: "python",
                name: "Python",
                description: "A versatile language for scripting, web, and data.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
                resources: [
                    { name: "Official Python Docs", url: "https://docs.python.org/3/", type: 'documentation', description: "The official, comprehensive documentation for the Python language." },
                    { name: "Real Python", url: "https://realpython.com/", type: 'article', description: "High-quality tutorials and articles on a wide range of Python topics." },
                    { name: "Corey Schafer", url: "https://www.youtube.com/@coreyms", type: 'youtube', description: "Excellent in-depth tutorials for beginners to advanced programmers." },
                    { name: "Awesome Python", url: "https://github.com/vinta/awesome-python", type: 'github', description: "A curated list of awesome Python frameworks, libraries, software and resources." },
                ],
                topics: [
                    {
                        slug: "django-intro",
                        title: "Introduction to Django",
                        description: "The web framework for perfectionists with deadlines.",
                        longDescription: "Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development.",
                        codeExample: "# polls/views.py\nfrom django.http import HttpResponse\n\ndef index(request):\n    return HttpResponse(\"Hello, world. You're at the polls index.\")",
                        externalLinks: [{ name: "Django Project Website", url: "https://www.djangoproject.com/" }],
                    },
                    {
                        slug: "flask-intro",
                        title: "Introduction to Flask",
                        description: "A lightweight WSGI web application framework.",
                        longDescription: "Flask is a micro web framework written in Python. It is classified as a microframework because it does not require particular tools or libraries. It has no database abstraction layer, form validation, or any other components where pre-existing third-party libraries provide common functions.",
                        codeExample: "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef hello_world():\n    return 'Hello, World!'",
                        externalLinks: [{ name: "Flask Project Website", url: "https://flask.palletsprojects.com/" }],
                    },
                    {
                        slug: "fastapi-intro",
                        title: "Introduction to FastAPI",
                        description: "A modern, fast web framework for building APIs.",
                        longDescription: "FastAPI is a modern, high-performance web framework for building APIs with Python 3.7+ based on standard Python type hints. It's known for its incredible performance, automatic interactive documentation, and ease of use.",
                        codeExample: "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get(\"/\")\ndef read_root():\n    return {\"Hello\": \"World\"}",
                        externalLinks: [{ name: "FastAPI Official Website", url: "https://fastapi.tiangolo.com/" }],
                    }
                ]
            },
            {
                slug: "go",
                name: "Go",
                description: "A statically typed, compiled language from Google.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg",
                topics: [
                    {
                        slug: "goroutines",
                        title: "Goroutines",
                        description: "Learn about Go's lightweight approach to concurrency.",
                        longDescription: "A goroutine is a lightweight thread managed by the Go runtime. They allow for concurrent execution of functions, making it easy to build highly concurrent applications.",
                        codeExample: "package main\n\nimport (\n\t\"fmt\"\n\t\"time\"\n)\n\nfunc say(s string) {\n\tfor i := 0; i < 5; i++ {\n\t\ttime.Sleep(100 * time.Millisecond)\n\t\tfmt.Println(s)\n\t}\n}\n\nfunc main() {\n\tgo say(\"world\")\n\tsay(\"hello\")\n}",
                        externalLinks: [{ name: "Go Docs: Goroutines", url: "https://go.dev/tour/concurrency/1" }],
                    },
                     {
                        slug: "channels",
                        title: "Channels",
                        description: "Synchronize and communicate between goroutines.",
                        longDescription: "Channels are a typed conduit through which you can send and receive values with the channel operator, <-. They are the primary way to manage state and concurrency in Go.",
                        codeExample: "package main\n\nimport \"fmt\"\n\nfunc sum(s []int, c chan int) {\n\tsum := 0\n\tfor _, v := range s {\n\t\tsum += v\n\t}\n\tc <- sum // send sum to c\n}\n\nfunc main() {\n\ts := []int{7, 2, 8, -9, 4, 0}\n\tc := make(chan int)\n\tgo sum(s[:len(s)/2], c)\n\tgo sum(s[len(s)/2:], c)\n\tx, y := <-c, <-c // receive from c\n\n\tfmt.Println(x, y, x+y)\n}",
                        externalLinks: [{ name: "Go Docs: Channels", url: "https://go.dev/tour/concurrency/2" }],
                    }
                ]
            },
            {
                slug: "ruby",
                name: "Ruby",
                description: "A dynamic, open source programming language with a focus on simplicity and productivity.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/ruby/ruby-original.svg",
                topics: [
                    {
                        slug: "rails-intro",
                        title: "Introduction to Rails",
                        description: "A web-application framework that includes everything needed to create database-backed web applications.",
                        longDescription: "Ruby on Rails — often simply Rails — is a server-side web application framework written in Ruby. Rails is a model–view–controller (MVC) framework, providing default structures for a database, a web service, and web pages.",
                        codeExample: "# app/controllers/articles_controller.rb\nclass ArticlesController < ApplicationController\n  def index\n    @articles = Article.all\n  end\nend",
                        externalLinks: [{ name: "Ruby on Rails Guides", url: "https://guides.rubyonrails.org/" }],
                    },
                    {
                        slug: "rails-mvc",
                        title: "Rails MVC Architecture",
                        description: "Understand the Model-View-Controller pattern in Rails.",
                        longDescription: "MVC is a design pattern that separates the representation of information from the user's interaction with it. In Rails, Models handle data and business logic, Views handle the UI, and Controllers route requests and orchestrate the other two.",
                        codeExample: "# Model (app/models/article.rb)\nclass Article < ApplicationRecord\n  validates :title, presence: true\nend\n\n# Controller (app/controllers/articles_controller.rb)\nclass ArticlesController < ApplicationController\n  def show\n    @article = Article.find(params[:id])\n  end\nend\n\n# View (app/views/articles/show.html.erb)\n<h1><%= @article.title %></h1>",
                        externalLinks: [{ name: "Rails Guides: MVC", url: "https://guides.rubyonrails.org/getting_started.html#the-mvc-architecture" }],
                    }
                ]
            }
        ]
    },
    {
        name: "Databases",
        languages: [
             {
                slug: "postgresql",
                name: "PostgreSQL",
                description: "The world's most advanced open source relational database.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg",
                topics: [
                    {
                        slug: "select-queries",
                        title: "SELECT Queries",
                        description: "Learn how to retrieve data from your tables.",
                        longDescription: "The SELECT statement is used to query the database and retrieve data that matches criteria that you specify. It's the most frequently used command in SQL.",
                        codeExample: "SELECT first_name, last_name\nFROM employees\nWHERE department = 'Sales'\nORDER BY last_name ASC;",
                        externalLinks: [{ name: "PostgreSQL Tutorial: SELECT", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-select/" }],
                    },
                    {
                        slug: "joins",
                        title: "JOINs",
                        description: "Combine rows from two or more tables.",
                        longDescription: "A JOIN clause is used to combine rows from two or more tables, based on a related column between them. Types of joins include INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.",
                        codeExample: "SELECT orders.order_id, customers.customer_name\nFROM orders\nINNER JOIN customers ON orders.customer_id = customers.customer_id;",
                        externalLinks: [{ name: "PostgreSQL Tutorial: Joins", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/" }],
                    }
                ]
            },
            {
                slug: "mongodb",
                name: "MongoDB",
                description: "A general purpose, document-based, distributed database.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
                topics: [
                    {
                        slug: "documents",
                        title: "Documents and Collections",
                        description: "Understand the core concepts of NoSQL data modeling.",
                        longDescription: "MongoDB stores data records as BSON documents. BSON is a binary representation of JSON documents. A collection is a grouping of MongoDB documents, analogous to a table in a relational database.",
                        codeExample: "// A document in a 'users' collection\n{\n  \"_id\": ObjectId(\"60c72b2f9b1d8e5a4e6b5f1a\"),\n  \"name\": \"Alice\",\n  \"email\": \"alice@example.com\",\n  \"roles\": [\"user\", \"editor\"]\n}",
                        externalLinks: [{ name: "MongoDB Docs: Documents", url: "https://www.mongodb.com/docs/manual/core/document/" }],
                    },
                    {
                        slug: "aggregation",
                        title: "Aggregation Pipeline",
                        description: "Process data records and return computed results.",
                        longDescription: "The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results.",
                        codeExample: "// Example: Group documents by the 'category' field and count them\ndb.products.aggregate([\n  { $group: { _id: \"$category\", count: { $sum: 1 } } }\n])",
                        externalLinks: [{ name: "MongoDB Docs: Aggregation", url: "https://www.mongodb.com/docs/manual/aggregation/" }],
                    }
                ]
            }
        ]
    },
     {
        name: "DevOps & Tooling",
        languages: [
             {
                slug: "git",
                name: "Git",
                description: "A free and open source distributed version control system.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
                topics: [
                    {
                        slug: "basic-commands",
                        title: "Basic Commands",
                        description: "Learn the essential commands for version control.",
                        longDescription: "Git is a version control system that lets you track changes to files. Learn essential commands like `git clone`, `git add`, `git commit`, `git push`, and `git pull` to manage your codebase.",
                        codeExample: "# Clone a repository\ngit clone https://github.com/example/repo.git\n\n# Stage changes\ngit add .\n\n# Commit changes\ngit commit -m \"Add new feature\"\n\n# Push changes to remote\ngit push origin main",
                        externalLinks: [{ name: "Official Git Documentation", url: "https://git-scm.com/doc" }],
                    },
                    {
                        slug: "branching",
                        title: "Branching and Merging",
                        description: "Work on different features in parallel.",
                        longDescription: "Branching in Git means you diverge from the main line of development and continue to do work without messing with that main line. This is a crucial feature for team collaboration. Once a feature is complete, you can merge it back into the main branch.",
                        codeExample: "# Create a new branch\ngit checkout -b new-feature\n\n# ... do some work and commit ...\n\n# Switch back to the main branch\ngit checkout main\n\n# Merge the new feature into main\ngit merge new-feature",
                        externalLinks: [{ name: "Git Docs: Basic Branching and Merging", url: "https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging" }],
                    }
                ]
            },
            {
                slug: "docker",
                name: "Docker",
                description: "A platform for developing, shipping, and running applications in containers.",
                logo: "https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg",
                topics: [
                    {
                        slug: "dockerfile",
                        title: "Dockerfile Basics",
                        description: "Learn how to define your application's environment.",
                        longDescription: "A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. `docker build` uses this file to automate the process of creating a container image.",
                        codeExample: "# Use an official Node.js runtime as a parent image\nFROM node:18-alpine\n\n# Set the working directory in the container\nWORKDIR /usr/src/app\n\n# Copy package.json and package-lock.json\nCOPY package*.json ./\n\n# Install app dependencies\nRUN npm install\n\n# Bundle app source\nCOPY . .\n\n# Your app binds to port 3000\nEXPOSE 3000\n\n# Define the command to run your app\nCMD [ \"node\", \"server.js\" ]",
                        externalLinks: [{ name: "Dockerfile reference", url: "https://docs.docker.com/engine/reference/builder/" }],
                    },
                    {
                        slug: "docker-compose",
                        title: "Docker Compose",
                        description: "Define and run multi-container Docker applications.",
                        longDescription: "Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.",
                        codeExample: "version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - \"8000:5000\"\n  redis:\n    image: \"redis:alpine\"",
                        externalLinks: [{ name: "Docker Compose Overview", url: "https://docs.docker.com/compose/" }],
                    }
                ]
            }
        ]
    }
];

export const topEducators: Educator[] = [
  {
    name: 'Fireship.io',
    description: 'High-intensity code tutorials to help you build & ship apps fast. Covers a wide range of modern technologies.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k-p2i-3hQ2I3L2_2LPl27l_2i2PAw5YAl_gA=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/c/fireship',
      website: 'https://fireship.io/',
      github: 'https://github.com/fireship-io'
    }
  },
  {
    name: 'Traversy Media',
    description: 'Project-based learning for web development, from HTML/CSS to full stack applications with various languages and frameworks.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k9-3AorgVK3iHk_3_2qxDb3eiD35J2O1o2Dg=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@TraversyMedia',
      website: 'https://www.traversymedia.com/',
      github: 'https://github.com/bradtraversy'
    }
  },
  {
    name: 'The Net Ninja',
    description: 'High-quality, bite-sized tutorials on modern JavaScript, Node.js, React, Vue, Firebase, and more.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k-38-a7Gf_Mu3Jt_V-21Qof2YJb_7aTfQOQ=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@TheNetNinja',
      website: 'https://netninja.dev/',
      github: 'https://github.com/iamshaunjp'
    }
  },
  {
    name: 'Web Dev Simplified',
    description: 'Making the web easy to understand with tutorials on building and deploying applications, focusing on clarity.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k-48g5-2iN2oXTVi-2f_8A5z5pQ_uI7pIuQ=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@WebDevSimplified',
      website: 'https://webdevsimplified.com/',
      github: 'https://github.com/WebDevSimplified'
    }
  },
  {
    name: 'Kent C. Dodds',
    description: 'A renowned educator in the React ecosystem, providing high-quality articles, courses, and workshops on testing and app quality.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k-B7Y-sKPso-1k-d5zx3-k0j_UNbe-5L4iQ=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@KentCDodds',
      website: 'https://kentcdodds.com/',
      github: 'https://github.com/kentcdodds'
    }
  },
  {
    name: 'freeCodeCamp.org',
    description: 'A non-profit organization that consists of an interactive learning web platform, an online community forum, and thousands of hours of video tutorials.',
    avatarUrl: 'https://yt3.googleusercontent.com/ytc/AIdro_k-1Q-9r_K4-x51c-a02e-2e_8A1z-5p_uI=s176-c-k-c0x00ffffff-no-rj',
    links: {
      youtube: 'https://www.youtube.com/@freecodecamp',
      website: 'https://www.freecodecamp.org/',
      github: 'https://github.com/freeCodeCamp'
    }
  }
];

export const featuredResources: ResourceLink[] = [
    {
        name: "MDN Web Docs",
        url: "https://developer.mozilla.org/",
        type: "documentation",
        description: "The ultimate resource for web standards, from HTML and CSS to JavaScript APIs."
    },
    {
        name: "freeCodeCamp",
        url: "https://www.freecodecamp.org/news/",
        type: "article",
        description: "In-depth articles and tutorials on all things programming and development."
    },
    {
        name: "Top Full Stack Educators",
        url: "#",
        type: "educators",
        description: "Curated list of the best channels and tutors for learning full stack development."
    },
    {
        name: "CSS-Tricks",
        url: "https://css-tricks.com/",
        type: "article",
        description: "A go-to site for everything CSS, from snippets and guides to deep dives."
    },
    {
        name: "Dev.to",
        url: "https://dev.to/",
        type: "tutor",
        description: "A constructive and inclusive social network for software developers."
    },
    {
        name: "Awesome Lists",
        url: "https://github.com/sindresorhus/awesome",
        type: "github",
        description: "A massive, curated collection of awesome lists for all technologies."
    },
];

export const techStack: {
    languages: TechOption[];
    frameworks: FrameworkOption[];
    databases: DatabaseOption[];
} = {
    languages: [
        { id: 'nodejs', name: 'Node.js' },
        { id: 'python', name: 'Python' },
        { id: 'go', name: 'Go' },
        { id: 'ruby', name: 'Ruby' },
        { id: 'php', name: 'PHP' },
        { id: 'java', name: 'Java' },
        { id: 'csharp', name: 'C#' },
        { id: 'rust', name: 'Rust' },
        { id: 'kotlin', name: 'Kotlin' },
        { id: 'elixir', name: 'Elixir' },
        { id: 'scala', name: 'Scala' },
        { id: 'swift', name: 'Swift' },
    ],
    // FIX: Add language property to each framework to enable filtering.
    frameworks: [
        { id: 'express', name: 'Express.js', language: 'nodejs' },
        { id: 'nestjs', name: 'NestJS', language: 'nodejs' },
        { id: 'fastapi', name: 'FastAPI', language: 'python' },
        { id: 'django', name: 'Django', language: 'python' },
        { id: 'gin', name: 'Gin', language: 'go' },
        { id: 'rails', name: 'Ruby on Rails', language: 'ruby' },
        { id: 'laravel', name: 'Laravel', language: 'php' },
        { id: 'symfony', name: 'Symfony', language: 'php' },
        { id: 'spring', name: 'Spring Boot', language: 'java' },
        { id: 'aspnet', name: 'ASP.NET Core', language: 'csharp' },
        { id: 'ktor', name: 'Ktor', language: 'kotlin' },
        { id: 'actix', name: 'Actix Web', language: 'rust' },
        { id: 'phoenix', name: 'Phoenix', language: 'elixir' },
        { id: 'play', name: 'Play Framework', language: 'scala' },
        { id: 'akka-http', name: 'Akka HTTP', language: 'scala' },
        { id: 'vapor', name: 'Vapor', language: 'swift' },
    ],
    databases: [
        { id: 'mongodb', name: 'MongoDB' },
        { id: 'postgresql', name: 'PostgreSQL' },
        { id: 'mysql', name: 'MySQL' },
        { id: 'sqlite', name: 'SQLite' },
        { id: 'redis', name: 'Redis' },
    ],
};

export const testingFrameworks: { [language: string]: TechOption[] } = {
    'nodejs': [
        { id: 'jest', name: 'Jest' },
        { id: 'mocha', name: 'Mocha' },
        { id: 'vitest', name: 'Vitest' },
    ],
    'python': [
        { id: 'pytest', name: 'Pytest' },
        { id: 'unittest', name: 'Unittest' },
    ],
    'go': [
        { id: 'testing', name: 'testing (standard library)' },
        { id: 'testify', name: 'Testify' },
    ],
    'ruby': [
        { id: 'rspec', name: 'RSpec' },
        { id: 'minitest', name: 'Minitest' },
    ],
    'php': [
        { id: 'phpunit', name: 'PHPUnit' },
        { id: 'pest', name: 'Pest' },
    ],
    'java': [
        { id: 'junit', name: 'JUnit' },
        { id: 'mockito', name: 'Mockito' },
    ],
    'csharp': [
        { id: 'nunit', name: 'NUnit' },
        { id: 'xunit', name: 'xUnit' },
        { id: 'mstest', name: 'MSTest' },
    ],
    'rust': [
        { id: 'cargo-test', name: 'cargo test (standard)' },
    ],
    'kotlin': [
        { id: 'junit', name: 'JUnit' },
        { id: 'kotest', name: 'Kotest' },
    ],
    'elixir': [
        { id: 'exunit', name: 'ExUnit (standard)' },
    ],
    'scala': [
        { id: 'scalatest', name: 'ScalaTest' },
        { id: 'specs2', name: 'Specs2' },
    ],
    'swift': [
        { id: 'xctest', name: 'XCTest (standard)' },
    ],
    'javascript': [
        { id: 'jest', name: 'Jest' },
        { id: 'mocha', name: 'Mocha' },
        { id: 'vitest', name: 'Vitest' },
        { id: 'cypress', name: 'Cypress' },
    ],
    'typescript': [
        { id: 'jest', name: 'Jest' },
        { id: 'mocha', name: 'Mocha' },
        { id: 'vitest', name: 'Vitest' },
    ],
};

export const deploymentTargets: TechOption[] = [
    { id: 'vercel', name: 'Vercel' },
    { id: 'render', name: 'Render' },
    { id: 'docker', name: 'Docker' },
    { id: 'aws-lambda', name: 'Serverless (AWS Lambda)' },
];