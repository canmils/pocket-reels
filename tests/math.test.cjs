const {test}=require('node:test');
const assert=require('node:assert/strict');
const {STRIPS,PAYS,LINES,evaluate,gridAt,randomStop,Session,enumerate}=require('../math.js');
test('each reel has the documented symbol frequencies',()=>{for(const strip of STRIPS){assert.equal(strip.length,20);assert.deepEqual(Object.fromEntries(Object.keys(PAYS).map(s=>[s,strip.filter(x=>x===s).length])),{cherry:8,lemon:5,bell:4,star:2,seven:1});}});
test('exact payout sum matches independent frequency calculation',()=>{
 const m=enumerate();
 const frequencies={cherry:8,lemon:5,bell:4,star:2,seven:1};
 const expected=Object.keys(PAYS).reduce((s,key)=>s+frequencies[key]**3*PAYS[key],0)*5;
 assert.equal(m.combinations,8000);assert.equal(m.totalPayout,expected);assert.equal(expected,38050);assert.equal(m.rtp,.95125);assert.equal(m.hitRate,.37825);assert.equal(m.aboveBetRate,.14275);assert.equal(m.maxPayout,1405);
});
test('every combination uses the displayed grid and awards only matching lines',()=>{
 for(let a=0;a<20;a++)for(let b=0;b<20;b++)for(let c=0;c<20;c++){
  const result=evaluate([a,b,c]);let expected=0;
  for(const rows of LINES){const symbols=rows.map((row,i)=>result.grid[i][row]);if(new Set(symbols).size===1)expected+=PAYS[symbols[0]];}
  assert.equal(result.payout,expected);
 }
});
test('bets scale line wins and payout exactly',()=>{assert.equal(evaluate([11,11,11],5).payout,1400);for(const bet of [10,25])assert.equal(evaluate([11,11,11],bet).payout,1400*bet/5);});
test('adjacent visible symbols wrap around each reel',()=>{const g=gridAt([19,19,19]);for(let i=0;i<3;i++)assert.deepEqual(g[i],[STRIPS[i][19],STRIPS[i][0],STRIPS[i][1]]);});
test('invalid bets and stops are rejected',()=>{for(const bet of [0,-5,6,NaN])assert.throws(()=>evaluate([0,0,0],bet));for(const stops of [[20,0,0],[-1,0,0],[0,0],[0,NaN,0]])assert.throws(()=>gridAt(stops));});
test('session accounting is exact and insufficient credit cannot go negative',()=>{const s=new Session();const r=s.spin(5,()=>0);assert.equal(s.balance,1000-5+r.payout);assert.equal(s.wagered,5);assert.equal(s.returned,r.payout);s.balance=4;assert.throws(()=>s.spin(5));assert.equal(s.balance,4);assert.equal(s.spins,1);});
test('randomness failure leaves credits and history unchanged',()=>{const s=new Session();assert.throws(()=>s.spin(5,()=>{throw new Error('RNG unavailable');}));assert.equal(s.balance,1000);assert.equal(s.spins,0);assert.equal(s.history.length,0);});
test('RNG rejects biased tail and uses the next valid sample',()=>{let n=0;assert.equal(randomStop(20,a=>{a[0]=n++===0?4294967295:39;}),19);assert.equal(n,2);assert.throws(()=>randomStop(20,a=>{a[0]=4294967295;}));});
test('reset restores the initial session and history is bounded',()=>{const s=new Session();for(let i=0;i<15;i++)s.spin(5,()=>0);assert.equal(s.history.length,10);s.reset();assert.equal(s.balance,1000);assert.equal(s.spins,0);assert.equal(s.wagered,0);assert.equal(s.returned,0);assert.equal(s.history.length,0);});
