const allowOrigin = process.env.PUBLIC_APP_URL || '*';
function setCors(res){res.setHeader('Access-Control-Allow-Origin',allowOrigin);res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');}

export default async function handler(req,res){
  setCors(res);
  if(req.method==='OPTIONS') return res.status(204).send('');
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.OPENAI_API_KEY;
  if(!key) return res.status(500).json({error:'OPENAI_API_KEY missing'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    if(body && body.type==='image'){
      const r=await fetch('https://api.openai.com/v1/images/generations',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-image-1',prompt:body.prompt,size:body.size||'1024x1024',n:1})});
      const text=await r.text();return res.status(r.status).setHeader('Content-Type','application/json').send(text);
    }
    const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:'gpt-4o-mini',messages:body.messages,temperature:body.temperature??0.7})});
    const text=await r.text();res.status(r.status).setHeader('Content-Type','application/json').send(text);
  }catch(e){res.status(500).json({error:e?.message||'OpenAI proxy failed'});}
}
