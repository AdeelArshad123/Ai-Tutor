import React, { useState } from 'react';
import { OpenApiSpec, OpenApiOperation, OpenApiResponse, OpenApiPathItem } from '../types';
import { ChevronDownIcon } from './icons';
import CodeBlock from './CodeBlock';

const getMethodColor = (method: string): string => {
    switch (method.toUpperCase()) {
        case 'GET': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'POST': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'PUT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'PATCH': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
        case 'DELETE': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};

const MethodItem: React.FC<{ method: string, operation: OpenApiOperation, path: string }> = ({ method, operation, path }) => {
    const [isOpen, setIsOpen] = useState(true);

    const renderJsonExample = (content: any) => {
        if (!content) return null;
        const mimeType = Object.keys(content)[0];
        const example = content[mimeType]?.example || content[mimeType]?.schema?.example;
        if (example) {
            return <CodeBlock language="json" code={JSON.stringify(example, null, 2)} />;
        }
        return <p className="text-sm text-gray-500">No example available.</p>;
    };

    return (
        <div className={`border-t border-gray-200 dark:border-gray-700`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 text-left">
                <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-md text-sm font-bold w-20 text-center ${getMethodColor(method)}`}>{method.toUpperCase()}</span>
                     <span className="font-mono text-sm">{path}</span>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">{operation.summary}</p>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 dark:bg-black/20">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{operation.description || operation.summary}</p>
                    
                    {operation.parameters && operation.parameters.length > 0 && (
                         <div className="mb-4">
                            <h4 className="font-semibold mb-2">Parameters</h4>
                            <div className="text-sm border rounded-lg border-gray-200 dark:border-gray-700">
                                {operation.parameters.map(param => (
                                    <div key={param.name} className="flex items-start gap-4 p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                        <div className="font-mono font-semibold w-1/4">{param.name}{param.required && <span className="text-red-500">*</span>}</div>
                                        <div className="w-1/4"><span className="px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{param.in}</span></div>
                                        <div className="w-2/4 text-gray-600 dark:text-gray-400">{param.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                     {operation.requestBody && (
                        <div className="mb-4">
                            <h4 className="font-semibold mb-2">Request Body</h4>
                            {renderJsonExample(operation.requestBody.content)}
                        </div>
                    )}
                    
                     <div>
                        <h4 className="font-semibold mb-2">Responses</h4>
                         {Object.entries(operation.responses).map(([statusCode, response]) => {
                            // FIX: Cast the response object to the correct type to resolve TypeScript errors.
                            const typedResponse = response as OpenApiResponse;
                            return (
                                <div key={statusCode} className="mb-2">
                                    <p className="text-sm font-semibold">
                                        <span className={`mr-2 px-2 py-0.5 rounded-full text-xs ${statusCode.startsWith('2') ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                            {statusCode}
                                        </span> 
                                        {typedResponse.description}
                                    </p>
                                    {typedResponse.content && <div className="mt-2">{renderJsonExample(typedResponse.content)}</div>}
                                </div>
                            );
                        })}
                    </div>

                </div>
            )}
        </div>
    );
};


const ApiPreview: React.FC<{ spec: OpenApiSpec }> = ({ spec }) => {
    return (
        <div className="p-4">
             <h2 className="text-2xl font-bold mb-1">{spec.info.title}</h2>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Version {spec.info.version}</p>
             
             <div className="space-y-4">
                {Object.entries(spec.paths).map(([path, pathItem]) => (
                    <div key={path} className="bg-white dark:bg-gray-900/70 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                       {Object.entries(pathItem).map(([method, operation]) => (
                            <MethodItem key={method} method={method} operation={operation as OpenApiOperation} path={path} />
                       ))}
                    </div>
                ))}
             </div>
        </div>
    );
};

export default ApiPreview;