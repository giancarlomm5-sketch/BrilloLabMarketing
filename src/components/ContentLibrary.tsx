import { useState } from 'react';
import { Download, Copy, Check, Video, Image as ImageIcon } from 'lucide-react';

interface ContentLibraryProps {
  userId: string;
}

export default function ContentLibrary({ userId }: ContentLibraryProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Content Library</h2>

        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Download className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
          <p className="text-gray-600 mb-6">
            Generate your first piece of content to see it here.
            <br />
            All your AI-generated videos and marketing copy will be saved for easy download.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-blue-900 mb-3">How to use your content:</h4>
            <ol className="text-left text-sm text-blue-800 space-y-2">
              <li>1. Generate content with AI (video or image post)</li>
              <li>2. Copy the caption, hashtags, and CTA</li>
              <li>3. Download your video when ready</li>
              <li>4. Manually post to Instagram, TikTok, YouTube, or Twitter</li>
              <li>5. Your Calendly link is automatically included in every CTA</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
