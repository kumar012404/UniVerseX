import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Trash2, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPage = () => {
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('fitai_chat_history');
        if (saved) {
            try { return JSON.parse(saved); } catch (e) { console.error('Error parsing chat history', e); }
        }
        return [{ role: 'system', content: "Hi! I'm FitAI, your personal fitness coach. How can I help you today?" }];
    });
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Save to localStorage when messages change
    useEffect(() => {
        localStorage.setItem('fitai_chat_history', JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const history = messages.slice(1);
            const res = await axios.post('/api/chat', { message: input, history });
            setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'AI Service unavailable.';
            toast.error(errorMessage);
            setMessages(prev => [...prev, { role: 'bot', content: `Error: ${errorMessage}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([{ role: 'system', content: "Hi! I'm FitAI, your personal fitness coach. How can I help you today?" }]);
    };

    // ── Format AI message with proper structure ──
    const formatMessage = (text) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const elements = [];
        let i = 0;

        while (i < lines.length) {
            const line = lines[i].trim();

            // Numbered list item: "1. ..." or "1) ..."
            const numberedMatch = line.match(/^(\d+)[.)]\s+(.+)/);
            if (numberedMatch) {
                const listItems = [];
                while (i < lines.length) {
                    const l = lines[i].trim();
                    const m = l.match(/^(\d+)[.)]\s+(.+)/);
                    if (m) {
                        listItems.push({ num: m[1], text: m[2] });
                        i++;
                    } else break;
                }
                elements.push(
                    <ol key={i} style={{ margin: '10px 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {listItems.map((item) => (
                            <li key={item.num} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <span style={{
                                    minWidth: '24px', height: '24px', borderRadius: '50%',
                                    background: 'rgba(139,92,246,0.25)', color: '#A78BFA',
                                    fontSize: '12px', fontWeight: 700, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px',
                                }}>{item.num}</span>
                                <span style={{ lineHeight: 1.6 }}>{renderInline(item.text)}</span>
                            </li>
                        ))}
                    </ol>
                );
                continue;
            }

            // Bullet list item: "- ..." or "* ..."
            const bulletMatch = line.match(/^[-*•]\s+(.+)/);
            if (bulletMatch) {
                const bulletItems = [];
                while (i < lines.length) {
                    const l = lines[i].trim();
                    const m = l.match(/^[-*•]\s+(.+)/);
                    if (m) { bulletItems.push(m[1]); i++; }
                    else break;
                }
                elements.push(
                    <ul key={i} style={{ margin: '8px 0', paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {bulletItems.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <span style={{ color: '#8B5CF6', marginTop: '6px', fontSize: '8px' }}>●</span>
                                <span style={{ lineHeight: 1.6 }}>{renderInline(item)}</span>
                            </li>
                        ))}
                    </ul>
                );
                continue;
            }

            // Normal paragraph
            elements.push(
                <p key={i} style={{ margin: '4px 0', lineHeight: 1.7 }}>{renderInline(line)}</p>
            );
            i++;
        }

        return <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>{elements}</div>;
    };

    // Render inline bold (**text**) and italic (*text*)
    const renderInline = (text) => {
        const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**'))
                return <strong key={i}>{part.slice(2, -2)}</strong>;
            if (part.startsWith('*') && part.endsWith('*'))
                return <em key={i}>{part.slice(1, -1)}</em>;
            return part;
        });
    };


    /* fills exactly the viewport below the 64px navbar */
    return (
        <div style={{
            height: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '24px 16px 0px 16px',
            boxSizing: 'border-box',
        }}>

            {/* ── Title Row ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', marginTop: '60px', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(139,92,246,0.18)', color: '#8B5CF6',
                    }}>
                        <Sparkles size={24} />
                    </div>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}>
                            FitAI <span style={{ background: 'linear-gradient(to right, #8B5CF6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Coach</span>
                        </h1>
                        <p style={{ margin: 0, fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
                            Personal AI Trainer
                        </p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    title="Clear"
                    style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#94A3B8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* ── Messages ── */}
            <div className="chat-scrollbar" style={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                paddingRight: '4px',
                marginBottom: '8px',
            }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: msg.role === 'user' ? '#8B5CF6' : '#161B2E',
                            border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                            color: msg.role === 'user' ? '#fff' : '#8B5CF6',
                        }}>
                            {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                        </div>
                        <div style={{
                            maxWidth: '70%',
                            padding: '12px 16px',
                            borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                            background: msg.role === 'user' ? '#8B5CF6' : 'rgba(30,41,59,0.85)',
                            border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            color: '#F8FAFC',
                            fontSize: '15px',
                            lineHeight: 1.6,
                        }}>
                            {msg.role === 'bot' ? formatMessage(msg.content) : msg.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#161B2E', border: '1px solid rgba(255,255,255,0.1)', color: '#8B5CF6',
                        }}>
                            <Bot size={18} />
                        </div>
                        <div style={{
                            padding: '12px 16px', borderRadius: '4px 18px 18px 18px',
                            background: 'rgba(30,41,59,0.85)', border: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                {[0, 0.2, 0.4].map((delay, i) => (
                                    <span key={i} style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: '#8B5CF6', display: 'inline-block',
                                        animation: 'bounce 1.2s infinite',
                                        animationDelay: `${delay}s`,
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                padding: '6px 6px 6px 14px',
                background: 'rgba(22,27,46,0.9)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                <textarea
                    ref={textareaRef}
                    rows="1"
                    placeholder="Message FitAI Coach..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1, background: 'transparent', border: 'none', outline: 'none',
                        padding: '10px 0', color: '#F8FAFC', fontSize: '15px',
                        lineHeight: 1.5, resize: 'none', maxHeight: '180px',
                        fontFamily: 'Outfit, sans-serif',
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    style={{
                        width: '40px', height: '40px', marginBottom: '2px',
                        background: '#8B5CF6', color: '#fff', borderRadius: '10px',
                        border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                        opacity: input.trim() && !loading ? 1 : 0.3,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'opacity 0.2s',
                    }}
                >
                    {loading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={18} /> : <Send size={18} />}
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
