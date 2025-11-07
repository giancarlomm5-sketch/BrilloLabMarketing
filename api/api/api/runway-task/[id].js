const allowOrigin = process.env.PUBLIC_APP_URL || '*';
function setCors(res){res.setHeader('Access-Control-Allow-Origin',allowOrigin);res.setHeader('Access-Control-Allow-Methods','GET, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');}

export default async function handler(req,res){
  setCors(res);
  if(req.method==='OPTIONS') return res.status(204).send('');
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const key=process.env.RUNWAY_API_KEY;
  if(!key) return res.status(500).json({error:'RUNWAY_API_KEY missing'});
  try{
    const id=req.query.id;
    const r=await fetch(`https://api.runwayml.com/v1/tasks/${id}`,{headers:{Authorization:`Bearer ${key}`}});
    const text=await r.text();res.status(r.status).setHeader('Content-Type',r.headers.get('content-type')||'application/json').send(text);
  }catch(e){res.status(500).json({error:e?.message||'Runway task poll failed'});}
}
