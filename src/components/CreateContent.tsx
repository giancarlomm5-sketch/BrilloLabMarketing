import { useState } from 'react';
import { Video, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { generateMarketingCopy } from '../lib/openai';
import { generateVideo } from '../lib/runway';

interface CreateContentProps {
  userId: string;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', color: 'from-pink-500 to-purple-600' },
  { id: 'tiktok', name: 'TikTok', color: 'from-black to-gray-800' },
  { id: 'youtube', name: 'YouTube', color: 'from-red-600 to-red-700' },
  { id: 'twitter', name: 'Twitter', color: 'from-blue-400 to-blue-600' },
];

export default function CreateContent({ userId }: CreateContentProps) {
  const [contentType, setContentType] = useState<'video' | 'image'>('video');
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<any>(null);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerate = async () => {
    if (!title || !prompt || selectedPlatforms.length === 0) {
      alert('Please fill in all fields and select at least one platform');
      return;
    }

    setLoading(true);
    setStatus('Generating AI marketing copy...');
    setResult(null);

    try {
      const calendlyLink = 'https://calendly.com/your-link';
      const platformNames = selectedPlatforms.map(
        id => PLATFORMS.find(p => p.id === id)?.name
      );

      const marketingCopy = await generateMarketingCopy(
        prompt,
        calendlyLink,
        platformNames as string[]
      );

      if (contentType === 'video') {
        setStatus('Generating video with Runway AI...');
        const videoResult = await generateVideo(prompt);

        setResult({
          type: 'video',
          title,
          prompt,
          platforms: selectedPlatforms,
          ...marketingCopy,
          taskId: videoResult.id,
          status: videoResult.status,
        });

        setStatus('Video generation started! Check back in a few minutes.');
      } else {
        setResult({
          type: 'image',
          title,
          prompt,
          platforms: selectedPlatforms,
          ...marketingCopy,
          status: 'ready',
        });

        setStatus('Content generated successfully!');
      }
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Content</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Content Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setContentType('video')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition ${
                  contentType === 'video'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className={`w-6 h-6 ${contentType === 'video' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${contentType === 'video' ? 'text-blue-600' : 'text-gray-600'}`}>
                  AI Video
                </span>
              </button>

              <button
                onClick={() => setContentType('image')}
                className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border-2 transition ${
                  contentType === 'image'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <ImageIcon className={`w-6 h-6 ${contentType === 'image' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className={`font-medium ${contentType === 'image' ? 'text-blue-600' : 'text-gray-600'}`}>
                  Image Post
                </span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="e.g., Summer Product Launch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              rows={4}
              placeholder={
                contentType === 'video'
                  ? 'Describe the video you want to create...'
                  : 'Describe your image post concept...'
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedPlatforms.includes(platform.id)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${platform.color} text-white text-sm font-medium`}>
                    {platform.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content
              </>
            )}
          </button>

          {status && (
            <div className={`p-4 rounded-lg ${
              status.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}

          {result && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Content</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Caption</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{result.caption}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Hashtags</h4>
                  <p className="text-blue-600 bg-gray-50 p-3 rounded-lg">{result.hashtags}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Call to Action</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{result.cta}</p>
                </div>

                {result.type === 'video' && result.taskId && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      Video Task ID: <code className="font-mono">{result.taskId}</code>
                      <br />
                      Your video is being generated. This typically takes 2-5 minutes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
