const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateMarketingCopy(prompt: string, calendlyLink: string, platforms: string[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a social media marketing expert. Generate engaging captions, relevant hashtags, and compelling CTAs for ${platforms.join(', ')}. Always include the Calendly link: ${calendlyLink} in the CTA.`
        },
        {
          role: 'user',
          content: `Create marketing copy for: ${prompt}`
        }
      ],
      functions: [
        {
          name: 'generate_marketing_copy',
          description: 'Generate social media marketing copy',
          parameters: {
            type: 'object',
            properties: {
              caption: {
                type: 'string',
                description: 'An engaging caption for the post'
              },
              hashtags: {
                type: 'string',
                description: 'Relevant hashtags (15-20 hashtags)'
              },
              cta: {
                type: 'string',
                description: 'Call-to-action that includes the Calendly booking link'
              }
            },
            required: ['caption', 'hashtags', 'cta']
          }
        }
      ],
      function_call: { name: 'generate_marketing_copy' }
    }),
  });

  const data = await response.json();
  const result = JSON.parse(data.choices[0].message.function_call.arguments);
  return result;
}
