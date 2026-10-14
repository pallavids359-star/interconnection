/* ========================================================= */

const $=s=>document.querySelector(s);
const fill=t=>t.replace(/\{his\}/g,CONFIG.his).replace(/\{her\}/g,CONFIG.her);
const tints=[["#e4174b","#3b0716"],["#ff8fab","#4a1325"],["#f2c27b","#4a2a12"],["#b0306a","#21081a"],["#d6455d","#2a0b10"],["#9b2c5e","#170612"]];
const bg=(photo,i)=>photo?`url("${photo}")`:`radial-gradient(circle at 30% 30%,${tints[i%6][0]}cc,${tints[i%6][1]} 70%)`;

$("#gateName").textContent=CONFIG.his;
$("#heroTitle").textContent=`${CONFIG.his} & ${CONFIG.her}`;
$("#heroYear").textContent=`${CONFIG.startYear} – Forever`;
$("#heroDesc").textContent=CONFIG.heroDesc;
$("#heroBg").style.backgroundImage=bg(CONFIG.heroPhoto,0);

// Episodes
const epRail=$("#episodes");
CONFIG.episodes.forEach((e,i)=>{
  const b=document.createElement("button");b.className="card";b.type="button";
  b.dataset.film=e.photo?"":(e.film||"");b.innerHTML=`<div class="thumb" style="background-image:${bg(e.photo,i)}"><canvas class="tc"></canvas><span class="ep">E${i+1}</span>${(e.video||e.film)?'<span class="pbadge"><svg viewBox="0 0 24 24" fill="#fff"><path d="M6 4l15 8-15 8z"/></svg></span>':''}</div>
  <div class="info"><b></b><small></small></div><div class="prog"><i></i></div>`;
  b.querySelector("b").textContent=e.title;b.querySelector("small").textContent=e.date;
  b.onclick=()=>openModal({title:e.title,meta:`Episode ${i+1} · ${e.date}`,text:e.text,quote:e.quote,bg:bg(e.photo,i),video:e.video,film:e.film});
  epRail.appendChild(b);
});
// Top 10
CONFIG.reasons.forEach((r,i)=>{
  const b=document.createElement("button");b.className="top";b.type="button";
  b.innerHTML=`<span class="n">${i+1}</span><span class="p" style="background:${bg("",i)}"></span>`;
  b.querySelector(".p").textContent=r;
  b.onclick=()=>openModal({title:`Reason #${i+1}`,meta:"Top 10 today",text:r+".",quote:"One of a million reasons.",bg:bg("",i)});
  $("#top10").appendChild(b);
});
// Coming soon
CONFIG.soon.forEach((s,i)=>{
  const b=document.createElement("button");b.className="card";b.type="button";
  b.innerHTML=`<div class="thumb" style="background-image:${bg("",i+3)}"><span class="ep">SOON</span></div><div class="info"><b></b><small>Season 2 and beyond</small></div>`;
  b.querySelector("b").textContent=s.title;
  b.onclick=()=>openModal({title:s.title,meta:"Coming soon",text:s.text,quote:"Save me a seat next to you.",bg:bg("",i+3)});
  $("#soon").appendChild(b);
});

// ================= SHORT FILMS (drawn live on canvas) =================
const LW=1600,LH=800;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const lerp=(a,b,k)=>a+(b-a)*k;
const fade=(t,a,b,f=.6)=>clamp(Math.min((t-a)/f,(b-t)/f));
const F_HAND='"Caveat","Segoe Print",cursive',F_DISP='"Bebas Neue",Impact,sans-serif',F_BODY='"DM Sans",system-ui,sans-serif';
const BOY={skin:"#c68a62",hair:"#24150f",shirt:"#2f4a7a"};
const GIRL={girl:true,skin:"#d8a07a",hair:"#1e110c",shirt:"#e4174b"};
const CONF=["#e4174b","#ff8fab","#f2c27b","#ffffff","#b0306a"];
const blinkAt=t=>(t%3.4)<.13;
const hexRgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const mix=(a,b,k)=>{const A=hexRgb(a),B=hexRgb(b);return `rgb(${A.map((v,i)=>Math.round(lerp(v,B[i],k))).join(",")})`};
function sky(x,a,b){const g=x.createLinearGradient(0,0,0,LH);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,LW,LH)}
function rr(x,X,Y,W,H,R){x.beginPath();x.moveTo(X+R,Y);x.arcTo(X+W,Y,X+W,Y+H,R);x.arcTo(X+W,Y+H,X,Y+H,R);x.arcTo(X,Y+H,X,Y,R);x.arcTo(X,Y,X+W,Y,R);x.closePath()}
function heart(x,cx,cy,s,c,a=1){x.save();x.globalAlpha*=a;x.fillStyle=c;x.translate(cx,cy);x.scale(s/20,s/20);x.translate(0,-10);
  x.beginPath();x.moveTo(0,6);x.bezierCurveTo(0,0,-10,0,-10,6);x.bezierCurveTo(-10,12,0,16,0,20);x.bezierCurveTo(0,16,10,12,10,6);x.bezierCurveTo(10,0,0,0,0,6);x.fill();x.restore()}
function sparkle(x,cx,cy,s,a,c="#fff"){if(a<=0)return;x.save();x.globalAlpha*=a;x.fillStyle=c;x.beginPath();x.moveTo(cx,cy-s);x.quadraticCurveTo(cx,cy,cx+s,cy);x.quadraticCurveTo(cx,cy,cx,cy+s);x.quadraticCurveTo(cx,cy,cx-s,cy);x.quadraticCurveTo(cx,cy,cx,cy-s);x.fill();x.restore()}
function wrapText(x,txt,cx,cy,maxW,lh){const words=txt.split(" ");const lines=[];let l="";
  for(const w of words){const tt=l?l+" "+w:w;if(x.measureText(tt).width>maxW&&l){lines.push(l);l=w}else l=tt}lines.push(l);
  lines.forEach((ln,i)=>x.fillText(ln,cx,cy+(i-(lines.length-1)/2)*lh))}
function cap(x,txt,t,a,b,o={}){const al=fade(t,a,b,o.f||.6);if(al<=0||CAPOFF)return;const size=o.size||74,cy=o.y||690;{const top=cy<400,g=x.createLinearGradient(0,top?0:LH-260,0,top?260:LH);g.addColorStop(top?0:1,`rgba(25,8,14,${.55*al})`);g.addColorStop(top?1:0,'rgba(25,8,14,0)');x.fillStyle=g;x.fillRect(0,top?0:LH-260,LW,260)}
  x.save();x.globalAlpha=al;x.font=`${o.disp?400:700} ${size}px ${o.disp?F_DISP:F_HAND}`;x.textAlign="center";x.textBaseline="middle";
  x.shadowColor="rgba(0,0,0,.65)";x.shadowBlur=20;x.fillStyle=o.color||"#fff";
  wrapText(x,fill(txt),LW/2,cy+(1-al)*14,1360,size*1.05);x.restore()}
const makeStars=()=>Array.from({length:140},()=>({x:Math.random()*LW,y:Math.random()*LH*.75,r:Math.random()*1.8+.4,p:Math.random()*6}));
function stars(x,st,t,a=1,maxY=LH){if(a<=0)return;x.save();x.fillStyle="#fff";for(const s of st.stars){if(s.y>maxY)continue;x.globalAlpha=a*(.35+.65*Math.abs(Math.sin(t*1.3+s.p)));x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill()}x.restore()}

// ---- Illustrated characters (cut out from the couple's illustration) ----
const IMG={};
function loadImg(k,src){const i=new Image();i.src=src;IMG[k]=i;return new Promise(r=>{if(i.complete&&i.naturalWidth)r();else{i.onload=r;i.onerror=r}})}
const ART_READY=Promise.all([loadImg("girl",ASSETS.girl),loadImg("boy",ASSETS.boy),loadImg("scene",ASSETS.scene)]);
// key points inside each cut-out, as fractions of its width/height
const KP={boy:{face:[.33,.105],mouth:[.29,.125],cheek:[.39,.115]},girl:{face:[.57,.09],hands:[.70,.50],cheek:[.51,.107]}};
function sprite(x,k,cx,footY,h,o={}){const img=IMG[k];const ok=img&&img.naturalWidth;const nw=ok?img.naturalWidth:1,nh=ok?img.naturalHeight:1;
  const w=nw*h/nh;const pt=f=>[cx-w/2+f[0]*w,footY-h+f[1]*h];if(!ok)return{pt,w};
  x.save();x.globalAlpha*=(o.a??1);
  if(o.shadow!==false){x.fillStyle="rgba(110,70,35,.22)";x.beginPath();x.ellipse(cx,footY-3,w*.48,h*.022,0,0,7);x.fill()}
  x.translate(cx,footY);if(o.rot)x.rotate(o.rot);x.drawImage(img,-w/2,-h,w,h);x.restore();return{pt,w}}
function crop(x,k,fx0,fy0,fx1,fy1,dx,dy,dw){const img=IMG[k];if(!img||!img.naturalWidth)return;const W=img.naturalWidth,H=img.naturalHeight;
  const sw=(fx1-fx0)*W,sh=(fy1-fy0)*H;x.drawImage(img,fx0*W,fy0*H,sw,sh,dx,dy,dw,dw*sh/sw)}

// ---- Watercolor beach, painted to match the illustration ----
const HZ=300,SHORE=600;
const shoreY=X=>SHORE-30+Math.sin(X/260)*22+Math.sin(X/90)*6+(X/LW)*30;
let BEACH=null;
function paintBeach(){const c=document.createElement("canvas");c.width=LW;c.height=LH;const x=c.getContext("2d");
  let g=x.createLinearGradient(0,0,0,HZ);g.addColorStop(0,"#e7e0d2");g.addColorStop(1,"#fbf1da");x.fillStyle=g;x.fillRect(0,0,LW,HZ+2);
  g=x.createRadialGradient(800,HZ,0,800,HZ,720);g.addColorStop(0,"rgba(255,246,222,.95)");g.addColorStop(1,"rgba(255,246,222,0)");x.fillStyle=g;x.fillRect(0,0,LW,HZ);
  const cloud=(cx,cy,s)=>{x.fillStyle="rgba(236,206,186,.55)";[[0,0,60],[55,-20,50],[105,0,55],[-55,8,42],[150,12,38]].forEach(([a,b,r])=>{x.beginPath();x.arc(cx+a*s,cy+b*s,r*s,0,7);x.fill()});
    x.fillStyle="rgba(252,245,234,.8)";[[10,-14,44],[60,-32,36],[100,-12,38]].forEach(([a,b,r])=>{x.beginPath();x.arc(cx+a*s,cy+b*s,r*s,0,7);x.fill()})};
  cloud(150,140,.9);cloud(1150,100,1.1);cloud(1430,220,.6);cloud(620,70,.5);
  x.fillStyle="rgba(196,170,150,.55)";x.beginPath();x.moveTo(1360,HZ);x.quadraticCurveTo(1470,HZ-18,1600,HZ-14);x.lineTo(1600,HZ);x.fill();
  g=x.createLinearGradient(0,HZ,0,SHORE);g.addColorStop(0,"#d8ddcd");g.addColorStop(.4,"#bdcec4");g.addColorStop(1,"#a6bcb3");x.fillStyle=g;x.fillRect(0,HZ,LW,SHORE-HZ+80);
  for(let i=0;i<140;i++){const y=HZ+6+Math.pow(Math.random(),1.6)*250,spread=60+(y-HZ)*1.3;x.fillStyle=`rgba(255,250,236,${.6*(1-(y-HZ)/270)})`;x.fillRect(800+(Math.random()-.5)*spread*2,y,18+Math.random()*40,2.5)}
  g=x.createLinearGradient(0,SHORE-40,0,LH);g.addColorStop(0,"#e9d2a6");g.addColorStop(.45,"#f2dcae");g.addColorStop(1,"#e0bf8c");x.fillStyle=g;
  x.beginPath();x.moveTo(0,LH);for(let X=0;X<=LW;X+=20)x.lineTo(X,shoreY(X));x.lineTo(LW,LH);x.closePath();x.fill();
  for(let i=0;i<26;i++){x.fillStyle=`rgba(205,160,105,${.08+Math.random()*.1})`;x.beginPath();x.ellipse(Math.random()*LW,SHORE+50+Math.random()*(LH-SHORE),40+Math.random()*130,7+Math.random()*13,0,0,7);x.fill()}
  for(let i=0;i<6000;i++){x.fillStyle=`rgba(${Math.random()<.5?"120,90,50":"255,255,255"},${Math.random()*.08})`;x.fillRect(Math.random()*LW,Math.random()*LH,2,2)}
  return c}
function beach(x,t){if(!BEACH)BEACH=paintBeach();x.drawImage(BEACH,0,0);
  x.save();x.strokeStyle="#fffcf2";x.lineCap="round";
  for(let r=0;r<9;r++){const y=HZ+26+r*r*3.4+r*14,len=40+r*16;x.lineWidth=1.5+r*.5;
    for(let i=0;i<14;i++){const X=((i*173+r*97+t*(10+r*4))%(LW+200))-100;x.globalAlpha=.3+.5*Math.abs(Math.sin(t*.8+i+r));
      x.beginPath();x.moveTo(X,y);x.quadraticCurveTo(X+len/2,y-3-r*.4,X+len,y);x.stroke()}}
  x.restore();
  const s=Math.sin(t*.9)*14;x.save();
  x.fillStyle="rgba(214,190,150,.5)";x.beginPath();for(let X=0;X<=LW;X+=20)x.lineTo(X,shoreY(X)+s+20);for(let X=LW;X>=0;X-=20)x.lineTo(X,shoreY(X)-4);x.closePath();x.fill();
  x.strokeStyle="rgba(255,253,246,.95)";x.lineWidth=5;x.beginPath();for(let X=0;X<=LW;X+=16){const y=shoreY(X)+s+Math.sin(X/40+t*2)*3;X?x.lineTo(X,y):x.moveTo(X,y)}x.stroke();
  x.lineWidth=2;x.strokeStyle="rgba(255,253,246,.7)";x.beginPath();for(let X=0;X<=LW;X+=16){const y=shoreY(X)+s-16+Math.sin(X/55+t*1.6)*3;X?x.lineTo(X,y):x.moveTo(X,y)}x.stroke();
  x.restore()}
function tint(x,color,a,mode="multiply"){if(a<=0)return;x.save();x.globalCompositeOperation=mode;x.globalAlpha=a;x.fillStyle=color;x.fillRect(0,0,LW,LH);x.restore()}
function glow(x,cx,cy,r,rgb,a){if(a<=0)return;const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(${rgb},${a})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2)}
function vignette(x,a=.45){const g=x.createRadialGradient(800,400,320,800,400,960);g.addColorStop(0,"rgba(40,14,20,0)");g.addColorStop(1,`rgba(40,14,20,${a})`);x.fillStyle=g;x.fillRect(0,0,LW,LH)}
function sticker(x,txt,X,Y,rot,a,size=64){if(a<=0)return;x.save();x.globalAlpha*=clamp(a);x.translate(X,Y);x.rotate(rot);const s=.6+.4*clamp(a);x.scale(s,s);
  x.font=`700 ${size}px ${F_HAND}`;x.textAlign="center";x.textBaseline="middle";x.lineJoin="round";x.strokeStyle="#fff";x.lineWidth=12;x.strokeText(txt,0,0);x.fillStyle="#e4174b";x.fillText(txt,0,0);x.restore()}
function fairyLights(x,t,y0=70,sag=80){x.strokeStyle="rgba(90,50,40,.4)";x.lineWidth=2;x.beginPath();x.moveTo(0,y0);x.quadraticCurveTo(800,y0+sag*2,1600,y0);x.stroke();
  for(let i=0;i<=20;i++){const k=i/20,X=k*1600,Y=(1-k)*(1-k)*y0+2*(1-k)*k*(y0+sag*2)+k*k*y0+10;
    const c=["255,211,110","255,143,171","255,250,235"][i%3];x.globalAlpha=.55+.45*Math.sin(t*3+i*1.3);glow(x,X,Y,28,c,1);x.globalAlpha=1}}
function petals(x,t,n=18){for(let i=0;i<n;i++){const sp=.4+(i%4)*.15;x.save();x.translate(((i*173+Math.sin(t+i)*60)%1600+1600)%1600,((t*80*sp+i*131)%900)-50);x.rotate(t+i);
  x.fillStyle="rgba(240,110,140,.75)";x.beginPath();x.ellipse(0,0,12,7,0,0,7);x.fill();x.restore()}}

function confetti(st,n,cx=LW/2,cy=LH/2){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=5+Math.random()*13;
  st.conf.push({x:cx,y:cy,vx:Math.cos(a)*v,vy:Math.sin(a)*v-9,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:CONF[i%5],w:12+Math.random()*10,h:7+Math.random()*6,heart:Math.random()<.35})}}
function drawConf(x,st){st.conf=st.conf.filter(p=>p.y<LH+60);for(const p of st.conf){p.vy+=.32;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;
  x.save();x.translate(p.x,p.y);x.rotate(p.r);if(p.heart)heart(x,0,0,26,p.c);else{x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h)}x.restore()}}

// Sound
function audio(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==="suspended")ac.resume();return ac}catch(e){return null}}
function tone(f,t0,d,g=.1,type="sine"){const a=audio();if(!a)return;const o=a.createOscillator(),gn=a.createGain();o.type=type;o.frequency.value=f;
  gn.gain.setValueAtTime(0,t0);gn.gain.linearRampToValueAtTime(g,t0+.02);gn.gain.exponentialRampToValueAtTime(.0008,t0+d+.6);o.connect(gn).connect(fx()?FX.input:a.destination);o.start(t0);o.stop(t0+d+.7)}
function melody(notes,g=.09){const a=audio();if(!a)return;let t=a.currentTime+.05;notes.forEach(([f,d])=>{tone(f,t,d*.8,g,"triangle");t+=d*.9})}
// ================= MUSIC: original tunes, synthesized live =================
const mtof=m=>440*Math.pow(2,(m-69)/12);
let FX=null;const MUSIC={timer:null,bus:null,step:0,next:0,audio:null,muted:false};
function fx(){const a=audio();if(!a)return null;if(FX)return FX;
  const master=a.createGain();master.gain.value=MUSIC.muted?0:2.2;const lim=a.createDynamicsCompressor();lim.threshold.value=-10;lim.ratio.value=8;master.connect(lim).connect(a.destination);
  const conv=a.createConvolver(),len=Math.floor(a.sampleRate*2.4),buf=a.createBuffer(2,len,a.sampleRate);
  for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
  conv.buffer=buf;const wet=a.createGain();wet.gain.value=.32;conv.connect(wet).connect(master);
  const input=a.createGain();input.connect(master);input.connect(conv);
  const nb=a.createBuffer(1,Math.floor(a.sampleRate*.3),a.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
  FX={master,input,noise:nb};return FX}
function env(src,g,t,v,att,dur){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+att);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.start(t);src.stop(t+dur+.05)}
function vco(type,f,t,dur,v,out,att=.004){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;o.connect(g).connect(out);env(o,g,t,v,att,dur)}
function noiseHit(t,v,o,type,freq,dur){const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=FX.noise;f.type=type;f.frequency.value=freq;s.connect(f).connect(g).connect(o);env(s,g,t,v,.002,dur)}
const INS={
  piano:(m,t,d,v,o)=>{const f=mtof(m);vco("triangle",f,t,d+1.4,v,o);vco("sine",f*2,t,d+.4,v*.3,o)},
  box:(m,t,d,v,o)=>{const f=mtof(m);vco("sine",f,t,1.3,v,o,.002);vco("sine",f*4,t,.22,v*.2,o,.002)},
  glock:(m,t,d,v,o)=>{const f=mtof(m);vco("sine",f,t,1,v,o,.001);vco("sine",f*2.76,t,.25,v*.35,o,.001)},
  pluck:(m,t,d,v,o)=>{const f=mtof(m),os=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();os.type="sawtooth";os.frequency.value=f;fl.type="lowpass";
    fl.frequency.setValueAtTime(f*7,t);fl.frequency.exponentialRampToValueAtTime(f*1.3,t+.3);os.connect(fl).connect(g).connect(o);env(os,g,t,v,.003,.55)},
  pizz:(m,t,d,v,o)=>vco("triangle",mtof(m),t,.25,v,o,.002),
  bass:(m,t,d,v,o)=>vco("triangle",mtof(m),t,d,v,o,.01),
  pad:(m,t,d,v,o)=>{const f=mtof(m);[-7,0,7].forEach(dt=>{const os=ac.createOscillator(),g=ac.createGain();os.type="sine";os.frequency.value=f;os.detune.value=dt;os.connect(g).connect(o);
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v/3,t+d*.35);g.gain.linearRampToValueAtTime(0,t+d*1.05);os.start(t);os.stop(t+d*1.1)})},
  shaker:(t,v,o)=>noiseHit(t,v,o,"highpass",7000,.06),
  clap:(t,v,o)=>noiseHit(t,v,o,"bandpass",1800,.14),
  kick:(t,v,o)=>{const os=ac.createOscillator(),g=ac.createGain();os.frequency.setValueAtTime(130,t);os.frequency.exponentialRampToValueAtTime(45,t+.14);os.connect(g).connect(o);env(os,g,t,v,.002,.2)}
};
const N=null;
// each song: play(step, time, secondsPerEighth, output, filmState) is called once per eighth note
const SONGS={
  character:{bpm:72,play(s,t,b,o){ // "Warm Heart": gentle piano, C–Am–F–G
    const C=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],bar=Math.floor(s/8)%4,c=C[bar],i=s%8;
    INS.piano([c[0],c[2],c[1]+12,c[2],c[0]+12,c[2],c[1]+12,c[2]][i],t,b,.045,o);
    if(i===0){INS.bass(c[0]-12,t,b*8,.09,o);INS.pad(c[1]+12,t,b*8,.05,o);INS.pad(c[2]+12,t,b*8,.04,o)}
    const M=[76,N,74,N,72,N,N,N, 72,N,74,76,74,N,N,N, 69,N,72,N,76,N,74,N, 74,N,N,N,N,N,N,N],m=M[s%32];if(m&&s>=32)INS.box(m,t,b,.06,o)}},
  smile:{bpm:88,play(s,t,b,o){ // "Golden Hour": ukulele strum + glockenspiel, F–C–Dm–Bb
    const C=[[53,57,60,65],[52,55,60,64],[50,53,57,62],[50,53,58,62]],R=[41,48,38,46],bar=Math.floor(s/8)%4,c=C[bar],i=s%8;
    const P=[1,0,.6,.8,0,.7,.6,.8];if(P[i])c.forEach((m,k)=>INS.pluck(m,t+k*.016,b,.034*P[i],o));
    if(i===0||i===4)INS.pizz(R[bar],t,b,.13,o);if(i%2)INS.shaker(t,.035,o);
    const M=[72,N,72,74,77,N,74,N, 72,N,69,N,72,N,N,N, 74,N,74,77,81,N,79,77, 77,N,N,N,76,N,77,N],m=M[s%32];if(m&&s>=16)INS.glock(m+12,t,b,.04,o)}},
  cute:{bpm:116,play(s,t,b,o){ // "Bubblegum": bouncy music box, C–G–Am–F
    const C=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],bar=Math.floor(s/8)%4,c=C[bar],i=s%8;
    if(i===0)INS.pizz(c[0]-12,t,b,.14,o);if(i===4)INS.pizz(c[2]-12,t,b,.12,o);
    if(i===2||i===6)c.forEach(m=>INS.pizz(m,t,b,.035,o));
    INS.shaker(t,i%2?.04:.022,o);if(i===0||i===4)INS.kick(t,.13,o);
    const M=[79,76,79,81,79,76,72,N, 74,76,74,71,67,N,N,N, 76,79,81,84,81,79,76,N, 74,72,74,76,72,N,N,N],m=M[s%32];if(m)INS.box(m,t,b,.05,o)}},
  distance:{bpm:64,play(s,t,b,o,st){ // "Miles": lonely minor piano, turns hopeful when they reunite
    const i=s%8,bar=Math.floor(s/8)%4;
    if(!(st&&st.t>13)){const C=[[57,60,64],[53,57,60],[48,55,64],[55,59,62]],c=C[bar];
      if(i===0){INS.pad(c[0],t,b*8,.07,o);INS.pad(c[2],t,b*8,.05,o);INS.bass(c[0]-12,t,b*8,.07,o)}
      if(i===0||i===3||i===6)INS.piano(c[(i/3)|0]+12,t,b,.03,o);
      const M=[76,N,N,N,74,N,72,N, 72,N,N,N,N,N,N,N, 72,N,N,74,76,N,N,N, 74,N,N,N,71,N,N,N],m=M[s%32];if(m)INS.piano(m,t,b,.045,o)}
    else{const C=[[53,57,60,65],[55,59,62,67],[57,60,64,69],[60,64,67,72]],c=C[bar];
      INS.piano([c[0],c[1],c[2],c[3],c[1]+12,c[3],c[2],c[1]][i],t,b,.042,o);
      if(i===0){INS.pad(c[1]+12,t,b*8,.05,o);INS.pad(c[2]+12,t,b*8,.04,o);INS.bass(c[0]-12,t,b*8,.09,o)}
      const M=[72,N,74,N,76,N,79,N, 79,N,77,76,74,N,N,N, 76,N,77,N,79,N,81,N, 84,N,N,N,N,N,N,N],m=M[s%32];if(m)INS.glock(m+12,t,b,.035,o)}}},
  proposal:{bpm:92,play(s,t,b,o,st){ // "The Question": romantic waltz in 3/4, bells after "Yes"
    const C=[[50,54,57],[47,50,54],[43,47,50],[45,49,52]],bar=Math.floor(s/6)%4,c=C[bar],i=s%6;
    if(i===0){INS.bass(c[0]<46?c[0]:c[0]-12,t,b*6,.1,o);INS.pad(c[1]+12,t,b*6,.05,o);INS.pad(c[2]+12,t,b*6,.04,o)}
    if(i===2||i===4)c.forEach(m=>INS.piano(m+12,t,b,.022,o));
    const M=[74,N,73,N,71,N, 69,N,N,N,66,N, 67,N,69,N,71,N, 69,N,N,N,N,N],m=M[s%24];if(m)INS.piano(m,t,b,.05,o);
    if(st&&st.yesT!=null){INS.glock(c[i%3]+24+(i>2?12:0),t,b,.03,o);if(i%2===0)INS.shaker(t,.04,o)}}},
  cake:{bpm:104,play(s,t,b,o){ // "Make A Wish": twinkly party music box
    const C=[[62,66,69],[55,59,62],[57,61,64],[62,66,69]],bar=Math.floor(s/8)%4,c=C[bar],i=s%8;
    INS.box([c[0],c[1],c[2],c[1]][i%4]+12,t,b,.035,o);
    if(i===0)INS.pizz(c[0]-12,t,b,.12,o);if(i===4)INS.pizz(c[2]-12,t,b,.1,o);if(i===2||i===6)INS.clap(t,.05,o)}},
  finale:{bpm:62,play(s,t,b,o){ // "Forever": slow love-letter piano, F–C–Dm–Bb
    const C=[[53,57,60],[48,52,55],[50,53,57],[46,50,53]],bar=Math.floor(s/8)%4,c=C[bar],i=s%8;
    INS.piano([c[0],c[1]+12,c[2]+12,c[1]+12,c[0]+12,c[1]+12,c[2]+12,c[1]+12][i]+12,t,b,.032,o);
    if(i===0){INS.bass(c[0]-12,t,b*8,.1,o);INS.pad(c[1]+12,t,b*8,.05,o)}
    const M=[72,N,N,N,74,N,72,N, 69,N,N,N,N,N,N,N, 72,N,N,N,74,N,77,N, 76,N,N,N,N,N,N,N],m=M[s%32];if(m&&s>=16)INS.piano(m+12,t,b,.05,o)}}
};
function startSong(name){stopMusic();const a=audio(),F=fx(),S=SONGS[name];if(!a||!F||!S)return;
  const bus=a.createGain();bus.connect(F.input);MUSIC.bus=bus;MUSIC.step=0;MUSIC.next=a.currentTime+.08;
  const spe=60/S.bpm/2;
  MUSIC.timer=setInterval(()=>{while(MUSIC.next<ac.currentTime+.25){try{S.play(MUSIC.step,MUSIC.next,spe,bus,FILM&&FILM.st)}catch(e){}MUSIC.next+=spe;MUSIC.step++}},60)}
function stopMusic(){if(MUSIC.timer)clearInterval(MUSIC.timer);MUSIC.timer=null;
  if(MUSIC.bus&&ac){const b=MUSIC.bus,t=ac.currentTime;b.gain.setValueAtTime(b.gain.value,t);b.gain.linearRampToValueAtTime(0,t+.4);setTimeout(()=>b.disconnect(),700);MUSIC.bus=null}
  if(MUSIC.audio){MUSIC.audio.pause();MUSIC.audio=null}}
function startMusic(){if(!FILM)return;const ep=CONFIG.episodes.find(e=>e.film===FILM.name);
  if(ep&&ep.music){stopMusic();const au=new Audio(ep.music);au.loop=true;au.volume=MUSIC.muted?0:.7;au.play().catch(()=>{});MUSIC.audio=au;return}
  startSong(FILM.name)}
function setMuted(m){MUSIC.muted=m;if(FX)FX.master.gain.value=m?0:2.2;if(MUSIC.audio)MUSIC.audio.volume=m?0:.7;document.querySelectorAll(".fx-snd").forEach(sndLabel)}
function sndLabel(b){b.innerHTML=MUSIC.muted
  ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'
  :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
  b.setAttribute("aria-label",MUSIC.muted?"Turn music on":"Mute music")}
const HAPPY_BDAY=[[392,.25],[392,.25],[440,.5],[392,.5],[523,.5],[494,1],[392,.25],[392,.25],[440,.5],[392,.5],[587,.5],[523,1],
  [392,.25],[392,.25],[784,.5],[659,.5],[523,.5],[494,.5],[440,1],[698,.25],[698,.25],[659,.5],[523,.5],[587,.5],[523,1.3]];

// Episode 5 answer buttons
function askUI(st){const ui=st.ui;ui.innerHTML="";ui.classList.add("top");
  const yes=document.createElement("button");yes.type="button";yes.className="btn play";yes.textContent="Yes!";
  const no=document.createElement("button");no.type="button";no.className="btn more";no.textContent="No";
  const lines=["Are you sure?","Think again!","Not an option","Nice try","Try the other one"];let n=0;
  const say=e=>{if(e)e.stopPropagation();st.yesT=st.t;ui.innerHTML="";ui.classList.remove("top");confetti(st,130,960,450);melody([[523,.3],[659,.3],[784,.3],[1047,.8],[988,.3],[1047,1.2]],.08)};
  const dodge=e=>{e.preventDefault();e.stopPropagation();const w=ui.getBoundingClientRect().width;
    no.style.transform=`translate(${(Math.random()-.5)*Math.min(w*.7,480)}px,${-Math.random()*50}px)`;no.textContent=lines[n%lines.length];n++;
    if(n>5){no.textContent="Yes!";no.className="btn play";no.style.transform="";no.onpointerenter=null;no.onclick=say}};
  yes.onclick=say;no.onpointerenter=dodge;no.onclick=dodge;ui.append(yes,no)}

// Episode 6 candles
function blow(st,i){if(i==null||st.cand[i].out>=0)return;st.cand[i].out=st.t;tone(180,audio()?ac.currentTime:0,.15,.05,"triangle");
  if(st.cand.every(c=>c.out>=0)){st.phase="wish";st.allOut=st.t;chime([659,784,1047])}}
const candleX=(i,n)=>n===1?800:640+i*(320/(n-1));
async function startMic(st,btn,hint){
  try{const s=await navigator.mediaDevices.getUserMedia({audio:true});const a=audio();const an=a.createAnalyser();an.fftSize=512;a.createMediaStreamSource(s).connect(an);
    st.an=an;st.buf=new Uint8Array(an.fftSize);st.stop=()=>s.getTracks().forEach(k=>k.stop());btn.textContent="Listening... blow now!";btn.disabled=true;hint.textContent="or tap the candles"}
  catch(e){btn.hidden=true;hint.textContent="Mic isn't available here. Tap the candles to blow them out."}}
function drip(x,X,Y,W,c){x.fillStyle=c;x.beginPath();x.moveTo(X+10,Y);x.lineTo(X+W-10,Y);x.quadraticCurveTo(X+W,Y,X+W,Y+12);
  const n=Math.round(W/46);for(let i=n;i>=0;i--){const px=X+12+i*(W-24)/n,d=16+((i*7)%4)*12;x.lineTo(px+10,Y+14);x.lineTo(px+10,Y+d);x.arc(px,Y+d,10,0,Math.PI);x.lineTo(px-10,Y+14)}
  x.lineTo(X,Y+12);x.quadraticCurveTo(X,Y,X+10,Y);x.fill()}
function drawCakeBody(x){
  x.fillStyle="#f8d3dc";rr(x,520,520,560,170,18);x.fill();
  x.fillStyle="rgba(255,255,255,.35)";x.fillRect(540,600,520,10);
  const cols=["#f2c27b","#ffffff","#e4174b","#7ad3c4"];
  for(let i=0;i<40;i++){x.save();x.translate(540+(i*97)%520,585+(i*53)%90);x.rotate(i);x.fillStyle=cols[i%4];x.fillRect(-7,-2.5,14,5);x.restore()}
  x.fillStyle="#fff1f4";rr(x,610,400,380,130,16);x.fill();
  drip(x,520,520,560,"#e4174b");drip(x,610,400,380,"#c2123f");
  x.font=`700 54px ${F_HAND}`;x.textAlign="center";x.textBaseline="middle";x.fillStyle="#b3173f";x.fillText(CONFIG.his,800,478)}

// ---- Episode 2 helpers ----
// draw part of an image (fractions fx0..fy1) covering box W×H, keeping the focus point centred where possible
function coverCrop(x,k,f0x,f0y,f1x,f1y,X,Y,W,H,focus,zoom=1){const img=IMG[k];if(!img||!img.naturalWidth)return;const iw=img.naturalWidth,ih=img.naturalHeight;
  const sw=(f1x-f0x)*iw,sh=(f1y-f0y)*ih,s=Math.max(W/sw,H/sh)*zoom,dw=sw*s,dh=sh*s;
  let dx=X+W/2-(focus[0]-f0x)/(f1x-f0x)*dw,dy=Y+H/2-(focus[1]-f0y)/(f1y-f0y)*dh;
  dx=Math.min(X,Math.max(X+W-dw,dx));dy=Math.min(Y,Math.max(Y+H-dh,dy));x.drawImage(img,f0x*iw,f0y*ih,sw,sh,dx,dy,dw,dh)}
function softSky(x,X,Y,W,H){const g=x.createLinearGradient(0,Y,0,Y+H);g.addColorStop(0,"#fbf0dc");g.addColorStop(.7,"#f6dcc0");g.addColorStop(1,"#c9d3c4");x.fillStyle=g;x.fillRect(X,Y,W,H)}
function smileS1(x,t){beach(x,t);
  const z=lerp(1,1.45,ease(prog(t,0,4.8))),px=967,py=200;
  x.save();x.translate(px,py);x.scale(z,z);x.translate(-px,-py);
  sprite(x,"girl",560,790,640);sprite(x,"boy",1000,790,680);x.restore();
  tint(x,"#f6c9a0",.22)}
function smileS2(x,t){beach(x,t);tint(x,"#e9b08c",.45);
  const k=prog(t,4.2,9.6);
  const panel=(X,draw)=>{x.save();rr(x,X,46,700,600,18);x.clip();softSky(x,X,46,700,600);glow(x,X+350,560,420,"255,236,200",.7);draw();x.restore();
    x.save();x.strokeStyle="rgba(255,248,236,.85)";x.lineWidth=6;rr(x,X,46,700,600,18);x.stroke();x.restore()};
  panel(70,()=>coverCrop(x,"girl",.05,0,1,.24,70,46,700,600,[.57,.1],1.02+.06*k));
  panel(830,()=>coverCrop(x,"boy",0,0,.85,.23,830,46,700,600,[.36,.11],1.02+.06*k));
  // golden light sweeping across both faces
  x.save();x.globalCompositeOperation="screen";const sx=lerp(-400,2000,prog(t,5,9));
  const g=x.createLinearGradient(sx-260,0,sx+260,LH);g.addColorStop(0,"rgba(255,210,150,0)");g.addColorStop(.5,"rgba(255,214,160,.45)");g.addColorStop(1,"rgba(255,210,150,0)");
  x.fillStyle=g;x.fillRect(0,0,LW,LH);x.restore();
  const hk=prog(t,5.6,6.4);if(hk>0)heart(x,800,340,(54+6*Math.sin(t*5))*ease(hk),"#e4174b")}
function polaroid(x,cx,cy,rot,a,drawPhoto,note){if(a<=0)return;const s=lerp(1.35,1,ease(a));x.save();x.globalAlpha*=clamp(a*1.4);
  x.translate(cx,cy);x.rotate(rot);x.scale(s,s);x.shadowColor="rgba(60,25,20,.35)";x.shadowBlur=24;x.shadowOffsetY=10;
  x.fillStyle="#fffaf2";rr(x,-170,-205,340,420,6);x.fill();x.shadowColor="transparent";
  x.save();x.beginPath();x.rect(-150,-185,300,300);x.clip();softSky(x,-150,-185,300,300);drawPhoto(-150,-185,300,300);x.restore();
  x.font=`700 34px ${F_HAND}`;x.fillStyle="#6a3b2a";x.textAlign="center";x.textBaseline="middle";wrapText(x,note,0,160,300,34);
  heart(x,128,-196,26,"#e4174b");x.restore()}
function smileS3(x,t){beach(x,t);tint(x,"#f0b493",.4);
  for(let i=0;i<14;i++)glow(x,(i*263+t*12)%1600,90+(i*157)%460,50+(i%3)*30,i%2?"255,214,150":"255,170,190",.25);
  polaroid(x,430,325,-.08,prog(t,9.4,10.1),(X,Y,W,H)=>coverCrop(x,"boy",0,0,1,.22,X,Y,W,H,[.33,.1]),"when you laugh at your own jokes");
  polaroid(x,1170,335,-.04,prog(t,10.4,11.1),(X,Y,W,H)=>coverCrop(x,"boy",0,0,1,.55,X,Y,W,H,[.45,.22]),"when you see me after a long day");
  polaroid(x,800,300,.05,prog(t,11.4,12.1),(X,Y,W,H)=>coverCrop(x,"scene",.2,.24,.85,.62,X,Y,W,H,[.52,.37]),"when you think I'm not looking")}
function smileS4(x,t){beach(x,t);
  glow(x,800,HZ,900,"255,206,150",.75);
  const m=ease(prog(t,14.6,17.4));
  sprite(x,"girl",lerp(560,770,m),790,640);sprite(x,"boy",1000,790,680);
  tint(x,"#ffb48c",.28);
  for(let i=0;i<16;i++){const k=((t-14.2)*.3+i/16)%1;heart(x,240+(i*211)%1120,LH+40-k*LH*1.1,16+(i%3)*10,i%2?"#ff8fab":"#e4174b",Math.min(1,(t-14.2))*(1-k)*.9)}
  for(let i=0;i<10;i++)sparkle(x,(i*331+120)%1600,60+(i*97)%280,10+(i%3)*6,Math.max(0,Math.sin(t*2.4+i)))}

// ---- shared: cross-fade a list of scenes [start,end,fn] ----
function runScenes(x,t,st,list,dur){list.forEach(([a,b,fn])=>{const al=clamp(Math.min(a===0?1:(t-a)/.5,b>=dur?1:(b-t)/.5));if(al<=0)return;x.save();x.globalAlpha=al;fn(x,t,st);x.restore()})}
function sfxOnce(st,key,fn){if(st.thumb||st[key])return;st[key]=1;try{if(fx())fn(ac.currentTime,FX.input)}catch(e){}}
function risingHearts(x,t,t0,n=16){for(let i=0;i<n;i++){const k=((t-t0)*.3+i/n)%1;heart(x,240+(i*211)%1120,LH+40-k*LH*1.1,16+(i%3)*10,i%2?"#ff8fab":"#e4174b",Math.min(1,Math.max(0,t-t0))*(1-k)*.9)}}
function typeText(x,txt,X,Y,k,maxW,lh){const n=Math.floor(txt.length*clamp(k));if(n<=0)return;const words=txt.slice(0,n).split(" ");let line="",y=Y;
  for(const w of words){const tt=line?line+" "+w:w;if(x.measureText(tt).width>maxW&&line){x.fillText(line,X,y);line=w;y+=lh}else line=tt}x.fillText(line,X,y)}

// ---- Episode 1: The Man He Is ----
function charS1(x,t){beach(x,t);
  const z=lerp(1,1.35,ease(prog(t,0,5))),px=967,py=200;glow(x,1000,330,520,"255,222,170",.6*ease(prog(t,.5,4.5)));
  x.save();x.translate(px,py);x.scale(z,z);x.translate(-px,-py);sprite(x,"girl",560,790,640);sprite(x,"boy",1000,790,680);x.restore();
  tint(x,"#f6c9a0",.22);
  for(let i=0;i<12;i++)sparkle(x,(i*331+140)%1600,80+(i*97)%420,8+(i%3)*5,Math.max(0,Math.sin(t*2+i))*.8)}
function charS2(x,t){beach(x,t);tint(x,"#e9b08c",.5);
  const a=ease(prog(t,4.6,5.4)),s=lerp(.94,1,a);x.save();x.translate(800,330);x.scale(s,s);x.translate(-800,-330);
  x.shadowColor="rgba(60,25,20,.35)";x.shadowBlur=40;x.shadowOffsetY=14;x.fillStyle="#fff8ee";rr(x,180,40,1240,580,26);x.fill();x.shadowColor="transparent";
  x.strokeStyle="#d9a65a";x.lineWidth=4;rr(x,196,56,1208,548,18);x.stroke();
  const arch=()=>{x.beginPath();x.moveTo(240,580);x.lineTo(240,270);x.arc(430,270,190,Math.PI,0);x.lineTo(620,580);x.closePath()};
  x.save();arch();x.clip();softSky(x,240,80,380,500);coverCrop(x,"boy",0,0,1,.5,240,80,380,500,[.38,.18],1.02+.05*prog(t,4.6,10));x.restore();
  x.strokeStyle="#d9a65a";x.lineWidth=6;arch();x.stroke();
  x.textAlign="left";x.textBaseline="alphabetic";
  x.font=`700 24px ${F_BODY}`;x.fillStyle="#c2123f";x.fillText("M A I N   C H A R A C T E R",690,130);
  x.font=`400 112px ${F_DISP}`;x.fillStyle="#2a1715";x.fillText(fill("{his}").toUpperCase(),686,232);
  x.font=`700 40px ${F_HAND}`;x.fillStyle="#b3173f";x.fillText("Born to be loved. Especially by me.",690,284);
  const stats=[["Kindness",1,"100"],["Honesty",1,"100"],["Patience",.96,"96"],["Loyalty",1,"100"],["Hug quality",1,"∞"]];
  stats.forEach(([l,v,n],i)=>{const y=360+i*52,k=ease(prog(t,5.6+i*.45,6.5+i*.45));
    x.font=`700 26px ${F_BODY}`;x.fillStyle="#5a3a2a";x.fillText(l,690,y+8);
    x.fillStyle="#f1dccb";rr(x,900,y-12,410,22,11);x.fill();if(k>0){x.fillStyle="#e4174b";rr(x,900,y-12,Math.max(22,410*v*k),22,11);x.fill()}
    x.save();x.globalAlpha*=k;x.fillStyle="#c2123f";x.font=`700 28px ${F_BODY}`;x.fillText(n,1326,y+9);x.restore()});
  x.restore()}
function charS3(x,t,st){beach(x,t);tint(x,"#d9a07e",.55);
  x.save();x.translate(800,340);x.rotate(-.012);x.translate(-800,-340);
  x.shadowColor="rgba(60,25,20,.35)";x.shadowBlur=30;x.shadowOffsetY=12;x.fillStyle="#fffaf0";rr(x,150,40,1300,600,10);x.fill();x.shadowColor="transparent";
  x.strokeStyle="rgba(120,160,200,.28)";x.lineWidth=2;for(let y=100;y<630;y+=44){x.beginPath();x.moveTo(170,y);x.lineTo(1430,y);x.stroke()}
  x.strokeStyle="rgba(228,23,75,.35)";x.beginPath();x.moveTo(380,50);x.lineTo(380,630);x.stroke();
  const rows=[["He always checks that I reached home safe.",(X,Y,W,H)=>coverCrop(x,"boy",0,0,1,.22,X,Y,W,H,[.33,.1])],
              ["He listens to my longest, silliest stories.",(X,Y,W,H)=>coverCrop(x,"scene",.2,.24,.85,.62,X,Y,W,H,[.52,.37])],
              ["He makes everyone around him feel safe.",(X,Y,W,H)=>coverCrop(x,"boy",0,0,1,.55,X,Y,W,H,[.45,.22])]];
  rows.forEach(([txt,photo],i)=>{const y=70+i*185,a=prog(t,10+i*1.5,10.4+i*1.5);if(a<=0)return;
    x.save();x.globalAlpha*=a;x.translate(260,y+75);x.rotate([-.05,.04,-.03][i]);
    x.fillStyle="#fff";x.shadowColor="rgba(0,0,0,.2)";x.shadowBlur=10;x.fillRect(-82,-75,164,160);x.shadowColor="transparent";
    x.save();x.beginPath();x.rect(-72,-65,144,130);x.clip();softSky(x,-72,-65,144,130);photo(-72,-65,144,130);x.restore();
    x.fillStyle="rgba(255,226,170,.75)";x.save();x.rotate(-.3);x.fillRect(-40,-92,80,24);x.restore();x.restore();
    x.save();x.font=`700 50px ${F_HAND}`;x.fillStyle="#3b2a20";x.textAlign="left";x.textBaseline="middle";
    typeText(x,txt,420,y+60,prog(t,10.3+i*1.5,11.6+i*1.5),960,52);x.restore();
    if(t>11.7+i*1.5)heart(x,1380,y+60,34,"#e4174b",prog(t,11.7+i*1.5,12+i*1.5))});
  x.restore()}
function charS4(x,t){beach(x,t);glow(x,800,HZ,900,"255,200,150",.75);
  const m=ease(prog(t,15.4,18)),z=lerp(1,1.07,prog(t,15,22.5));
  x.save();x.translate(800,520);x.scale(z,z);x.translate(-800,-520);sprite(x,"girl",lerp(520,775,m),790,640);sprite(x,"boy",1010,790,680);x.restore();
  tint(x,"#ffb48c",.3);risingHearts(x,t,15.2);
  for(let i=0;i<10;i++)sparkle(x,(i*331+120)%1600,60+(i*97)%280,10+(i%3)*6,Math.max(0,Math.sin(t*2.4+i)))}

// ---- Episode 3: Officially Too Cute ----
function cautionBand(x,y,rot,t,dir){x.save();x.translate(800,y);x.rotate(rot);x.fillStyle="#ffd23f";x.fillRect(-1100,-36,2200,72);
  x.save();x.beginPath();x.rect(-1100,-36,2200,72);x.clip();x.fillStyle="#2a1715";const off=(t*60*dir)%80;
  for(let X=-1200;X<1200;X+=80){x.beginPath();x.moveTo(X+off,-36);x.lineTo(X+off+36,-36);x.lineTo(X+off,36);x.lineTo(X+off-36,36);x.closePath();x.fill()}x.restore();
  x.font=`800 30px ${F_BODY}`;x.textAlign="center";x.textBaseline="middle";const msg="CAUTION   ♥   TOO CUTE   ♥   ";const w=x.measureText(msg).width,o=(t*90*dir)%w;
  x.fillStyle="#fff";x.strokeStyle="#c2123f";x.lineWidth=6;for(let X=-1300;X<1300+w;X+=w){x.strokeText(msg,X+o,2);x.fillText(msg,X+o,2)}x.restore()}
function cuteS1(x,t){x.fillStyle="#ffd6e0";x.fillRect(0,0,LW,LH);x.fillStyle="rgba(255,255,255,.55)";
  for(let y=0;y<LH;y+=60)for(let X=(y/60)%2*30;X<LW;X+=60){x.beginPath();x.arc(X,y,7,0,7);x.fill()}
  cautionBand(x,95,-.05,t,1);cautionBand(x,705,.04,t,-1);
  const p=1+.04*Math.sin(t*9),fl=.75+.25*Math.abs(Math.sin(t*5));
  x.save();x.translate(800,330);x.scale(p,p);x.textAlign="center";x.textBaseline="middle";
  x.font=`400 170px ${F_DISP}`;x.lineJoin="round";x.strokeStyle="#fff";x.lineWidth=16;x.strokeText("WARNING",0,0);x.globalAlpha=fl;x.fillStyle="#e4174b";x.fillText("WARNING",0,0);x.restore();
  sticker(x,"Extreme cuteness ahead",800,460,-.03,prog(t,.8,1.3),78);
  x.font=`700 26px ${F_BODY}`;x.textAlign="center";x.fillStyle="#7a0c2a";x.globalAlpha=prog(t,1.6,2.2);x.fillText("V I E W E R   D I S C R E T I O N   A D V I S E D",800,560);x.globalAlpha=1;
  [[300,330],[1300,330]].forEach(([X,Y],i)=>heart(x,X,Y,90+12*Math.sin(t*6+i*2),"#e4174b"))}
function crown(x,X,Y,s){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle="#f2c27b";x.strokeStyle="#a8742a";x.lineWidth=3;x.beginPath();
  x.moveTo(-40,20);x.lineTo(-44,-18);x.lineTo(-20,2);x.lineTo(0,-28);x.lineTo(20,2);x.lineTo(44,-18);x.lineTo(40,20);x.closePath();x.fill();x.stroke();
  x.fillStyle="#e4174b";[-44,0,44].forEach((cx,i)=>{x.beginPath();x.arc(cx,[-18,-28,-18][i],6,0,7);x.fill()});x.restore()}
function cuteS2(x,t,st){beach(x,t);tint(x,"#ffb8c8",.5);
  x.save();x.shadowColor="rgba(60,25,20,.35)";x.shadowBlur=30;x.shadowOffsetY=12;x.fillStyle="#fffaf4";rr(x,95,70,1410,430,12);x.fill();x.restore();
  const frames=[
    (X,Y,W,H)=>{coverCrop(x,"boy",0,0,1,.2,X,Y,W,H,[.33,.1]);sticker(x,"cutie",X+W-70,Y+46,.15,1,44)},
    (X,Y,W,H)=>{coverCrop(x,"boy",0,0,1,.45,X,Y,W,H,[.4,.2]);crown(x,X+W*.47,Y+40,1.1)},
    (X,Y,W,H)=>{coverCrop(x,"scene",.2,.24,.85,.62,X,Y,W,H,[.52,.37]);sticker(x,"us!",X+70,Y+50,-.15,1,48)},
    (X,Y,W,H)=>{coverCrop(x,"boy",0,0,1,.2,X,Y,W,H,[.33,.12],1.5);x.fillStyle="rgba(255,80,120,.35)";x.beginPath();x.ellipse(X+W*.6,Y+H*.62,34,16,0,0,7);x.fill();
      for(let i=0;i<4;i++)heart(x,X+30+i*80,Y+H-30-(i%2)*20,26,"#e4174b")}];
  frames.forEach((f,i)=>{const X=115+i*350,Y=90,a=prog(t,5+i*1.1,5.3+i*1.1);
    x.fillStyle="#f3e6e8";x.fillRect(X,Y,330,330);if(a<=0)return;
    x.save();x.globalAlpha*=a;x.beginPath();x.rect(X,Y,330,330);x.clip();softSky(x,X,Y,330,330);f(X,Y,330,330);x.restore();
    if(t>5+i*1.1)sfxOnce(st,"shot"+i,(n,o)=>{noiseHit(n,.35,o,"highpass",2500,.07);noiseHit(n+.06,.2,o,"highpass",4000,.05)})});
  x.font=`700 26px ${F_BODY}`;x.textAlign="center";x.fillStyle="#b3173f";x.fillText(("P H O T O   B O O T H   ♥   "+CONFIG.his.toUpperCase().split("").join(" ")+" ")+"  ♥   2 0 2 6",800,468);
  for(let i=0;i<4;i++){const f=1-prog(t,5+i*1.1,5.4+i*1.1);if(f>0&&f<1){x.fillStyle=`rgba(255,255,255,${.85*f})`;x.fillRect(0,0,LW,LH)}}}
function cuteS3(x,t,st){x.save();if(t>13.4&&t<14.3)x.translate(Math.sin(t*90)*7,Math.cos(t*70)*5);
  beach(x,t);sprite(x,"boy",800,790,700);tint(x,"#2a1d40",.62);
  x.strokeStyle="rgba(255,143,171,.12)";x.lineWidth=1;for(let X=0;X<LW;X+=50){x.beginPath();x.moveTo(X,0);x.lineTo(X,LH);x.stroke()}for(let y=0;y<LH;y+=50){x.beginPath();x.moveTo(0,y);x.lineTo(LW,y);x.stroke()}
  sprite(x,"boy",800,790,700,{a:.55,shadow:false});
  x.strokeStyle="#ff8fab";x.lineWidth=5;const B=[[650,70],[950,70],[650,790],[950,790]];B.forEach(([X,Y],i)=>{const sx=i%2?-1:1,sy=i<2?1:-1;x.beginPath();x.moveTo(X,Y+sy*50);x.lineTo(X,Y);x.lineTo(X+sx*50,Y);x.stroke()});
  const sy=70+(((t-9.6)*380)%720);const g=x.createLinearGradient(0,sy-60,0,sy+4);g.addColorStop(0,"rgba(255,143,171,0)");g.addColorStop(1,"rgba(255,143,171,.55)");x.fillStyle=g;x.fillRect(640,sy-60,320,64);
  x.fillStyle="#ffd3de";x.fillRect(640,sy,320,3);
  const R=[["SMILE","100%",[.29,.125]],["HAIR","PERFECTLY FLUFFY",[.45,.04]],["BEARD","VERY HANDSOME",[.3,.15]],["HUG FACTOR","MAXIMUM",[.5,.3]]];
  const bx=800-.5*700*260/903;
  R.forEach(([k,v,p],i)=>{const a=prog(t,10.2+i*.75,10.5+i*.75);if(a<=0)return;const y=170+i*90,px=bx+p[0]*700*260/903,py=790-700+p[1]*700;
    x.save();x.globalAlpha*=a;x.strokeStyle="rgba(255,143,171,.8)";x.lineWidth=2;x.beginPath();x.moveTo(1010,y-8);x.lineTo(px+10,py);x.stroke();x.fillStyle="#ff8fab";x.beginPath();x.arc(px,py,7,0,7);x.fill();
    x.textAlign="left";x.font=`700 24px ${F_BODY}`;x.fillStyle="#ffb8c8";x.fillText(k,1020,y-18);x.font=`400 44px ${F_DISP}`;x.fillStyle="#fff";x.fillText(v,1020,y+22);x.restore()});
  x.textAlign="left";x.font=`400 64px ${F_DISP}`;x.fillStyle="#fff";x.fillText("CUTENESS SCAN",150,160);
  const k=ease(prog(t,10,13.4)),err=t>13.4;x.fillStyle="rgba(255,255,255,.2)";rr(x,150,190,420,26,13);x.fill();
  x.fillStyle=err&&Math.sin(t*20)>0?"#ff3b5c":"#e4174b";rr(x,150,190,Math.max(26,420*k*(err?1.12:1)),26,13);x.fill();
  x.font=`400 90px ${F_DISP}`;x.fillStyle=err?"#ff6b84":"#fff";x.fillText(err?"ERROR":Math.round(lerp(0,999,k))+"%",150,320);
  if(err){x.font=`700 26px ${F_BODY}`;x.fillStyle="#ffb8c8";x.fillText("TOO CUTE TO MEASURE",150,365);x.fillStyle=`rgba(255,40,80,${.18*Math.abs(Math.sin(t*10))})`;x.fillRect(0,0,LW,LH);
    sfxOnce(st,"alarm",(n,o)=>{for(let i=0;i<3;i++){vco("square",880,n+i*.22,.12,.05,o);vco("square",660,n+i*.22+.11,.1,.05,o)}})}
  x.restore()}
function cuteS4(x,t,st){beach(x,t);tint(x,"#ffb8c8",.3);
  const m=ease(prog(t,15,17));const G=sprite(x,"girl",lerp(540,770,m),790,640),B=sprite(x,"boy",1010,790,680);
  const [gx,gy]=G.pt(KP.girl.face),[bx,by]=B.pt(KP.boy.face);
  for(let i=0;i<5;i++){const k=(t*.5+i/5)%1;heart(x,lerp(gx+20,bx-20,k),lerp(gy,by,k)-Math.sin(k*Math.PI)*70,26,"#e4174b",Math.sin(k*Math.PI)*(1-m*.6))}
  risingHearts(x,t,17.2,14);
  const sk=prog(t,17.2,17.45);if(sk>0){const s=lerp(2.6,1,ease(sk));x.save();x.translate(800,450);x.rotate(-.1);x.scale(s*.85,s*.85);x.globalAlpha*=.92*clamp(sk*2);
    x.strokeStyle="#e4174b";x.lineWidth=10;rr(x,-330,-70,660,140,14);x.stroke();x.lineWidth=4;rr(x,-312,-52,624,104,10);x.stroke();
    x.font=`400 96px ${F_DISP}`;x.fillStyle="#e4174b";x.textAlign="center";x.textBaseline="middle";x.fillText("OFFICIALLY MINE",0,6);x.restore();
    if(sk>=1&&!st.stamped&&!st.thumb){st.stamped=1;confetti(st,90,800,450);sfxOnce(st,"thud",(n,o)=>INS.kick(n,.6,o))}}}

const FILMS={
  character:{dur:22.5,draw(x,t,st){
    runScenes(x,t,st,[[0,5,charS1],[4.6,10,charS2],[9.6,15.4,charS3],[15,22.5,charS4]],22.5);
    glow(x,LW*(.15+.7*((t*.04)%1)),-40,620,"255,176,110",.2);vignette(x,.4);
    cap(x,"Let me tell you about someone...",t,.3,4.5);
    cap(x,"My favourite main character.",t,5,9.5);
    cap(x,"It's in the little things he does.",t,10,15);
    cap(x,"And out of everyone in this world...",t,15.4,18.4);
    cap(x,"...he chose me.",t,18.6,23,{size:110,disp:true});
  }},
  smile:{dur:19.5,draw(x,t,st){
    const scenes=[[0,4.6,smileS1],[4.2,9.6,smileS2],[9.2,14.6,smileS3],[14.2,19.5,smileS4]];
    scenes.forEach(([a,b,fn])=>{const al=clamp(Math.min(a===0?1:(t-a)/.5,b>=19.5?1:(b-t)/.5));if(al<=0)return;x.save();x.globalAlpha=al;fn(x,t,st);x.restore()});
    // drifting golden light leak
    glow(x,LW*(.15+.7*((t*.04)%1)),-40,620,"255,176,110",.22);glow(x,LW,LH,520,"255,140,150",.14);
    vignette(x,.4);
    cap(x,"Out of everything in this world...",t,.3,4.3);
    cap(x,"...my favourite thing is your smile.",t,4.6,9.2);
    cap(x,"Every version of it.",t,9.6,14.2);
    cap(x,"Never stop smiling, {his}.",t,14.6,17);
    cap(x,"It's my favourite view in the whole world.",t,17.2,20);
  }},

  cute:{dur:21.5,draw(x,t,st){
    runScenes(x,t,st,[[0,4.8,cuteS1],[4.4,10,cuteS2],[9.6,15.2,cuteS3],[14.8,21.5,cuteS4]],21.5);
    vignette(x,.3);
    cap(x,"Exhibit A: the photo booth evidence.",t,5.2,9.6);
    cap(x,"Running a cuteness scan...",t,10,13.3);
    cap(x,"ERROR: too cute to measure.",t,13.5,15,{size:96,disp:true});
    cap(x,"Officially the cutest human alive.",t,15.2,18.2);
    cap(x,"And he's all mine.",t,18.4,22,{size:104,disp:true});
  }},

  distance:{dur:19,draw(x,t,st){
    beach(x,t);
    const w=ease(prog(t,13,16.5)),dawn=ease(prog(t,14,18.5));
    const gx=lerp(240,715,w),bx=lerp(1360,885,w),bob=(w>0&&w<1)?Math.abs(Math.sin(t*8))*8:0;
    const G=sprite(x,"girl",gx,780-bob,560),B=sprite(x,"boy",bx,780-bob,580);
    tint(x,"#2c3566",lerp(.88,.3,dawn));
    stars(x,st,t,1-dawn,HZ-10);
    x.save();x.globalAlpha=1-dawn;x.fillStyle="#fff6dc";x.beginPath();x.arc(1460,110,38,0,7);x.fill();x.fillStyle="#1d2140";x.beginPath();x.arc(1476,98,35,0,7);x.fill();x.restore();
    glow(x,800,HZ,760,"255,190,150",.6*dawn);
    const A={x:gx+100,y:330},Bp={x:bx-100,y:330},C={x:800,y:lerp(170,330,w)};
    const q=k=>({x:(1-k)*(1-k)*A.x+2*(1-k)*k*C.x+k*k*Bp.x,y:(1-k)*(1-k)*A.y+2*(1-k)*k*C.y+k*k*Bp.y});
    if(w<1){x.save();x.setLineDash([2,20]);x.lineDashOffset=-t*40;x.lineCap="round";x.lineWidth=6;x.strokeStyle="rgba(255,143,171,.8)";
      x.beginPath();x.moveTo(A.x,A.y);x.quadraticCurveTo(C.x,C.y,Bp.x,Bp.y);x.stroke();x.restore()}
    if(t>2.5&&t<13){let p=(t*.3)%2;p=p>1?2-p:p;const P=q(p);heart(x,P.x,P.y,34,"#e4174b",fade(t,2.5,13))}
    if(w<.98){const M=q(.5);x.save();x.font=`400 64px ${F_DISP}`;x.textAlign="center";x.fillStyle="#f2c27b";x.globalAlpha=fade(t,.5,16.5);
      x.fillText(Math.round(CONFIG.distanceKm*(1-w))+" KM",800,M.y-30);x.restore()}
    const msgs=[[3.6,0,"Good morning, love"],[4.6,1,"Miss you so much"],[5.6,0,"Call me tonight?"],[6.6,1,"Counting the days..."],[7.6,0,"Good night. Dream of me"]];
    let gi=0,bi=0;msgs.forEach(([s,side,txt])=>{const row=side?bi++:gi++;const a=fade(t,s,12.4,.4);if(a<=0)return;
      x.save();x.globalAlpha=a;x.font=`500 30px ${F_BODY}`;const tw=x.measureText(txt).width+44,y=side?70+row*80:30+row*80,X=side?1270-tw:290;
      x.fillStyle=side?"#2f4a7a":"#e4174b";rr(x,X,y,tw,58,22);x.fill();x.fillStyle="#fff";x.textAlign="left";x.textBaseline="middle";x.fillText(txt,X+22,y+30);x.restore()});
    const sad=t>8.6&&t<13;
    if(sad)[G.pt(KP.girl.face),B.pt(KP.boy.face)].forEach(([fx,fy],i)=>{const k=((t-8.6)*.7+i*.4)%1;x.fillStyle=`rgba(170,215,255,${.85*(1-k)})`;x.beginPath();x.ellipse(fx+(i?-6:10),fy+14+k*50,5,8,0,0,7);x.fill()});
    const dim=fade(t,8.6,12.8,1)*.3;if(dim>0){x.fillStyle=`rgba(5,5,20,${dim})`;x.fillRect(0,0,LW,LH)}
    if(t>16.4&&!st.burst&&!st.thumb){st.burst=1;confetti(st,70,800,300);chime([523,659,784,1047])}
    if(w>=1)heart(x,800,170,90*(1+.1*Math.sin(t*5)),"#e4174b");
    cap(x,`${CONFIG.distanceKm} kilometres between us.`,t,.2,3.4);
    cap(x,"We lived on calls, texts and good-night messages.",t,3.6,8.3);
    cap(x,"Some nights were really, really hard.",t,8.6,12.6);
    cap(x,"But every kilometre led me back to you.",t,13,19.5);
  }},

  proposal:{dur:13,hold:true,draw(x,t,st){
    beach(x,t);
    const Y=st.yesT,yk=Y!=null?ease(prog(t,Y,Y+1.2)):0;
    const walk=ease(prog(t,.8,4.8)),gx=lerp(lerp(-150,780,walk),870,yk),bob=walk>0&&walk<1?Math.abs(Math.sin(t*7))*7:0;
    const B=sprite(x,"boy",1060,790,660),G=sprite(x,"girl",gx,790-bob,630);
    tint(x,"#ff9f8a",.42);glow(x,800,HZ,820,"255,205,150",.55);
    fairyLights(x,t);petals(x,t);
    const ra=prog(t,6.2,6.8)*(1-yk);
    if(ra>0){const [rx,ry0]=G.pt(KP.girl.hands),ry=ry0-6;x.save();x.globalAlpha=ra;
      x.fillStyle="#8a0f2f";rr(x,rx-30,ry-10,60,36,6);x.fill();
      const lid=ease(prog(t,7.2,7.9));x.save();x.translate(rx-30,ry-10);x.rotate(-lid*1.9);x.fillStyle="#b3173f";rr(x,0,-18,60,18,6);x.fill();x.restore();
      if(lid>0){glow(x,rx,ry-30,90,"255,240,200",.6*lid);x.lineWidth=5;x.strokeStyle="#f2c27b";x.beginPath();x.arc(rx,ry-14,13,0,7);x.stroke();
        x.fillStyle="#e8f6ff";x.beginPath();x.moveTo(rx,ry-46);x.lineTo(rx+10,ry-36);x.lineTo(rx,ry-26);x.lineTo(rx-10,ry-36);x.closePath();x.fill();
        for(let i=0;i<4;i++)sparkle(x,rx+Math.cos(t*2+i*1.6)*40,ry-38+Math.sin(t*2+i*1.6)*30,10,lid*(.5+.5*Math.sin(t*6+i)))}
      x.restore()}
    if(Y!=null){const [a1,b1]=G.pt(KP.girl.face),[a2,b2]=B.pt(KP.boy.face);heart(x,(a1+a2)/2,Math.min(b1,b2)-110,90*yk*(1+.1*Math.sin(t*5)),"#e4174b");
      if(!st.b2&&t>Y+1.5){st.b2=1;confetti(st,80,300,300)}if(!st.b3&&t>Y+3){st.b3=1;confetti(st,80,1300,300)}
      if(!st.rp&&t>Y+6){st.rp=1;showReplay()}}
    vignette(x,.35);
    cap(x,"I've been thinking about this for a long time...",t,.3,4.3);
    cap(x,"So this time, I'm the one asking.",t,4.6,8.4);
    if(Y==null)cap(x,"Will you be mine, forever?",t,8.8,1e9,{size:100,disp:true});
    else{cap(x,"Best. Answer. Ever.",t,Y+.3,Y+4,{size:100,disp:true});cap(x,"I love you, {his}. Always.",t,Y+4.3,1e9)}
    if(t>9.6&&!st.asked&&!st.thumb){st.asked=1;askUI(st)}
  }},

  cake:{
    init(st){st.cand=Array.from({length:CONFIG.candles},()=>({out:-1}));st.phase="blow";if(st.thumb)return;
      const mic=document.createElement("button");mic.type="button";mic.className="btn play";mic.textContent="Blow with microphone";
      const hint=document.createElement("span");hint.className="fx-hint";hint.textContent="or tap the candles";
      mic.onclick=e=>{e.stopPropagation();startMic(st,mic,hint)};st.ui.append(mic,hint)},
    click(st,px){if(st.phase!=="blow")return;let best=null,bd=1e9;st.cand.forEach((c,i)=>{const d=Math.abs(candleX(i,st.cand.length)-px);if(c.out<0&&d<bd){bd=d;best=i}});blow(st,best)},
    draw(x,t,st){
      sky(x,"#2a121c","#4a1a2c");
      for(let i=0;i<16;i++){const bx=((i*263+Math.sin(t*.3+i)*40)%1600+1600)%1600,by=120+(i*157)%420,R=60+(i%3)*30;
        glow(x,bx,by,R,i%2?"242,194,123":"255,143,171",.18)}
      sprite(x,"girl",330,880,640,{shadow:false});sprite(x,"boy",1270,880,670,{shadow:false});
      tint(x,"#e6b49a",.35);
      const lit=st.cand.filter(c=>c.out<0).length;glow(x,800,330,700,"255,190,120",.25*lit/st.cand.length);
      x.fillStyle="#2a1418";x.fillRect(0,700,LW,100);
      x.fillStyle="#f3e6e8";x.beginPath();x.ellipse(800,700,380,42,0,0,7);x.fill();
      if(st.an&&st.phase==="blow"){st.an.getByteTimeDomainData(st.buf);let s=0;for(const v of st.buf){const d=(v-128)/128;s+=d*d}st.rms=Math.sqrt(s/st.buf.length);
        if(st.rms>.12&&t-(st.lastBlow||0)>.18){st.lastBlow=t;const li=st.cand.map((c,i)=>c.out<0?i:-1).filter(i=>i>=0);blow(st,li[Math.floor(Math.random()*li.length)])}}
      const cutK=st.cutT!=null?ease(prog(t,st.cutT+1,st.cutT+1.8)):0,knife=st.cutT!=null?ease(prog(t,st.cutT,st.cutT+1)):0;
      x.save();x.beginPath();x.rect(0,0,860,LH);x.clip();drawCakeBody(x);x.restore();
      x.save();x.translate(70*cutK,6*cutK);x.beginPath();x.rect(860,0,LW,LH);x.clip();drawCakeBody(x);x.restore();
      const n=st.cand.length;
      st.cand.forEach((c,i)=>{let cx=candleX(i,n);if(cx>860)cx+=70*cutK;const top=330;
        x.fillStyle="#fff";rr(x,cx-9,top,18,72,4);x.fill();x.fillStyle="#ff8fab";for(let s=0;s<4;s++)x.fillRect(cx-9,top+8+s*17,18,6);
        x.strokeStyle="#333";x.lineWidth=3;x.beginPath();x.moveTo(cx,top);x.lineTo(cx,top-10);x.stroke();
        if(c.out<0){const fl=1+.12*Math.sin(t*20+i*3)+(st.rms||0)*2,fy=top-8;glow(x,cx,fy-20,70,"255,200,110",.55);
          x.save();x.translate(cx+Math.sin(t*9+i)*2,fy);x.scale(1,fl);x.fillStyle="#ffb02e";x.beginPath();x.moveTo(0,-44);x.quadraticCurveTo(16,-14,0,0);x.quadraticCurveTo(-16,-14,0,-44);x.fill();
          x.fillStyle="#fff3b0";x.beginPath();x.moveTo(0,-26);x.quadraticCurveTo(8,-8,0,0);x.quadraticCurveTo(-8,-8,0,-26);x.fill();x.restore()}
        else{const k=t-c.out;if(k<2.5)for(let s=0;s<5;s++){const kk=k*.8+s*.15;x.fillStyle=`rgba(220,220,230,${Math.max(0,.35*(1-k/2.5))})`;x.beginPath();x.arc(cx+Math.sin(kk*5+s)*10,top-14-kk*90,8+kk*10,0,7);x.fill()}}});
      if(st.cutT!=null){const ka=1-prog(t,st.cutT+1.8,st.cutT+2.4);if(ka>0){const by=lerp(170,540,knife);x.save();x.globalAlpha=ka;
        const kg=x.createLinearGradient(852,0,870,0);kg.addColorStop(0,"#d9dde3");kg.addColorStop(1,"#9aa1aa");x.fillStyle=kg;
        x.beginPath();x.moveTo(852,by);x.lineTo(870,by);x.lineTo(870,by+150);x.lineTo(852,by+170);x.closePath();x.fill();
        x.fillStyle="#3a2420";rr(x,848,by-90,26,92,8);x.fill();x.restore()}}
      if(st.phase==="blow")cap(x,"Make a wish, {his}...",t,.2,1e9,{y:110});
      else if(st.cutT==null)cap(x,"Your wish is on its way. Now let's cut the cake!",t,st.allOut+.3,1e9,{y:110});
      else cap(x,CONFIG.cakeTitle,t,st.cutT+1.6,1e9,{size:104,disp:true,color:"#f2c27b",y:110});
      if(st.phase==="wish"&&t>st.allOut+1.2&&!st.cutBtn){st.cutBtn=1;st.ui.innerHTML="";const b=document.createElement("button");b.type="button";b.className="btn play";b.textContent="Cut the cake";
        b.onclick=e=>{e.stopPropagation();st.cutT=st.t;st.phase="party";st.ui.innerHTML="";if(st.stop)st.stop()};st.ui.append(b)}
      if(st.phase==="party"&&t>st.cutT+1.6){if(!st.sang){st.sang=1;saveWatched("cake",1);confetti(st,140,800,350);stopMusic();melody(HAPPY_BDAY);setTimeout(()=>{if(FILM&&FILM.name==="cake"&&!FILM.paused)startMusic()},10000);setTimeout(()=>FILM&&FILM.name==="cake"&&showReplay(),9000)}
        const nb=Math.floor((t-st.cutT-1.6)/2.5);if(nb>(st.nb||0)&&nb<6){st.nb=nb;confetti(st,60,200+Math.random()*1200,250)}}
    }}
};
let CAPOFF=false;
function renderThumb(cv,name,t){const def=FILMS[name];if(!def)return;const st={t,conf:[],ui:document.createElement("div"),stars:makeStars(),thumb:true};
  if(def.init)def.init(st);cv.width=640;cv.height=320;const x=cv.getContext("2d");x.setTransform(640/LW,0,0,320/LH,0,0);
  CAPOFF=true;try{def.draw(x,t,st)}catch(e){}CAPOFF=false}
const THUMB_T={character:7,smile:7,cute:8.6,distance:6,proposal:7.9,cake:1};

ART_READY.then(()=>document.querySelectorAll("#episodes .card").forEach(c=>{const f=c.dataset.film;if(f)renderThumb(c.querySelector(".tc"),f,THUMB_T[f])}));
let FILM=null;
function startFilm(name){
  const def=FILMS[name];if(!def)return;const host=$("#mThumb");
  const c=document.createElement("canvas");c.className="film";host.prepend(c);
  const ui=document.createElement("div");ui.className="fx-ui";host.appendChild(ui);
  const bar=document.createElement("div");bar.className="fx-bar";bar.innerHTML="<i></i>";bar.hidden=true;host.appendChild(bar);const snd=document.createElement("button");snd.type="button";snd.className="fx-snd";sndLabel(snd);snd.onclick=e=>{e.stopPropagation();setMuted(!MUSIC.muted)};host.appendChild(snd);
  const st={t:0,conf:[],ui,stars:makeStars()};
  const x=c.getContext("2d");
  const size=()=>{const r=host.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2);c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)};
  const ctrl=def.dur?makeCtrl(def):null;if(ctrl)host.after(ctrl);
  FILM={name,def,st,c,ui,bar,snd,ctrl,size,raf:0,last:performance.now(),paused:false,ended:false,shown:""};
  size();addEventListener("resize",size);
  if(def.init)def.init(st);
  if(def.music!==false)startMusic();
  c.onclick=e=>{const r=c.getBoundingClientRect();
    if(def.click){def.click(st,(e.clientX-r.left)/r.width*LW,(e.clientY-r.top)/r.height*LH);return}
    togglePause()};
  const loop=now=>{if(!FILM)return;const dt=Math.min((now-FILM.last)/1000,.05);FILM.last=now;
    if(!FILM.paused)st.t+=dt;
    if(def.dur&&!def.hold&&st.t>=def.dur){st.t=def.dur;if(!FILM.ended){FILM.ended=true;stopMusic();showReplay()}}
    x.setTransform(c.width/LW,0,0,c.height/LH,0,0);
    def.draw(x,st.t,st);drawConf(x,st);
    if(FILM.paused){x.fillStyle="rgba(0,0,0,.45)";x.fillRect(0,0,LW,LH);x.fillStyle="#fff";x.beginPath();x.moveTo(760,340);x.lineTo(860,400);x.lineTo(760,460);x.closePath();x.fill()}
    updateCtrl();
    FILM.raf=requestAnimationFrame(loop)};
  FILM.raf=requestAnimationFrame(loop);
}
function showReplay(){if(!FILM)return;const b=document.createElement("button");b.type="button";b.className="btn more";b.textContent="Watch again";
  b.onclick=e=>{e.stopPropagation();restartFilm()};FILM.ui.appendChild(b)}
// ---- player controls ----
const ICON={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/></svg>',
  replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 6v12L2.5 12zM21 6v12l-8.5-6z"/></svg>',
  fwd:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 6v12l8.5-6zM3 6v12l8.5-6z"/></svg>'};
const fmtT=v=>{v=Math.max(0,Math.floor(v));return Math.floor(v/60)+":"+String(v%60).padStart(2,"0")};
function makeCtrl(def){const d=document.createElement("div");d.className="fx-ctrl";
  d.innerHTML=`<button type="button" class="fc-b fc-skip" data-a="back" aria-label="Back 5 seconds">${ICON.back}<span>5s</span></button>`+
    `<button type="button" class="fc-b fc-play" data-a="play" aria-label="Pause">${ICON.pause}</button>`+
    `<button type="button" class="fc-b fc-skip" data-a="fwd" aria-label="Forward 5 seconds"><span>5s</span>${ICON.fwd}</button>`+
    `<input type="range" class="fc-seek" id="fcSeek" min="0" max="${def.dur}" step="0.05" value="0" aria-label="Seek">`+
    `<span class="fc-time">0:00 / ${fmtT(def.dur)}</span>`;
  d.onclick=e=>{const b=e.target.closest("button");if(!b||!FILM)return;const a=b.dataset.a;
    if(a==="play")togglePause();else if(a==="back")seekFilm(FILM.st.t-5);else if(a==="fwd")seekFilm(FILM.st.t+5)};
  const sk=d.querySelector(".fc-seek");sk.addEventListener("input",()=>{if(FILM){FILM.scrub=true;seekFilm(+sk.value)}});
  sk.addEventListener("change",()=>{if(FILM)FILM.scrub=false});return d}
function togglePause(){if(!FILM)return;if(FILM.ended){seekFilm(0);FILM.paused=false;startMusic();return}
  FILM.paused=!FILM.paused;FILM.paused?stopMusic():startMusic();updateCtrl()}
function seekFilm(t){if(!FILM||!FILM.def.dur)return;const d=FILM.def,st=FILM.st;t=clamp(t,0,d.dur);
  if(st.stop)st.stop();const keep={t,stars:st.stars,ui:st.ui,conf:[]};Object.keys(st).forEach(k=>delete st[k]);Object.assign(st,keep);
  st.ui.innerHTML="";st.ui.className="fx-ui";if(d.init)d.init(st);
  const wasEnded=FILM.ended;FILM.ended=false;if(wasEnded&&!FILM.paused)startMusic();updateCtrl()}
function updateCtrl(){const F=FILM;if(!F||!F.ctrl)return;const d=F.def,t=Math.min(F.st.t,d.dur),sk=F.ctrl.querySelector(".fc-seek");saveWatched(F.name,t/d.dur);
  if(!F.scrub)sk.value=t;sk.style.setProperty("--p",(t/d.dur*100)+"%");
  const state=F.ended?"replay":F.paused?"play":"pause",lbl=fmtT(t)+" / "+fmtT(d.dur);
  if(F.shown!==state+lbl){F.shown=state+lbl;F.ctrl.querySelector(".fc-time").textContent=lbl;
    const pb=F.ctrl.querySelector(".fc-play");if(pb.dataset.s!==state){pb.dataset.s=state;pb.innerHTML=ICON[state];pb.setAttribute("aria-label",state==="pause"?"Pause":state==="play"?"Play":"Watch again")}}}
document.addEventListener("keydown",e=>{if(!FILM||$("#modal").hidden||!FILM.def.dur)return;const tag=(e.target.tagName||"").toLowerCase();
  if((e.key===" "||e.key==="k")&&tag!=="button"&&tag!=="input"){e.preventDefault();togglePause()}
  else if(e.key==="ArrowLeft"&&tag!=="input"){e.preventDefault();seekFilm(FILM.st.t-5)}
  else if(e.key==="ArrowRight"&&tag!=="input"){e.preventDefault();seekFilm(FILM.st.t+5)}});
function restartFilm(){const n=FILM.name;stopFilm();startFilm(n)}
function stopFilm(){if(!FILM)return;cancelAnimationFrame(FILM.raf);removeEventListener("resize",FILM.size);stopMusic();
  if(FILM.st.stop)FILM.st.stop();FILM.c.remove();FILM.ui.remove();FILM.bar.remove();FILM.snd.remove();if(FILM.ctrl)FILM.ctrl.remove();FILM=null}

// Modal
function openModal(d){
  $("#mThumb").style.backgroundImage=d.bg;$("#mTitle").textContent=d.title;$("#mMeta").textContent=d.meta;
  $("#mText").textContent=d.text;$("#mQuote").textContent=d.quote||"";
  const old=$("#mThumb video");if(old)old.remove();
  stopFilm();
  if(!d.video&&d.film){$("#modal").hidden=false;startFilm(d.film);$("#mClose").focus();return}
  if(d.video){
    const v=document.createElement("video");v.src=d.video;v.controls=true;v.playsInline=true;v.autoplay=true;
    if(/^url\("/.test(d.bg))v.poster=d.bg.slice(5,-2);
    $("#mThumb").prepend(v);v.play().catch(()=>{});
  }
  $("#modal").hidden=false;$("#mClose").focus();
}
function closeModal(){const v=$("#mThumb video");if(v){v.pause();v.remove()}stopFilm();$("#modal").hidden=true;paintWatched()}
$("#mClose").onclick=closeModal;
$("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#moreBtn").onclick=()=>openModal({title:`${CONFIG.his} & ${CONFIG.her}`,meta:`${CONFIG.startYear} – Forever`,text:CONFIG.heroDesc,quote:"Starring the love of my life.",bg:bg(CONFIG.heroPhoto,0)});

// Gate

// Soft chime (Web Audio, starts after a tap)
let ac;function chime(notes){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();
  notes.forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type="sine";o.frequency.value=f;
  const t=ac.currentTime+i*.18;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.03);g.gain.exponentialRampToValueAtTime(.001,t+1.4);
  o.connect(g).connect(ac.destination);o.start(t);o.stop(t+1.5)})}catch(e){}}

// ================= EXTRAS =================
const HEART_SVG='<svg viewBox="0 0 24 24" fill="#fff"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.8 4.5c2.1 0 3.6 1.2 5.2 3 1.6-1.8 3.1-3 5.2-3 3.8 0 5.9 4 4.4 7.3C19.5 16.4 12 21 12 21z"/></svg>';
const REDUCED=matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- Opening "ta-dum" intro ---
function taDum(){const a=audio(),F=fx();if(!a||!F)return;const n=a.currentTime+.05,o=F.input;
  [[0,73],[.42,55]].forEach(([d,f],i)=>{const t=n+d;vco("sine",f,t,1.6+i,.55,o,.004);vco("sine",f*2,t,.9,.18,o,.004);vco("triangle",f*3,t,.5,.06,o,.004);noiseHit(t,.18,o,"lowpass",300,.25)});
  [57,64,69,73].forEach((m,i)=>INS.pad(m,n+.45,3.2,.05,o))}
function playIntro(done){const el=$("#intro");if(REDUCED){done();return}
  el.innerHTML='<div class="streak"></div><div class="il">'+["F","♥","R","E","V","E","R"].map((ch,i)=>`<span style="animation-delay:${.15+i*.09}s">${ch==="♥"?HEART_SVG.replace('fill="#fff"','fill="#e4174b"'):ch}</span>`).join("")+'</div>';
  el.hidden=false;taDum();
  setTimeout(()=>el.classList.add("out"),2500);
  setTimeout(()=>{el.hidden=true;el.classList.remove("out");done()},3400)}

// --- Gate ---
$("#enter").onclick=()=>{$("#gate").hidden=true;playIntro(()=>{$("#app").hidden=false;window.scrollTo(0,0)})};
const other=$("#other");other.onclick=()=>{const lock=other.querySelector(".lock"),hint=$(".gate-hint");other.classList.remove("denied");void other.offsetWidth;other.classList.add("denied");
  lock.textContent="Access denied";hint.textContent=fill("Sorry, this show belongs to {his} only.");tone(196,audio()?ac.currentTime:0,.25,.08,"square");
  clearTimeout(other._t);other._t=setTimeout(()=>{other.classList.remove("denied");lock.textContent="Only you are allowed in here";hint.textContent="Tap your profile, my love"},2600)};

// --- Together counter ---
function tickTogether(){const s=new Date(CONFIG.startDate+"T00:00:00");let d=Math.max(0,Math.floor((Date.now()-s)/1000));const total=d;
  const D=Math.floor(d/86400);d-=D*86400;const H=Math.floor(d/3600);d-=H*3600;const M=Math.floor(d/60),S=d-M*60;
  const box=(v,l)=>`<div class="tg-b"><b>${v}</b><small>${l}</small></div>`;
  $("#tgRow").innerHTML=box(D.toLocaleString("en-IN"),"days")+box(String(H).padStart(2,"0"),"hours")+box(String(M).padStart(2,"0"),"minutes")+box(String(S).padStart(2,"0"),"seconds");
  $("#tgNote").innerHTML=`That's about <b>${Math.round(total*1.2).toLocaleString("en-IN")}</b> heartbeats, and every single one was for you.`}
tickTogether();setInterval(tickTogether,1000);

// --- Watched progress (remembered on this device) ---
const WKEY="forever_watched";let WATCHED={};try{WATCHED=JSON.parse(localStorage.getItem(WKEY)||"{}")||{}}catch(e){}
function saveWatched(f,k){k=Math.min(1,k);if(!(k>(WATCHED[f]||0)+.04)&&k<1)return;if(k<=(WATCHED[f]||0))return;WATCHED[f]=k;try{localStorage.setItem(WKEY,JSON.stringify(WATCHED))}catch(e){}}
function paintWatched(){document.querySelectorAll("#episodes .card").forEach(c=>{const f=c.dataset.film,k=WATCHED[f]||0,i=c.querySelector(".prog i");if(i)i.style.width=(k*100)+"%";c.classList.toggle("done",k>.92)})}
paintWatched();

// --- Open When letters ---
CONFIG.openWhen.forEach(o=>{const b=document.createElement("button");b.type="button";b.className="envc";
  b.innerHTML=`<span class="seal">${HEART_SVG}</span><span class="ow"></span>`;b.querySelector(".ow").textContent="Open when "+fill(o.when);
  b.onclick=()=>openLetter(o);$("#openwhen").appendChild(b)});
function openLetter(o){const E=$("#env");
  E.innerHTML=`<div class="env-stage"><div class="env"><div class="flap"></div><span class="seal">${HEART_SVG}</span></div>
    <div class="paper"><div class="pk"></div><div class="pt"></div><div class="ps"></div><button class="btn" type="button">Fold it back</button></div></div>`;
  E.querySelector(".pk").textContent="Open when "+fill(o.when);E.querySelector(".pt").textContent=fill(o.letter);E.querySelector(".ps").textContent=fill("— {her}");
  E.hidden=false;const st=E.querySelector(".env-stage");
  setTimeout(()=>{E.querySelector(".env").classList.add("open");tone(880,audio()?ac.currentTime:0,.2,.05)},350);
  setTimeout(()=>st.classList.add("read"),400);
  E.querySelector(".paper .btn").onclick=()=>{E.hidden=true;E.innerHTML=""};
  E.onclick=e=>{if(e.target===E){E.hidden=true;E.innerHTML=""}}}

// --- Credits + rating ---
function startCredits(){const C=$("#credits");C.hidden=false;
  C.innerHTML=`<div class="cr-roll">${CONFIG.credits.map(([r,n],i)=>`<div class="cr-i${i===1?" title":""}"><small></small><b></b></div>`).join("")}</div><button class="btn cr-skip" type="button">Skip credits</button>`;
  C.querySelectorAll(".cr-i").forEach((el,i)=>{el.querySelector("small").textContent=fill(CONFIG.credits[i][0]);el.querySelector("b").textContent=fill(CONFIG.credits[i][1])});
  const roll=C.querySelector(".cr-roll");if(REDUCED)roll.style.animationDuration="1ms";
  roll.addEventListener("animationend",showRating);C.querySelector(".cr-skip").onclick=showRating}
function showRating(){const C=$("#credits");if(C.querySelector("#rate"))return;
  const thumb=(d)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"${d?' style="transform:rotate(180deg)"':''}><path d="M7 11v9H4v-9zM7 11l4-8c1.5 0 2.5 1 2.2 2.6L12.6 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7"/></svg>`;
  const r=document.createElement("div");r.id="rate";
  r.innerHTML=`<h5>Did you enjoy Season 1?</h5><div class="rb">
    <button type="button" class="rate-b no"><span class="ic">${thumb(true)}</span>Not for me</button>
    <button type="button" class="rate-b like"><span class="ic">${thumb(false)}</span>I like this</button>
    <button type="button" class="rate-b love"><span class="ic">${HEART_SVG.replace('fill="#fff"','fill="currentColor"')}</span>Love this!</button></div>
    <div class="msg"></div><button type="button" class="btn more" id="rateHome">Back to home</button>`;
  C.appendChild(r);const msg=r.querySelector(".msg"),no=r.querySelector(".no");let n=0;
  const dodge=e=>{e.preventDefault();no.style.transform=`translate(${(Math.random()-.5)*220}px,${(Math.random()-.5)*120}px)`;msg.textContent=["Wrong button.","Nope, try again.","That button is broken.","Only one right answer here."][n++%4]};
  no.onpointerenter=dodge;no.onclick=dodge;
  r.querySelector(".like").onclick=()=>{msg.textContent="Only \"like\"? Try again, mister."};
  r.querySelector(".love").onclick=e=>{msg.textContent=fill("{her} knew you'd say that. Now go give her the biggest hug.");
    const b=e.currentTarget.getBoundingClientRect();for(let i=0;i<40;i++)setTimeout(()=>spawnHeart(b.left+b.width/2+(Math.random()-.5)*120,b.top+(Math.random()-.5)*40,true),i*35);
    melody([[523,.3],[659,.3],[784,.3],[1047,.8]],.08)};
  $("#rateHome").onclick=()=>{C.hidden=true;C.innerHTML="";stopMusic();$("#finale").hidden=true;window.scrollTo(0,0)}}

// --- Tap anywhere for hearts ---
function spawnHeart(px,py,big){const h=document.createElement("span");h.className="tap-h";
  h.innerHTML=HEART_SVG.replace('fill="#fff"',`fill="${["#e4174b","#ff8fab","#f2c27b"][Math.floor(Math.random()*3)]}"`);
  h.style.left=px+"px";h.style.top=py+"px";h.style.setProperty("--dx",((Math.random()-.5)*(big?260:90))+"px");h.style.setProperty("--r",((Math.random()-.5)*60)+"deg");
  if(big){h.style.width=h.style.height=(20+Math.random()*26)+"px"}
  document.body.appendChild(h);setTimeout(()=>h.remove(),1200)}
document.addEventListener("pointerdown",e=>{if(REDUCED||e.target.closest("input"))return;for(let i=0;i<3;i++)spawnHeart(e.clientX,e.clientY)},{passive:true});

// Finale
function startFinale(){
  closeModal();$("#finale").hidden=false;startSong("finale");
  const L=$("#letter");L.innerHTML=`<div class="k">The Final Episode</div>`;
  CONFIG.finale.forEach(raw=>{
    const d=document.createElement("div");d.className="line";let t=fill(raw);
    if(t.startsWith("BIG:")){d.classList.add("big");t=t.slice(4)}
    if(t.startsWith("SIG:")){d.classList.add("sig");t=t.slice(4)}
    d.textContent=t;L.appendChild(d);
  });
  const row=document.createElement("div");row.className="btns line";row.style.justifyContent="center";
  const cr=document.createElement("button");cr.className="btn play";cr.type="button";cr.textContent="Watch the credits";cr.onclick=startCredits;
  const back=document.createElement("button");back.className="btn more";back.type="button";back.textContent="Watch it all again";
  back.onclick=()=>{stopMusic();$("#finale").hidden=true;window.scrollTo(0,0)};row.append(cr,back);L.appendChild(row);
  const lines=[...L.querySelectorAll(".line")];
  lines.forEach((el,i)=>setTimeout(()=>{el.classList.add("on");if(el.classList.contains("big"))chime([523,659,784,1047])},600+i*1900));
  hearts();
}
$("#finaleBtn").onclick=startFinale;$("#playBtn").onclick=startFinale;

// Floating hearts
let raf;function hearts(){
  const c=$("#hearts"),x=c.getContext("2d");cancelAnimationFrame(raf);
  const rs=()=>{c.width=innerWidth;c.height=innerHeight};rs();addEventListener("resize",rs);
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  const H=Array.from({length:40},()=>({x:Math.random()*innerWidth,y:innerHeight+Math.random()*innerHeight,s:6+Math.random()*16,v:.4+Math.random()*1.1,w:Math.random()*6,a:.15+Math.random()*.5,c:["#e4174b","#ff8fab","#f2c27b"][Math.floor(Math.random()*3)]}));
  const draw=(h)=>{x.save();x.translate(h.x+Math.sin(h.w)*12,h.y);x.scale(h.s/20,h.s/20);x.globalAlpha=h.a;x.fillStyle=h.c;
    x.beginPath();x.moveTo(0,6);x.bezierCurveTo(0,0,-10,0,-10,6);x.bezierCurveTo(-10,12,0,16,0,20);x.bezierCurveTo(0,16,10,12,10,6);x.bezierCurveTo(10,0,0,0,0,6);x.fill();x.restore()};
  (function loop(){x.clearRect(0,0,c.width,c.height);H.forEach(h=>{h.y-=h.v;h.w+=.02;if(h.y<-40){h.y=c.height+20;h.x=Math.random()*c.width}draw(h)});raf=requestAnimationFrame(loop)})();
}
