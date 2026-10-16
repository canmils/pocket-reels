/* Pocket Reels: original MIT-licensed game model. No browser dependencies. */
(function (root) {
  'use strict';
  const SYMBOLS = Object.freeze(['cherry', 'lemon', 'bell', 'star', 'seven']);
  const PAYS = Object.freeze({ cherry: 5, lemon: 10, bell: 25, star: 100, seven: 1400 });
  // C=cherry, L=lemon, B=bell, S=star, 7=seven. Each strip has 20 stops.
  const decode = { C: 'cherry', L: 'lemon', B: 'bell', S: 'star', 7: 'seven' };
  const STRIPS = Object.freeze([
    'CLCBCLSCLBC7CLBCSLCB',
    'BCLCSCLBCLC7BCLCSLCB',
    'LCBCLCSBCLC7BCLSCLBC'
  ].map(s => Object.freeze([...s].map(c => decode[c]))));
  const LINES = Object.freeze([[0,0,0], [1,1,1], [2,2,2], [0,1,2], [2,1,0]].map(Object.freeze));
  const BETS = Object.freeze([5, 10, 25]);
  function gridAt(stops) {
    if (!Array.isArray(stops) || stops.length !== 3 || stops.some((s,i) => !Number.isInteger(s) || s<0 || s>=STRIPS[i].length)) throw new Error('Invalid reel stops');
    return STRIPS.map((strip,i) => [0,1,2].map(row => strip[(stops[i]+row)%strip.length]));
  }
  function evaluate(stops, bet=5) {
    if (!BETS.includes(bet)) throw new Error('Invalid total bet');
    const grid = gridAt(stops), lineBet = bet / LINES.length;
    const wins = [];
    LINES.forEach((rows,index) => {
      const symbol = grid[0][rows[0]];
      if (grid.every((column,i) => column[rows[i]] === symbol)) wins.push({ line:index+1, symbol, amount:PAYS[symbol]*lineBet, rows });
    });
    return { stops:[...stops], grid, bet, lineBet, wins, payout:wins.reduce((sum,w) => sum+w.amount,0) };
  }
  // Rejection sampling removes modulo bias. Fail explicitly if crypto is unavailable.
  function randomStop(n, fill = a => root.crypto.getRandomValues(a)) {
    if (!Number.isInteger(n) || n<1 || n>0x100000000) throw new Error('Invalid random range');
    const buffer=new Uint32Array(1), limit=Math.floor(0x100000000/n)*n;
    for (let attempt=0;attempt<128;attempt++) {
      fill(buffer);
      if (buffer[0]<limit) return buffer[0]%n;
    }
    throw new Error('Random source did not produce a valid sample');
  }
  class Session {
    constructor(){this.reset();}
    reset(){this.balance=1000;this.spins=0;this.wagered=0;this.returned=0;this.history=[];}
    spin(bet, choose=randomStop) {
      if (!BETS.includes(bet)) throw new Error('Invalid total bet');
      if (this.balance<bet) throw new Error('Not enough credits. Reset the free demo to start again.');
      const result=evaluate(STRIPS.map(strip => choose(strip.length)),bet);
      // Atomic transaction: randomness and evaluation succeed before changing credits.
      this.balance+=result.payout-bet;this.spins++;this.wagered+=bet;this.returned+=result.payout;
      result.balance=this.balance;result.number=this.spins;
      this.history.unshift(result);this.history=this.history.slice(0,10);
      return result;
    }
  }
  function enumerate() {
    let combinations=0,totalPayout=0,winningSpins=0,aboveBet=0,maxPayout=0;
    for(let a=0;a<STRIPS[0].length;a++)for(let b=0;b<STRIPS[1].length;b++)for(let c=0;c<STRIPS[2].length;c++){
      const result=evaluate([a,b,c]);combinations++;totalPayout+=result.payout;
      if(result.payout>0)winningSpins++;if(result.payout>5)aboveBet++;
      maxPayout=Math.max(maxPayout,result.payout);
    }
    return {combinations,totalPayout,rtp:totalPayout/(combinations*5),hitRate:winningSpins/combinations,aboveBetRate:aboveBet/combinations,maxPayout};
  }
  const api={SYMBOLS,PAYS,STRIPS,LINES,BETS,gridAt,evaluate,randomStop,Session,enumerate};
  if(typeof module!=='undefined')module.exports=api;else root.PocketReels=api;
})(globalThis);
