"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
// Removing the problematic import: import { Send, Plus, FileText, Image, ClipboardList, TrendingUp, Bot, User, X } from 'lucide-react';

// --- Icon Definitions (Inline SVGs to replace Lucide icons) ---

const Icon = ({ children, className = "w-5 h-5" }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        {children}
    </svg>
);

const SendIcon = (props) => (
    <Icon {...props}><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></Icon>
);
const PlusIcon = (props) => (
    <Icon {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>
);
const FileTextIcon = (props) => (
    <Icon {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></Icon>
);
const ImageIcon = (props) => (
    <Icon {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></Icon>
);
const ClipboardListIcon = (props) => (
    <Icon {...props}><rect x="9" y="4" width="6" height="4" rx="1"/><path d="M8 12h8"/><path d="M8 16h5"/><path d="M16 8v16H8V8h8z"/></Icon>
);
const TrendingUpIcon = (props) => (
    <Icon {...props}><polyline points="22 7 13 16 9 12 2 19"/><polyline points="16 7 22 7 22 13"/></Icon>
);
const BotIcon = (props) => (
    <Icon {...props}><path d="M12 8V4"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M10 10v6"/><path d="M14 10v6"/><path d="M8 14h8"/><path d="M12 22a4 4 0 0 0 4-4H8a4 4 0 0 0 4 4z"/></Icon>
);
const UserIcon = (props) => (
    <Icon {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Icon>
);
const XIcon = (props) => (
    <Icon {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>
);

// --- API Configuration Cleanup ---
// Removed direct Gemini API configuration variables (model, apiKey, apiUrl)
// as we are now calling the local backend route /api/ai.

// Helper to simulate exponential backoff for API retries (kept general)
const retryFetch = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
        } catch (error) {
            if (i === retries - 1) {
                console.error("Fetch failed after all retries:", error);
                throw error;
            }
            const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// --- Initial Message ---
const initialMessage = {
    id: 1,
    role: 'model',
    text: "Hello Admin! I'm your Supermarket AI Assistant. I can help you with inventory, pricing, market trends, or analyzing your staff data. Just ask, or use the '+' button for quick actions!",
};

export default function AiAssistant() {
    const [chatHistory, setChatHistory] = useState([initialMessage]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    
    // Ref for auto-scrolling
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll whenever chat history updates
    useEffect(scrollToBottom, [chatHistory]);

    // Function to handle the LLM API call
    const sendMessage = useCallback(async (query) => {
        if (!query.trim() || isLoading) return;

        // 1. Add user message to history
        const userMessage = { id: Date.now(), role: 'user', text: query };
        setChatHistory(prev => [...prev, userMessage]);
        setInput(""); // Clear input
        setIsLoading(true);
        setShowAttachmentMenu(false);

        // --- NEW API CALL LOGIC ---
        // We are now calling the local backend route /api/ai 
        // which uses the user's OpenAI setup.
        
        const payload = { 
            message: query // Only send the 'message' text to the backend
        };

        try {
            // Call the local backend API route /api/ai
            const response = await retryFetch("/api/ai", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            let aiText = "Sorry, I couldn't get a response from your AI backend.";
            
            // The user's backend returns { reply: "..." }
            if (result && result.reply) {
                aiText = result.reply;
            }

            // 2. Add AI response to history
            const aiMessage = { id: Date.now() + 1, role: 'model', text: aiText };
            setChatHistory(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Local API call failed:", error);
            const errorMessage = {
                id: Date.now() + 1,
                role: 'model',
                text: "An error occurred while communicating with your local backend service (/api/ai). Please ensure your API route is running correctly and check the server logs.",
            };
            setChatHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    const handleInputSend = () => {
        sendMessage(input);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleInputSend();
        }
    };

    // --- Sub-Components (Icons and structure remain the same) ---

    const Message = ({ message }) => {
        const isUser = message.role === 'user';
        // Changed icon components to the inline SVGs defined above
        const icon = isUser ? <UserIcon className="w-5 h-5 text-white" /> : <BotIcon className="w-5 h-5 text-indigo-500" />;
        const bgColor = isUser ? 'bg-indigo-600' : 'bg-white shadow-sm border border-gray-100';
        const textColor = isUser ? 'text-white' : 'text-gray-800';
        const align = isUser ? 'justify-end' : 'justify-start';

        return (
            <div className={`flex ${align} mb-4 max-w-[90%] md:max-w-[70%]`}>
                {!isUser && (
                    <div className="shrink-0 mr-3 p-2 bg-indigo-100 rounded-full self-start">
                        {icon}
                    </div>
                )}
                <div className={`p-3 rounded-xl ${isUser ? 'rounded-br-none' : 'rounded-tl-none'} ${bgColor} ${textColor} whitespace-pre-wrap`}>
                    <p className="text-sm">{message.text}</p>
                </div>
                {isUser && (
                    <div className="shrink-0 ml-3 p-2 bg-indigo-500 rounded-full self-start">
                        {icon}
                    </div>
                )}
            </div>
        );
    };

    const AttachmentMenu = () => (
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-xl shadow-2xl p-3 border border-gray-100 transition-all duration-300 transform origin-bottom-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Actions:</h3>
            <div className="space-y-2">
                <button 
                    className="flex items-center w-full p-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => {sendMessage("What is the current market trend for dairy products?");}}
                >
                    {/* Changed icon component */}
                    <TrendingUpIcon className="w-4 h-4 mr-2 text-green-500" />
                    Market Trend Analysis
                </button>
                <button 
                    className="flex items-center w-full p-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => {sendMessage("Suggest an optimized staff schedule for a busy weekend.");}}
                >
                    {/* Changed icon component */}
                    <ClipboardListIcon className="w-4 h-4 mr-2 text-orange-500" />
                    Staff Scheduling Suggestion
                </button>
                <button 
                    className="flex items-center w-full p-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => {
                        // This action would typically trigger a file upload modal, 
                        // but here we simulate a query.
                        sendMessage("Analyze the last 7 days of sales data and highlight 3 unexpected findings.");
                    }}
                >
                    {/* Changed icon component */}
                    <FileTextIcon className="w-4 h-4 mr-2 text-blue-500" />
                    Analyze Sales Report (Simulated)
                </button>
                <button 
                    className="flex items-center w-full p-2 rounded-lg text-sm text-gray-700 hover:bg-indigo-50 transition"
                    onClick={() => {
                        // This action would typically trigger an image upload for visual analysis
                        sendMessage("What is the optimal price point for a generic brand coffee based on current inflation?");
                    }}
                >
                    {/* Changed icon component */}
                    <ImageIcon className="w-4 h-4 mr-2 text-red-500" />
                    Pricing Strategy (Simulated)
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-screen bg-gray-50 antialiased font-sans">
            {/* Header */}
            <div className="p-4 bg-white shadow-md flex items-center justify-between shrink-0">
                <h1 className="text-xl font-bold text-indigo-700 flex items-center">
                    {/* Changed icon component */}
                    <BotIcon className="w-6 h-6 mr-2 text-indigo-500" />
                    Supermarket  Assistant AI
                </h1>
                <div className="text-sm text-gray-500 hidden sm:block">
                    Powered by Your Custom OpenAI Service
                </div>
            </div>

            {/* Chat History Area (Main Content) */}
            <div className="grow overflow-y-auto p-4 md:p-6 space-y-4">
                {chatHistory.map((msg) => (
                    <Message key={msg.id} message={msg} />
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                         <div className="shrink-0 mr-3 p-2 bg-indigo-100 rounded-full self-start">
                            {/* Changed icon component */}
                            <BotIcon className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="p-3 rounded-xl rounded-tl-none bg-white shadow-sm border border-gray-100 text-gray-500 text-sm">
                            <span className="animate-pulse">AI is thinking...</span>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (Sticky Footer - Like a modern chat interface) */}
            <div className="relative p-4 bg-white border-t border-gray-200 shrink-0">
                
                {/* Attachment Menu Popover */}
                <div className="absolute left-4 -top-2 transform -translate-y-full">
                    {showAttachmentMenu && <AttachmentMenu />}
                </div>

                <div className="flex items-center space-x-2">
                    {/* Attachment Button (+) */}
                    <button
                        className="p-3 rounded-full bg-gray-100 text-indigo-600 hover:bg-gray-200 transition-colors duration-200 shadow-md"
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                    >
                         {/* Changed icon component */}
                         {showAttachmentMenu ? <XIcon className="w-5 h-5" /> : <PlusIcon className="w-5 h-5" />}
                    </button>

                    {/* Input Field */}
                    <div className="grow relative">
                        <textarea
                            className="w-full p-3 pr-10 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 max-h-40 min-h-11"
                            placeholder="Ask me anything about your supermarket operations..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                            input.trim() && !isLoading
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        onClick={handleInputSend}
                        disabled={!input.trim() || isLoading}
                    >
                        {/* Changed icon component */}
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}