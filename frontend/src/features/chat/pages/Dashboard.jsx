import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import { Send, Image, Menu, X } from 'lucide-react';
import MarkdownContent from '../components/MarkdownContent';
import MessageActions from '../components/MessageActions';
import { useAuth } from '../../auth/hooks/useAuth';


function Dashboard() {
    const chats = useSelector((state) => state.chat);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const { user } = useSelector((state) => state.auth);
    const chat = useChat();
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const { handleLogout } = useAuth();

    const fileInputRef = useRef(null);

    const messagesEndRef = useRef(null);

    // ✅ Auto scroll on new messages / tokens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats.chats[currentChatId]?.messages?.length,
    chats.chats[currentChatId]?.messages?.at(-1)?.content]);

    useEffect(() => {
        chat.initializeSocketConnection();
        chat.handleGetChats();
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' && !selectedImage) return;
        chat.handleSendMessage({ message: inputValue, chatId: currentChatId });
        setInputValue('');
        setSelectedImage(null);
    };




    const messages = chats.chats[currentChatId]?.messages ?? [];

    const handleLogoutFunction = async () => {
        await handleLogout();
    }


    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden relative">
            {/* Mobile sidebar with overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 z-30 bg-black/50"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
            {/* Mobile Sidebar - no change needed, already works */}
            <aside
                className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-40 transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="overflow-y-auto p-4 border-b border-gray-800 flex items-center justify-between gap-2">
                    <button onClick={() => chat.handleCreateChat()} className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors">
                        + New Chat
                    </button>
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="p-2.5 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                        title="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2 no-scrollbar pt-4">
                    {Object.values(chats.chats || {}).map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                                chat.handleOpenChat(c.id);
                                setIsMobileSidebarOpen(false);
                            }}
                            className={`w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium transition truncate ${currentChatId === c.id
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-950 text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            title={c.title}
                        >
                            {c.title}
                        </button>
                    ))}
                </div>
            </aside>


            {/* Desktop Sidebar - added h-screen, removed overflow-y-auto from aside */}
            <aside className="hidden md:flex h-screen w-full md:w-56 lg:w-64 bg-gray-950 border-r border-gray-800 flex-col">
                <div className="p-3 md:p-4 border-b border-gray-800">
                    <button onClick={() => chat.handleCreateChat()} className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs md:text-sm font-medium transition-colors">
                        + New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col gap-2 md:gap-3 p-2 pt-3 md:pt-5 no-scrollbar">
                    {Object.values(chats.chats || {}).map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => chat.handleOpenChat(c.id)}
                            className={`w-full cursor-pointer rounded-lg md:rounded-xl px-2 md:px-3 py-2 text-left text-xs md:text-sm font-medium transition truncate ${currentChatId === c.id
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-950 text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            title={c.title}
                        >
                            {c.title}
                        </button>
                    ))}
                </div>

                <div className="p-3 md:p-4 border-t border-gray-800">

                    <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-[#4E868D] flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium truncate">{user?.username || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogoutFunction} className="w-full text-right px-3 md:px-4 py-2 md:py-2.5  rounded-lg text-xl md:text-sm font-medium transition-colors text-red-500  active:scale-95 cursor-pointer ">
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col justify-content items-center w-full bg-gray-950 overflow-hidden">


                <div className="md:hidden w-full px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                        title="Toggle sidebar"
                    >
                        {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <div className="w-[95%] flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6 no-scrollbar  mx-auto">

                    {messages.length === 0 && (
                        <div className="flex h-full text-center items-center justify-center text-gray-600  sm:text-sm">
                            <h1 className='text-5xl'>    What Can I Help  With ?</h1>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'w-full'}`}
                        >
                            <div
                                className={`group max-w-full sm:max-w-[90%] md:max-w-[85%] lg:max-w-[75%] rounded-2xl px-3 py-1 sm:px-5 sm:py-4 md:px-7 md:py-4 ${message.role === 'user'
                                    ? 'bg-gray-700 text-white rounded-4xl'
                                    : 'text-gray-100 mr-auto'
                                    }`}
                            >
                                {message.image && (
                                    <img src={message.image} alt="Message" className="w-full rounded-lg mb-2 max-w-xs" />
                                )}

                                {message.role === 'user' ? (
                                    <p className="text-xs sm:text-sm md:text-base">{message.content}</p>
                                ) : (
                                    <div className="space-y-2">
                                        <MarkdownContent content={message.content} />

                                        {/* ✅ Blinking cursor while streaming */}
                                        {message.streaming && (
                                            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-0.5 rounded-sm align-middle" />
                                        )}

                                        {/* ✅ Action buttons — hidden while streaming */}
                                        {!message.streaming && (
                                            <MessageActions message={message} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} />
                </div>

                <div className="w-full p-3 md:p-6">
                    <div className="w-full max-w-4xl mx-auto">


                        <form onSubmit={handleSendMessage} className="w-full">
                            <div className="flex gap-1.5 sm:gap-2 md:gap-3 items-end">


                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 bg-gray-800 rounded-2xl sm:rounded-3xl md:rounded-4xl text-white placeholder-gray-500 border-none outline-none text-xs sm:text-sm md:text-base"
                                />


                                <button
                                    type="submit"
                                    disabled={chats.isLoading}
                                    className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 text-white rounded-lg transition-colors flex items-center justify-center flex-shrink-0"
                                >
                                    <Send size={16} className="sm:w-5 sm:h-5 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;