'use strict';
const effects=document.querySelector('#effects-video');
const miniapp=document.querySelector('#miniapp-video');
const bread=document.querySelector('#bread-video');
const videos=[effects,miniapp,bread];
videos.forEach(video=>video.addEventListener('play',()=>videos.filter(v=>v!==video).forEach(v=>v.pause())));
function begin(video){video.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});video.play().catch(()=>{video.focus()})}
document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>begin(button.dataset.play==='effects'?effects:button.dataset.play==='bread'?bread:miniapp)));
function seekAndPlay(video,time){video.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});const start=()=>{video.currentTime=time;video.play().catch(()=>video.focus())};if(video.readyState>=1){start()}else{video.addEventListener('loadedmetadata',start,{once:true});video.load()}}
document.querySelectorAll('[data-seek]').forEach(button=>button.addEventListener('click',()=>seekAndPlay(effects,Number(button.dataset.seek))));
document.querySelectorAll('[data-bread-seek]').forEach(button=>button.addEventListener('click',()=>seekAndPlay(bread,Number(button.dataset.breadSeek))));
effects.addEventListener('timeupdate',()=>{const t=effects.currentTime;document.querySelectorAll('[data-seek]').forEach((b,i)=>b.classList.toggle('selected',i===(t<9?0:t<16?1:2)))});
const collections={cis:[['assets/cis-cover.jpg','笼百味品牌主视觉'],['assets/cis-logo.png','品牌标志创意说明'],['assets/cis-scene.jpg','江南意境概念视觉'],['assets/cis-pattern.jpg','江南窗格视觉元素']],miniapp:[['assets/miniapp-0.jpg','小程序页面浏览'],['assets/miniapp-1.jpg','小程序内容探索'],['assets/miniapp-2.jpg','事件详情与时间线'],['assets/miniapp-3.jpg','小程序界面展示']]};
let currentCollection='cis',currentImage=0,opener;
const viewer=document.querySelector('#viewer'),image=document.querySelector('#viewer-image');
function renderImage(){const list=collections[currentCollection],item=list[currentImage];image.src=item[0];image.alt=item[1];document.querySelector('#viewer-title').textContent=item[1];document.querySelector('#viewer-count').textContent=`${currentImage+1} / ${list.length}`}
function step(dir){currentImage=(currentImage+dir+collections[currentCollection].length)%collections[currentCollection].length;renderImage()}
document.querySelectorAll('[data-gallery]').forEach(b=>b.addEventListener('click',()=>{opener=b;currentCollection=b.dataset.gallery;currentImage=Number(b.dataset.image);videos.forEach(v=>v.pause());renderImage();viewer.showModal();document.body.style.overflow='hidden'}));
document.querySelector('#prev-image').addEventListener('click',()=>step(-1));document.querySelector('#next-image').addEventListener('click',()=>step(1));document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}if(e.key==='ArrowRight'){e.preventDefault();step(1)}});
const nav=document.querySelectorAll('nav a');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}})},{rootMargin:'-20% 0px -55% 0px'});document.querySelectorAll('#work,#selected,#about').forEach(s=>observer.observe(s));
document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause())});


// Original lightweight particle portrait, using no external visual assets.
const particleCanvas=document.querySelector('#portrait-particles');
const portraitToggle=document.querySelector('.portrait-toggle');
const portraitPhoto=document.querySelector('.revealed-portrait');
if(particleCanvas){
 const ctx=particleCanvas.getContext('2d');const stage=particleCanvas.parentElement;
 let points=[],pointer={x:-9999,y:-9999},frame,visible=true,size=360;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function resizeParticles(){const bounds=stage.getBoundingClientRect();size=bounds.width;const dpr=Math.min(devicePixelRatio||1,2);particleCanvas.width=size*dpr;particleCanvas.height=size*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);points=[];for(let i=0;i<560;i++){const angle=Math.random()*Math.PI*2;const radius=size*(.26+Math.random()*.105);points.push({x:Math.cos(angle)*radius+size/2,y:Math.sin(angle)*radius+size/2,seed:Math.random()*6.28,r:Math.random()*1.15+.45})}drawParticles(0)}
 function drawParticles(now){ctx.clearRect(0,0,size,size);points.forEach(p=>{let x=p.x,y=p.y;const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy);if(dist<75&&dist>0){x+=dx/dist*(75-dist)*.45;y+=dy/dist*(75-dist)*.45}if(!reduced.matches){x+=Math.sin(now*.00045+p.seed)*2;y+=Math.cos(now*.00045+p.seed)*2}ctx.fillStyle=p.r>1?'#ae602e':'#cb8a52';ctx.globalAlpha=.45+p.r*.25;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1}
 function animate(now){if(!visible||document.hidden||stage.classList.contains('show-photo')){frame=null;return}drawParticles(now);if(!reduced.matches)frame=requestAnimationFrame(animate);else frame=null}
 function restart(){if(!frame&&!document.hidden&&visible&&!stage.classList.contains('show-photo'))frame=requestAnimationFrame(animate)}
 stage.addEventListener('pointermove',e=>{const b=stage.getBoundingClientRect();pointer={x:e.clientX-b.left,y:e.clientY-b.top};if(reduced.matches)drawParticles(0)});stage.addEventListener('pointerleave',()=>{pointer={x:-9999,y:-9999};if(reduced.matches)drawParticles(0)});
 portraitToggle.addEventListener('click',()=>{const show=portraitToggle.getAttribute('aria-pressed')!=='true';portraitToggle.setAttribute('aria-pressed',String(show));portraitToggle.innerHTML=show?'返回粒子 <span>✦</span>':'点击认识我 <span>✦</span>';portraitPhoto.hidden=!show;particleCanvas.hidden=show;stage.classList.toggle('show-photo',show);if(!show)restart()});
 new ResizeObserver(()=>{resizeParticles();restart()}).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)restart()}).observe(stage);
 document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',restart);
}
