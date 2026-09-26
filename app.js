const $=(s,e=document)=>e.querySelector(s),$$=(s,e=document)=>[...e.querySelectorAll(s)],fmt=n=>Math.round(n).toLocaleString('en-US');
const R=[['home','Home'],['basics','Basics'],['needs-wants','Needs vs wants'],['rule','50-30-20'],['goals','Savings goals'],['planner','Planner'],['mistakes','Mistakes'],['gallery','Gallery'],['search','Search'],['about','About']];
const num=(v,min=0,max=1e9)=>{v=String(v).replace(/,/g,'').trim();if(!/^\d+(\.\d+)?$/.test(v))return null;const n=+v;return n<min||n>max?null:n};
const BAD='Enter a number above zero, such as 50,000. Negative values and letters are not accepted.';
$('#nav').innerHTML=R.map(r=>`<li><a href="#${r[0]}">${r[1]}</a></li>`).join('');
$('#fn').innerHTML=$('#sm').innerHTML=R.map(r=>`<li><a href="#${r[0]}">${r[1]}</a></li>`).join('');
const seen=new Set();
function route(){let id=location.hash.slice(1);if(!R.some(r=>r[0]===id))id='home';$$('.page').forEach(p=>p.classList.toggle('on',p.id===id));
$$('#nav a').forEach(a=>a.getAttribute('href')==='#'+id?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
const nm=R.find(r=>r[0]===id)[1];document.title=nm+' | BudgetBasics';seen.add(id);
$('#visits').textContent=`Sections you have explored this session: ${seen.size} of ${R.length}.`;
if(id==='home')setTimeout(()=>hero(),50);window.scrollTo(0,0);$('#main').focus({preventScroll:true})}
addEventListener('hashchange',route);
/* tips */
const T=['Pay yourself first: move savings out the day money arrives.','Wait 48 hours before any purchase you did not plan.','Small daily spends add up. Track them for one week.','An emergency fund starts with the first small deposit.','Compare the price per use, not just the price tag.'];let ti=0;
const tip=()=>{$('#tip').textContent='Tip: '+T[ti++%T.length]};tip();setInterval(tip,6000);
/* theme */
$('#theme').onclick=e=>{const l=document.documentElement.dataset.theme!=='light';document.documentElement.dataset.theme=l?'light':'dark';e.target.setAttribute('aria-pressed',!l);e.target.textContent=l?'Dark mode':'Light mode'};
/* split */
const parts=[['Needs',.5,'var(--mt)'],['Wants',.3,'var(--am)'],['Savings',.2,'var(--co)']];
const split=(n,grow)=>`<div class="stack" role="img" aria-label="Needs 50 percent, wants 30 percent, savings 20 percent">${parts.map(p=>`<i style="width:${grow?p[1]*100:0}%;background:${p[2]}"></i>`).join('')}</div><div class="rows">${parts.map(p=>`<div><span><span class="sw" style="background:${p[2]}"></span>${p[0]} (${p[1]*100}%)</span><b>${fmt(n*p[1])}</b></div>`).join('')}</div>`;
function draw(el,n){el.innerHTML=split(n,false);requestAnimationFrame(()=>requestAnimationFrame(()=>$$('.stack i',el).forEach((b,i)=>b.style.width=parts[i][1]*100+'%')))}
function hero(){const n=num($('#hin').value,.01);$('#herr').textContent=n===null?BAD:'';$('#hin').setAttribute('aria-invalid',n===null);if(n!==null){draw($('#hout'),n);window.gl&&window.gl(n)}}
$('#hin').oninput=hero;
$('#rbtn').onclick=()=>{const n=num($('#rin').value,.01);$('#rerr').textContent=n===null?BAD:'';$('#rin').setAttribute('aria-invalid',n===null);if(n!==null)draw($('#rout'),n)};
$('#rin').onkeydown=e=>{if(e.key==='Enter')$('#rbtn').click()};
$('#cards').innerHTML=[['basics','Basics','Income, expenses, needs, wants, savings in plain words.'],['needs-wants','Needs vs wants','Sort real student spending and get instant feedback.'],['goals','Savings goals','See how long a laptop or trip fund will take.'],['planner','Expense planner','Track a practice month and watch the balance.'],['mistakes','Money mistakes','Five common slips and how to fix each one.']].map(c=>`<div><h3>${c[1]}</h3><p class="mut">${c[2]}</p><a href="#${c[0]}">Open ${c[1].toLowerCase()}</a></div>`).join('')
+'<div><h3>Budget helper</h3><p class="mut">Ask a question and get a short lesson.</p><a href="#" id="cardschat">Open budget helper</a></div>';
$('#cardschat')&&($('#cardschat').onclick=e=>{e.preventDefault();openChat()});
/* quiz engine */
function quiz(el,items){let i=0,s=0;const d=()=>{if(i>=items.length){el.innerHTML=`<p><b>You scored ${s} of ${items.length}.</b></p><button class="btn">Try again</button>`;$('button',el).onclick=()=>{i=0;s=0;d()};return}
const it=items[i];el.innerHTML=`<p><b>Question ${i+1} of ${items.length}</b><br>${it.q}</p><div class="row">${it.o.map((o,k)=>`<button class="chip" data-k="${k}">${o}</button>`).join('')}</div><div class="fb" role="status"></div>`;
$$('.chip',el).forEach(b=>b.onclick=()=>{const ok=+b.dataset.k===it.a;if(ok)s++;$$('.chip',el).forEach(x=>x.disabled=true);$('.fb',el).innerHTML=`<p><b style="color:var(--${ok?'mint':'cor'})">${ok?'Correct.':'Not quite.'}</b> ${it.w}</p><button class="btn nx">${i+1<items.length?'Next question':'See score'}</button>`;const n=$('.nx',el);n.onclick=()=>{i++;d()};n.focus()})};d()}
quiz($('#q1'),[{q:'Which of these is a variable expense?',o:['Rent','Food delivery','Phone plan'],a:1,w:'It changes each month, so you control it.'},{q:'Savings are money you spend first and save what is left.',o:['True','False'],a:1,w:'Set savings aside first, then spend the rest.'},{q:'A one-off birthday gift is reliable monthly income.',o:['True','False'],a:1,w:'Budget only income you can count on.'}]);
quiz($('#q2'),[['Monthly bus pass to class','Need','Getting to school is essential.'],['Third streaming subscription','Want','Nice to have, and easy to cancel.'],['Basic groceries','Need','Food is essential.'],['Limited-edition sneakers','Want','No essential cost is attached.'],['Prescription medicine','Need','Health comes first.'],['Daily takeaway coffee','Want','Brewing at home meets the need for less.']].map(x=>({q:`Is this a need or a want? <b>${x[0]}</b>`,o:['Need','Want'],a:x[1]==='Need'?0:1,w:x[2]})));
/* goals */
$('#gbtn').onclick=()=>{const t=num($('#gt').value,.01),c=num($('#gc').value,0),m=num($('#gm').value,.01),e=$('#gerr'),o=$('#gout');
if(t===null||c===null||m===null){e.textContent='Fill every field with a number. Target and monthly saving must be above zero.';return}e.textContent='';
if(c>=t){o.innerHTML='<h2>Goal reached.</h2><p>You already have the full amount. Set a new goal.</p>';return}
const left=t-c,mo=Math.ceil(left/m),dt=new Date();dt.setMonth(dt.getMonth()+mo);const pct=Math.round(c/t*100);
o.innerHTML=`<h2>${mo} month${mo>1?'s':''} to go</h2><p>Left to save: <b>${fmt(left)}</b>. At ${fmt(m)} a month you reach it around <b>${dt.toLocaleDateString('en',{month:'long',year:'numeric'})}</b>.</p><div class="meter" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Progress toward goal"><i style="width:0"></i></div><p>${pct}% saved so far.</p>`;
requestAnimationFrame(()=>requestAnimationFrame(()=>$('.meter i',o).style.width=pct+'%'))};
/* planner */
let P=[{n:'Room rent',c:'Needs',a:12000},{n:'Groceries',c:'Needs',a:6000},{n:'Streaming apps',c:'Wants',a:800}],ed=null;
function plan(){const tot=P.reduce((s,x)=>s+x.a,0),b=num($('#pb').value,0),bal=(b||0)-tot;
$('#pl').innerHTML=P.length?P.map((x,i)=>`<tr><td>${x.n.replace(/</g,'&lt;')}</td><td>${x.c}</td><td>${fmt(x.a)}</td><td><button class="ghost" data-e="${i}" aria-label="Edit ${x.n.replace(/"/g,'')}">Edit</button> <button class="ghost" data-d="${i}" aria-label="Delete ${x.n.replace(/"/g,'')}">Delete</button></td></tr>`).join(''):'<tr><td colspan="4">No expenses yet. Add your first one using the form.</td></tr>';
const cat=['Needs','Wants','Savings'],col=['var(--mt)','var(--am)','var(--co)'];
$('#psum').innerHTML=`<div class="rows"><div><span>Total spent</span><b>${fmt(tot)}</b></div><div><span>Balance left</span><b style="color:var(--${bal<0?'cor':'mint'})">${fmt(bal)}</b></div></div>${bal<0?'<p class="err">You are over budget. Look at your wants first.</p>':''}${b===null?'<p class="err">Enter a valid budget above.</p>':''}`+cat.map((k,i)=>{const v=P.filter(x=>x.c===k).reduce((s,x)=>s+x.a,0);return`<p style="margin:12px 0 0">${k}: ${fmt(v)}</p><div class="meter" style="margin:4px 0;height:14px"><i style="width:${tot?v/tot*100:0}%;background:${col[i]}"></i></div>`}).join('')}
$('#pb').oninput=plan;
$('#pf').onsubmit=e=>{e.preventDefault();const n=$('#pn').value.trim(),a=num($('#pa').value,.01);if(!n||a===null){$('#perr').textContent='Add a name and an amount above zero. Letters and negative numbers are not accepted.';return}$('#perr').textContent='';
const it={n,c:$('#pc').value,a};ed===null?P.push(it):P[ed]=it;ed=null;$('#pf').reset();$('#psave').textContent='Add expense';$('#pcancel').hidden=true;plan();$('#pn').focus()};
$('#pcancel').onclick=()=>{ed=null;$('#pf').reset();$('#psave').textContent='Add expense';$('#pcancel').hidden=true};
$('#pl').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.d){P.splice(+b.dataset.d,1);plan()}else if(b.dataset.e){ed=+b.dataset.e;const x=P[ed];$('#pn').value=x.n;$('#pc').value=x.c;$('#pa').value=x.a;$('#psave').textContent='Save changes';$('#pcancel').hidden=false;$('#pn').focus()}};plan();
/* mistakes */
$('#mm').innerHTML=[['Impulse buying','You see a jacket on sale and buy it in 30 seconds.','Add a 48-hour wait. If you still want it, and it fits your wants budget, buy it.'],['Small leaks','Three coffees, two snacks, and a ride a week vanish without notice.','Track every spend for 7 days. Cut the one leak you would not miss.'],['Late payments','You forget a phone bill and pay a late fee.','Set a reminder two days before each due date, or use autopay for fixed bills.'],['No plan','Money runs out on day 20 and you borrow from friends.','Give each week a spending limit before the month starts.'],['No emergency fund','A broken phone forces you to use credit.','Save a small amount each month until you hold one month of needs.']].map(m=>`<details><summary>${m[0]}</summary><div><p><span class="tag">Scenario</span> ${m[1]}</p><p><span class="tag g">Fix</span> ${m[2]}</p></div></details>`).join('');
/* gallery */
const S=(a,b)=>`<svg viewBox="0 0 200 110" role="img" aria-label="${a}">${b}</svg>`;
const G=[['Save','The 50-30-20 split','A wide bar divided into three blocks: needs 50 percent, wants 30 percent, savings 20 percent.',S('','<rect x="10" y="40" width="90" height="34" fill="#10B981"/><rect x="100" y="40" width="54" height="34" fill="#F59E0B"/><rect x="154" y="40" width="36" height="34" fill="#EF4444"/>')],
['Save','The 52-week saving challenge','Bars rising step by step, showing you save a little more each week.',S('','<rect x="20" y="80" width="20" height="16" fill="#10B981"/><rect x="50" y="64" width="20" height="32" fill="#10B981"/><rect x="80" y="48" width="20" height="48" fill="#10B981"/><rect x="110" y="32" width="20" height="64" fill="#10B981"/><rect x="140" y="16" width="20" height="80" fill="#F59E0B"/>')],
['Plan','The monthly budget cycle','Four blocks in a row: earn, plan, track, review, then repeat.',S('','<rect x="8" y="40" width="40" height="30" fill="#10B981"/><rect x="56" y="40" width="40" height="30" fill="#10B981"/><rect x="104" y="40" width="40" height="30" fill="#10B981"/><rect x="152" y="40" width="40" height="30" fill="#F59E0B"/>')],
['Spend','Where small leaks hide','A tall bar with gaps cut out, showing small spends draining a budget.',S('','<rect x="70" y="10" width="60" height="90" fill="#10B981"/><rect x="70" y="30" width="60" height="8" fill="#EF4444"/><rect x="70" y="52" width="60" height="8" fill="#EF4444"/><rect x="70" y="74" width="60" height="8" fill="#EF4444"/>')],
['Spend','Need or want?','Two overlapping squares. The overlap shows items that start as needs but turn into wants when upgraded.',S('','<rect x="30" y="20" width="80" height="70" fill="#10B981" opacity=".85"/><rect x="90" y="30" width="80" height="70" fill="#F59E0B" opacity=".85"/>')],
['Plan','Emergency fund stairs','Three steps climbing toward one month, then three months of needs.',S('','<rect x="20" y="70" width="50" height="30" fill="#10B981"/><rect x="70" y="50" width="50" height="50" fill="#10B981"/><rect x="120" y="25" width="60" height="75" fill="#F59E0B"/>')]];
let gt='All';const tp=['All',...new Set(G.map(g=>g[0]))];
function gal(){$('#gf').innerHTML=tp.map(t=>`<button class="chip" aria-pressed="${t===gt}">${t}</button>`).join('');
$$('#gf .chip').forEach(b=>b.onclick=()=>{gt=b.textContent;gal()});
$('#gg').innerHTML=G.filter(g=>gt==='All'||g[0]===gt).map(g=>`<div class="art">${g[3].replace('aria-label=""',`aria-label="${g[2]}"`)}<div><h3>${g[1]}</h3><p class="mut" style="margin:0">${g[2]}</p></div></div>`).join('')}gal();
/* chatbot */
const K=[[/save|saving|goal/,'Start small and automatic: move a fixed amount to savings the day money arrives, then use the Savings goals page to see your timeline.'],[/50|rule|split/,'The 50-30-20 rule suggests 50% needs, 30% wants, 20% savings. It is a starting point; students with high rent may need to shift it.'],[/need|want/,'A need protects housing, food, health, or school access. A want improves life but can wait. Try the sorting game on Needs vs wants.'],[/emergency|fund/,'An emergency fund covers surprise costs like a broken phone. Aim first for one month of needs, then build up.'],[/impulse|buy|shop/,'Wait 48 hours before unplanned purchases. If you still want it and it fits your wants budget, it is a planned buy.'],[/track|expense|planner/,'Log every spend for a week. The Expense planner shows your total and balance against a budget you choose.'],[/late|bill|debt|credit/,'Late bills cost fees. Set reminders two days before due dates, and pay fixed bills first.'],[/hello|hi|hey/,'Hello! Ask me about saving, needs and wants, the 50-30-20 rule, or emergency funds.']];
const Q=['How do I start saving?','What is the 50-30-20 rule?','Need or want?','What is an emergency fund?'];
const say=(t,c)=>{const p=document.createElement('p');p.className='m '+c;p.textContent=t;$('#log').append(p);requestAnimationFrame(()=>{$('#log').scrollTop=$('#log').scrollHeight})};
let chatStarted=false;
const ask=q=>{q=q.trim();if(!q)return;say(q,'u');const k=K.find(x=>x[0].test(q.toLowerCase()));say(k?k[1]:'I do not have a lesson for that yet. Try asking about saving, needs and wants, the 50-30-20 rule, or emergency funds.','b')};
$('#chips').innerHTML=Q.map(q=>`<button class="chip">${q}</button>`).join('');$$('#chips .chip').forEach(b=>b.onclick=()=>ask(b.textContent));
$('#cf').onsubmit=e=>{e.preventDefault();ask($('#ci').value);$('#ci').value=''};
/* floating chat panel open/close */
const chatfab=$('#chatfab'),chatpanel=$('#chatpanel');
function openChat(){if(!chatStarted){chatStarted=true;say('Hi, I am the BudgetBasics helper. I share general lessons only, not financial advice. What would you like to learn?','b')}
chatpanel.hidden=false;chatfab.setAttribute('aria-expanded','true');chatfab.hidden=true;$('#ci').focus()}
function closeChat(){chatpanel.hidden=true;chatfab.setAttribute('aria-expanded','false');chatfab.hidden=false;chatfab.focus()}
chatfab.onclick=openChat;$('#chatclose').onclick=closeChat;
addEventListener('keydown',e=>{if(e.key==='Escape'&&!chatpanel.hidden)closeChat()});
/* search */
const IX=$$('.page').map(p=>({id:p.id,t:R.find(r=>r[0]===p.id)[1],x:p.innerText||p.textContent})).filter(p=>!['search','feedback'].includes(p.id));
let sf='All';
function srch(){const q=$('#si').value.trim().toLowerCase();IX.forEach(p=>{if(!p.x||p.x.length<20)p.x=$('#'+p.id).textContent});
$('#sc').innerHTML=['All',...IX.map(p=>p.t)].map(t=>`<button class="chip" aria-pressed="${t===sf}">${t}</button>`).join('');$$('#sc .chip').forEach(b=>b.onclick=()=>{sf=b.textContent;srch()});
if(!q){$('#sn').textContent='Type a word to search all lessons.';$('#sr').innerHTML='';return}
const r=IX.filter(p=>(sf==='All'||p.t===sf)&&p.x.toLowerCase().includes(q));$('#sn').textContent=r.length?`${r.length} section${r.length>1?'s':''} matched "${q}".`:'';
$('#sr').innerHTML=r.length?r.map(p=>{const t=p.x.replace(/\s+/g,' '),i=t.toLowerCase().indexOf(q);return`<div><h3>${p.t}</h3><p class="mut">...${t.slice(Math.max(0,i-60),i+120).replace(/</g,'&lt;')}...</p><a href="#${p.id}">Open ${p.t.toLowerCase()}</a></div>`}).join(''):`<div><h3>No results for "${q.replace(/</g,'&lt;')}"</h3><p>Check the spelling, try a shorter word like "save", or choose All sections.</p></div>`}
$('#sf').onsubmit=e=>{e.preventDefault();srch()};$('#si').oninput=srch;srch();
/* feedback */
$('#ff').onsubmit=e=>{e.preventDefault();const em=$('#fe').value.trim(),m=$('#fm').value.trim(),er=[];
if(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))er.push('Enter an email like name@example.com, or leave it blank.');if(!$('#fr').value)er.push('Choose a rating.');if(m.length<10)er.push('Write at least 10 characters in your message.');
$('#ferr').textContent=er.join(' ');$('#fe').setAttribute('aria-invalid',!!er.some(x=>x.includes('email')));$('#fm').setAttribute('aria-invalid',m.length<10);
if(!er.length){$('#fok').textContent='Thank you. Your feedback was checked here in your browser. Nothing was sent or stored.';$('#ff').reset()}else $('#fok').textContent=''};

/* 3D scene */
(function(){const rm=matchMedia('(prefers-reduced-motion:reduce)').matches,cv=$('#gl');if(!window.THREE||!cv)return;
let r;try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){cv.hidden=true;return}
r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,100);cam.position.set(0,3.2,13);cam.lookAt(0,.6,0);
sc.add(new THREE.AmbientLight(0xffffff,.6));const dl=new THREE.DirectionalLight(0xffffff,1);dl.position.set(-5,10,7);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);Object.assign(dl.shadow.camera,{left:-9,right:9,top:9,bottom:-9});sc.add(dl);const pl=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.ShadowMaterial({opacity:.2}));pl.rotation.x=-Math.PI/2;pl.receiveShadow=true;sc.add(pl);
const g=new THREE.Group();sc.add(g);const cols=[0x10B981,0xF59E0B,0xEF4444],hs=[5,3,2],B=[];
cols.forEach((c,i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(2,1,2),new THREE.MeshStandardMaterial({color:c,roughness:.62,metalness:.04}));m.castShadow=true;m.position.x=(i-1)*2.8;m.scale.y=.01;g.add(m);B.push(m)});

const C=[];for(let i=0;i<0;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.07,32),new THREE.MeshStandardMaterial({color:0xF59E0B,metalness:.85,roughness:.25}));m.position.set((Math.random()-.5)*11,1+Math.random()*6,(Math.random()-.5)*5);m.rotation.set(Math.random()*3,0,Math.random()*3);m.userData={s:.01+Math.random()*.02,y:m.position.y,p:Math.random()*6};sc.add(m);C.push(m)}
let k=.9,tk=.9,mx=0,my=0,cw=0,ch=0;window.gl=n=>{tk=.6+Math.min(1,Math.log10(n+1)/6)*.7};
addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mx=((e.clientX-b.left)/b.width-.5)*2;my=((e.clientY-b.top)/b.height-.5)*2});
let t=0;function loop(){requestAnimationFrame(loop);const w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;if(w!==cw||h!==ch){cw=w;ch=h;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
t+=.016;k+=(tk-k)*.06;B.forEach((m,i)=>{const H=hs[i]*k,d=m.scale.y;m.scale.y=d+(H-d)*.08;m.position.y=m.scale.y/2});
g.rotation.y+=((rm?.5:.55+mx*.6+Math.sin(t*.4)*.12)-g.rotation.y)*.06;g.rotation.x+=(my*.12-g.rotation.x)*.06;
if(!rm)C.forEach(m=>{m.rotation.x+=m.userData.s*2;m.position.y=m.userData.y+Math.sin(t+m.userData.p)*.35});r.render(sc,cam)}loop()})();
/* pointer tilt */
if(false){let cur=null;
addEventListener('pointermove',e=>{const el=e.target.closest&&e.target.closest('.grid>*,.panel');if(cur&&cur!==el)cur.style.transform='';cur=el;if(!el)return;const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform=`perspective(800px) rotateX(${(-y*7).toFixed(2)}deg) rotateY(${(x*9).toFixed(2)}deg) translateZ(10px)`});
document.addEventListener('pointerleave',()=>{if(cur)cur.style.transform=''})}
/* back to top + chat fab reveal on scroll */
const totop=$('#totop');
const revealFabs=()=>{const show=scrollY>420;totop.classList.toggle('show',show);chatfab.classList.toggle('show',show)};
addEventListener('scroll',revealFabs,{passive:true});revealFabs();
totop.onclick=()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
route();
