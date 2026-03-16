"use client";

import { useState, useEffect } from 'react';

type Message = {
  id: number;
  name: string | null;
  message: string;
  created_at: string;
};

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/guestbook');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim() || 'Anónimo',
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setMessage('');
        setName('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to post message', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-md focus:outline-none focus:border-white/30 placeholder:text-white/20 text-white text-sm transition-colors hoverable shadow-inner"
          />
        </div>
        <div>
          <textarea
            placeholder="Escribe un mensaje en el guestbook..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-md focus:outline-none focus:border-white/30 placeholder:text-white/20 text-white text-sm resize-none transition-colors hoverable shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-6 py-2 border border-white/20 text-white/60 text-sm font-medium rounded-md hover:text-white hover:border-white/50 disabled:opacity-30 transition-all hoverable bg-transparent"
        >
          {loading ? 'Enviando...' : 'Firmar el libro'}
        </button>
      </form>

      <div className="space-y-4 pt-4">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm p-4 bg-[#111]/40 border border-white/5 rounded-md relative overflow-hidden">
            <div className="text-white/80 font-medium mb-1 font-mono text-[11px] uppercase tracking-wider">{msg.name || 'Anónimo'}</div>
            <div className="text-white/60 leading-relaxed text-sm">{msg.message}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-sm text-white/30 italic">Aún no hay mensajes. ¡Sé el primero en firmar!</div>
        )}
      </div>
    </div>
  );
}
