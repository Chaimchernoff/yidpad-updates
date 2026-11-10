import QRCode from './qrcode-vendor.mjs';
import {UPDATE_BASE, verifiedEnrollment} from './enrollment.mjs';
const status = document.getElementById('status');
const canvas = document.getElementById('qr');
const save = document.getElementById('save');
let generation=0;
async function refresh() {
  const current=++generation;
  canvas.hidden=true;save.hidden=true;
  status.textContent='Checking the latest signed release…';
  try {
    const responses=await Promise.all(['manifest.json','manifest.sig'].map(name =>
      fetch(UPDATE_BASE + name, {cache:'no-store',credentials:'omit'})));
    if(responses.some(r=>!r.ok))throw Error('The update server could not be reached.');
    const [raw,signature]=await Promise.all(responses.map(r=>r.arrayBuffer()));
    const result=await verifiedEnrollment(raw,signature);
    if(current!==generation || document.hidden)return;
    await QRCode.toCanvas(canvas,result.text,{errorCorrectionLevel:'M',margin:4,width:720});
    if(current!==generation || document.hidden)return;
    status.textContent=`Build ${result.manifest.versionCode} · Version ${result.manifest.versionName}`;
    canvas.hidden=false;save.hidden=false;
    save.onclick=()=>canvas.toBlob(blob=>{
      if(!blob || canvas.hidden)return;
      const url=URL.createObjectURL(blob);const a=document.createElement('a');
      a.href=url;a.download=`yidpad-setup-build${result.manifest.versionCode}.png`;a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  } catch(error) {
    if(current!==generation)return;
    canvas.hidden=true;save.hidden=true;
    status.textContent=`Setup QR unavailable. ${error.message} Tap Refresh to retry.`;
  }
}
document.getElementById('refresh').onclick=refresh;
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){generation++;canvas.hidden=true;save.hidden=true;}
  else refresh();
});
setInterval(()=>{if(!document.hidden)refresh();},60000);
refresh();
