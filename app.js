'use strict';
const grid=document.querySelector('#work-grid');
const dialog=document.querySelector('#project-dialog');
const statusEl=document.querySelector('#work-status');
let works=[],activeFilter='all',expanded=false,currentProject=0,variant=false;
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu');nav.classList.toggle('open',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Ouvrir le menu')}));
function render(){
 const filtered=works.filter(w=>activeFilter==='all'||w.category===activeFilter);
 const visible=activeFilter==='all'&&!expanded?filtered.slice(0,6):filtered;
 grid.replaceChildren(...visible.map((w,i)=>{
  const article=document.createElement('article');article.className='work-card';article.dataset.category=w.category;article.dataset.project=w.id;
  const button=document.createElement('button');button.className='work-button';button.setAttribute('aria-label','Découvrir '+w.title);
  const image=document.createElement('div');image.className='work-image';
  const img=document.createElement('img');img.src=w.thumbnail||'assets/'+w.id+'-thumb.webp';img.alt=w.alt;img.loading='lazy';img.width=750;img.height=750;
  const arrow=document.createElement('span');arrow.className='work-open';arrow.setAttribute('aria-hidden','true');arrow.textContent='↗';image.append(img,arrow);
  const meta=document.createElement('div');meta.className='work-meta';const title=document.createElement('h3');title.textContent=w.title;const n=document.createElement('span');n.textContent=String(works.indexOf(w)+1).padStart(2,'0');meta.append(title,n);
  const type=document.createElement('p');type.className='work-type';type.textContent=w.type;
  button.append(image,meta,type);button.addEventListener('click',()=>openProject(w.id));article.append(button);return article;
 }));
 const more=document.querySelector('#more-projects');more.hidden=activeFilter!=='all';more.innerHTML=expanded?'Réduire la sélection <span aria-hidden="true">↑</span>':'Voir les '+works.length+' projets <span aria-hidden="true">↓</span>';
 statusEl.textContent=visible.length+' réalisations affichées'+(activeFilter==='all'?' sur '+works.length:'');
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});render()}));
document.querySelector('#more-projects').addEventListener('click',()=>{expanded=!expanded;render();if(!expanded)document.querySelector('#realisations').scrollIntoView({behavior:'smooth'});else{const next=grid.children[6]?.querySelector('button');next?.focus({preventScroll:true});next?.scrollIntoView({behavior:'smooth',block:'center'})}});
function updateDialog(){
 const w=works[currentProject];variant=false;
 document.querySelector('#dialog-title').textContent=w.title;document.querySelector('#dialog-type').textContent=w.type;document.querySelector('#dialog-description').textContent=w.description;
 const img=document.querySelector('#dialog-image');img.src=w.image||'assets/'+w.id+'.webp';img.alt=w.alt;
 document.querySelector('#dialog-original').href=img.getAttribute('src');
 document.querySelector('#dialog-counter').textContent=String(currentProject+1).padStart(2,'0')+' / '+String(works.length).padStart(2,'0')+' — RÉALISATIONS';
 const caseLink=document.querySelector('#dialog-case');caseLink.hidden=!w.casePage;
 if(w.casePage)caseLink.href=w.casePage;
 const btn=document.querySelector('#variant-button');btn.hidden=w.id!=='igh';btn.textContent='Voir la version sur fond blanc';
}
function openProject(id){const index=works.findIndex(w=>w.id===id);if(index<0)return;currentProject=index;updateDialog();dialog.showModal();document.body.style.overflow='hidden';}
document.querySelectorAll('.hero-piece').forEach(b=>b.addEventListener('click',()=>openProject(b.dataset.project)));
document.querySelector('#dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow=''});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function moveProject(offset){currentProject=(currentProject+offset+works.length)%works.length;updateDialog()}
document.querySelector('#project-prev').addEventListener('click',()=>moveProject(-1));document.querySelector('#project-next').addEventListener('click',()=>moveProject(1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();moveProject(-1)}if(e.key==='ArrowRight'){e.preventDefault();moveProject(1)}});
document.querySelector('#variant-button').addEventListener('click',e=>{variant=!variant;const img=document.querySelector('#dialog-image');img.src=variant?'assets/igh-variant.webp':'assets/igh.webp';img.alt=variant?'Logo Institut Gonavien d’Haïti sur fond blanc':works[currentProject].alt;document.querySelector('#dialog-original').href=img.getAttribute('src');e.target.textContent=variant?'Voir la version sur fond bleu':'Voir la version sur fond blanc'});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.target);const subject=data.get('subject')+' — '+data.get('name').trim();const body='Bonjour Evens,\n\n'+data.get('message').trim()+'\n\n'+data.get('name').trim();const url='mailto:evensthes96@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);window.location.href=url;document.querySelector('#form-note').textContent='Votre message est prêt dans votre messagerie. Vous pouvez aussi écrire directement à evensthes96@gmail.com.'});
document.querySelector('#year').textContent=new Date().getFullYear();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){nav.querySelectorAll('a').forEach(a=>a.classList.toggle('current',a.hash==='#'+e.target.id))}}),{rootMargin:'-20% 0px -55% 0px',threshold:0});
document.querySelectorAll('main>section[id]').forEach(s=>observer.observe(s));
// Les donnees sont chargees par projets.js, sans requete reseau.
if(Array.isArray(window.PORTFOLIO_PROJECTS)){
 works=window.PORTFOLIO_PROJECTS;
 document.querySelectorAll('.filter').forEach(button=>{
  const count=button.dataset.filter==='all'?works.length:works.filter(w=>w.category===button.dataset.filter).length;
  button.querySelector('span').textContent=String(count).padStart(2,'0');
 });
 document.querySelector('.art-label span').textContent='01—'+String(works.length).padStart(2,'0');
 render();
}else{
 grid.innerHTML='<p class="empty-state">Le fichier projets.js n’a pas pu être chargé.</p>';
 document.querySelector('#more-projects').hidden=true;
}
const profileConfig=window.PORTFOLIO_CONFIG||{};
document.querySelectorAll('[data-profile-photo]').forEach(profilePhoto=>{
 profilePhoto.addEventListener('error',()=>{
  profilePhoto.src='assets/photo-profil.svg';
  profilePhoto.alt='Monogramme ET';
 },{once:true});
 if(profileConfig.photo){
  profilePhoto.alt=profileConfig.photoAlt||'Portrait d’Evens THÈS';
  profilePhoto.src=profileConfig.photo;
 }
});
