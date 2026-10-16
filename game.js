'use strict';
const {SYMBOLS,PAYS,STRIPS,LINES,Session,gridAt,enumerate}=PocketReels;
const $=selector=>document.querySelector(selector),session=new Session();
const reels=$('#reels'),bet=$('#bet'),spin=$('#spin'),reset=$('#reset');
let busy=false,sound=false,audio=null;
const icon=name=>`<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#${name}"/></svg>`;
function renderColumn(column,symbols){
  column.replaceChildren(...symbols.map(name=>{const cell=document.createElement('div');cell.className='cell';cell.setAttribute('aria-label',name);cell.innerHTML=icon(name);return cell;}));
}
for(let i=0;i<3;i++){const column=document.createElement('div');column.className='reel';column.setAttribute('role','group');column.setAttribute('aria-label',`Reel ${i+1}, top to bottom`);reels.append(column);}
function renderGrid(grid){[...reels.children].forEach((column,i)=>renderColumn(column,grid[i]));}
renderGrid(gridAt([0,4,8]));
$('#paytable').innerHTML=SYMBOLS.map(name=>`<div class="pay">${icon(name)}<b>${PAYS[name]}×</b><span>${name}</span></div>`).join('');
$('#lines').innerHTML=LINES.map((rows,i)=>`<svg viewBox="0 0 60 50" role="img" aria-label="Line ${i+1}">${[0,1,2].flatMap(x=>[0,1,2].map(y=>`<circle cx="${10+x*20}" cy="${7+y*18}" r="2"/>`)).join('')}<path d="M${rows.map((y,x)=>`${10+x*20} ${7+y*18}`).join('L')}"/></svg>`).join('');
const maths=enumerate();
$('#rtp').textContent=`${(maths.rtp*100).toFixed(3)}%`;
$('#hit-rate').textContent=`${(maths.hitRate*100).toFixed(3)}%`;
$('#math-description').textContent=`Exactly ${maths.combinations.toLocaleString()} equally likely stop combinations. ${(maths.aboveBetRate*100).toFixed(3)}% pay more than the total bet. Maximum payout: ${maths.maxPayout} credits at a total bet of 5 (${maths.maxPayout/5}× total bet).`;
function status(message){$('#result').textContent=message;}
function tone(freq,duration=.06){
  if(!sound||!audio)return;
  const oscillator=audio.createOscillator(),gain=audio.createGain();
  oscillator.type='sine';oscillator.frequency.value=freq;gain.gain.setValueAtTime(.04,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
  oscillator.connect(gain);gain.connect(audio.destination);oscillator.start();oscillator.stop(audio.currentTime+duration);
}
$('#sound').onclick=()=>{
  sound=!sound;
  if(sound){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});}catch{sound=false;}}
  $('#sound').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-pressed',String(sound));tone(440);
};
function setBusy(value){busy=value;spin.disabled=value||session.balance<Number(bet.value);bet.disabled=value;reset.disabled=value;reels.setAttribute('aria-busy',String(value));}
function updateSession(){
  $('#balance').textContent=session.balance.toLocaleString();
  $('#session-summary').textContent=session.spins?`${session.spins} spins · ${session.wagered.toLocaleString()} wagered · ${session.returned.toLocaleString()} returned · Net ${session.balance-1000>=0?'+':''}${session.balance-1000} credits.`:'No spins yet.';
  $('#history-list').replaceChildren(...session.history.map(result=>{const item=document.createElement('li');item.textContent=`Spin ${result.number}: bet ${result.bet}, payout ${result.payout}, net ${result.payout-result.bet>=0?'+':''}${result.payout-result.bet}. Balance ${result.balance}.`;return item;}));
}
function animateColumn(column,index,result,reduced){
  column.classList.add('spinning');let phase=0;
  return new Promise(resolve=>{
    const timer=reduced?null:setInterval(()=>{renderColumn(column,[0,1,2].map(row=>STRIPS[index][(phase+row)%20]));phase++;},70);
    setTimeout(()=>{if(timer!==null)clearInterval(timer);column.classList.remove('spinning');renderColumn(column,result.grid[index]);tone(280+index*100);resolve();},reduced?60:850+index*220);
  });
}
async function doSpin(){
  if(busy)return;
  setBusy(true);$('#line-overlay').replaceChildren();
  try{
    const totalBet=Number(bet.value),before=session.balance;
    const result=session.spin(totalBet);
    $('#balance').textContent=(before-totalBet).toLocaleString();$('#payout').textContent='—';status('Spinning…');
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    await Promise.all([...reels.children].map((column,i)=>animateColumn(column,i,result,reduced)));
    updateSession();$('#payout').textContent=result.payout.toLocaleString();
    for(const win of result.wins){
      win.rows.forEach((row,i)=>reels.children[i].children[row].classList.add('winning'));
      const line=document.createElementNS('http://www.w3.org/2000/svg','polyline');line.setAttribute('points',win.rows.map((row,i)=>`${50+i*100},${50+row*100}`).join(' '));$('#line-overlay').append(line);
    }
    const net=result.payout-result.bet;
    if(result.payout===0)status(`No line match. Bet ${result.bet} · Payout 0.`);
    else if(net>0){status(`Payout ${result.payout} · Net +${net} · Winning line${result.wins.length>1?'s':''}: ${result.wins.map(w=>w.line).join(', ')}.`);tone(660,.18);}
    else if(net===0)status(`Payout ${result.payout} · Break-even spin. No net win.`);
    else status(`Payout ${result.payout} · Net −${-net}. Less than the total bet.`);
    if(session.balance<Number(bet.value))status(`${$('#result').textContent} Choose a lower bet or reset the free demo.`);
  }catch(error){updateSession();status(error.message||'Unable to spin. Please reload the demo.');}
  finally{setBusy(false);}
}
spin.onclick=doSpin;
bet.onchange=()=>{$('#total-bet').textContent=bet.value;setBusy(false);status(`Total bet ${bet.value} · ${Number(bet.value)/5} per line. All five lines active.`);};
reset.onclick=()=>{if(busy)return;session.reset();updateSession();$('#payout').textContent='—';$('#line-overlay').replaceChildren();renderGrid(gridAt([0,4,8]));status('New session. 1,000 free credits.');setBusy(false);};
// Space works outside interactive controls; native button keyboard behaviour is retained.
document.addEventListener('keydown',event=>{if(event.code!=='Space'||event.repeat||['BUTTON','SELECT','A','INPUT','TEXTAREA'].includes(event.target.tagName))return;event.preventDefault();doSpin();});
const tabs=[...document.querySelectorAll('[role=tab]')];
function selectTab(tab){for(const item of tabs){const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;}}
for(const tab of tabs){tab.onclick=()=>selectTab(tab);tab.onkeydown=event=>{let index=tabs.indexOf(tab);if(event.key==='ArrowRight')index=(index+1)%tabs.length;else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=tabs.length-1;else return;event.preventDefault();selectTab(tabs[index]);tabs[index].focus();};}
