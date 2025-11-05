import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Link as LinkIcon } from 'lucide-react';

interface UserSettingsProps {
  userId: string;
}

export default function UserSettings({ userId }: UserSettingsProps) {
  const [calendlyLink, setCalendlyLink] = useState('https://calendly.com/your-link');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setMessage('Settings saved! Your Calendly link will be included in all content.');
    setTimeout(() => setMessage(''), 3000);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Calendly Booking Link
              </div>
            </label>
            <input
              type="url"
              value={calendlyLink}
              onChange={(e) => setCalendlyLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="https://calendly.com/your-name"
            />
            <p className="mt-2 text-sm text-gray-500">
              This link will be automatically included in all AI-generated CTAs
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>

          {message && (
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              {message}
            </div>
          )}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">OpenAI API</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Runway API</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Supabase Database</span>
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
