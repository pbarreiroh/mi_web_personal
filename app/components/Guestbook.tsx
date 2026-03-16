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
            placeholder="Nombre (opcional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-400 text-sm"
          />
        </div>
        <div>
          <textarea
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-400 text-sm resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enviando...' : 'Firmar'}
        </button>
      </form>

      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className="text-sm">
            <div className="text-gray-900 font-medium mb-1">{msg.name || 'Anónimo'}</div>
            <div className="text-gray-600">{msg.message}</div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-sm text-gray-400">Aún no hay mensajes. ¡Sé el primero en firmar!</div>
        )}
      </div>
    </div>
  );
}
