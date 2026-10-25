/* Deterministic 14-second scene; every frame depends only on t. */
(function () {
  var BG = "#0a0c0f", CYAN = "#00e5c8", WHITE = "#ffffff", DIM = "#96a0a8";
  var DISPLAY = '"Bebas Neue", Impact, sans-serif';
  var MONO = '"Space Mono", ui-monospace, monospace';
  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  function ease(v) { v = clamp(v); return v*v*(3-2*v); }
  function text(c, s, x, y, size, color, display) {
    c.fillStyle = color || WHITE; c.font = size + "px " + (display ? DISPLAY : MONO); c.fillText(s, x, y);
  }
  function line(c, points, color, width) {
    c.strokeStyle = color || DIM; c.lineWidth = width || 3; c.beginPath();
    points.forEach(function(p, i) { if(i) c.lineTo(p[0],p[1]); else c.moveTo(p[0],p[1]); }); c.stroke();
  }
  function card(c,x,y,color) {
    c.fillStyle=BG; c.fillRect(x-26,y-32,52,64); c.strokeStyle=color; c.lineWidth=3; c.strokeRect(x-26,y-32,52,64);
    c.fillStyle=color; c.fillRect(x-15,y-16,30,4); c.fillRect(x-15,y-4,24,4); c.fillRect(x-15,y+8,18,4);
  }
  function clock(c,x,y,r,color) {
    c.strokeStyle=color; c.lineWidth=3; c.beginPath(); c.arc(x,y,r,0,Math.PI*2); c.stroke();
    line(c,[[x,y-r*.6],[x,y],[x+r*.45,y]],color,3);
  }
  function draw(c,t,w,h,opts) {
    t=((t%14)+14)%14; opts=opts||{}; c.save(); c.fillStyle=BG; c.fillRect(0,0,w,h);
    var scale=Math.min(w/1600,h/900); c.translate((w-1600*scale)/2,(h-900*scale)/2); c.scale(scale,scale);
    c.strokeStyle="rgba(255,255,255,.045)"; c.lineWidth=1;
    for(var x=0;x<=1600;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,900);c.stroke();}
    for(var y=0;y<=900;y+=40){c.beginPath();c.moveTo(0,y);c.lineTo(1600,y);c.stroke();}
    c.globalAlpha=clamp(t/.5)*clamp((14-t)/.5);
    var gate=ease((t-4.4)/1.2), ship=ease((t-8)/2.7);
    text(c,"47 IDEAS",95,235,22,DIM); text(c,"ONE QUESTION",735,235,22,CYAN); text(c,"OUTCOME",1290,235,22,CYAN);
    line(c,[[110,730],[650,730],[865,570],[1170,570],[1475,570]],"rgba(255,255,255,.2)",3);
    c.save(); c.globalAlpha*=gate;
    c.fillStyle="rgba(0,229,200,.08)"; c.beginPath(); c.moveTo(690,290); c.lineTo(980,450); c.lineTo(980,585); c.lineTo(690,755); c.closePath();c.fill();
    line(c,[[690,290],[980,450],[980,585],[690,755]],CYAN,5);
    line(c,[[865,455],[865,580]],CYAN,8); c.restore();
    for(var i=0;i<47;i++) {
      var x=115+(i%8)*65,y=320+Math.floor(i/8)*72;
      var pass=i===21, move=ease((t-5-i*.025)/1.4);
      if(pass){ x=x+(860-x)*move; y=y+(515-y)*move; x+=(1340-860)*ship; }
      else { x+=(660-x)*move; y+=(i%2?220:-160)*move; }
      c.save(); if(!pass)c.globalAlpha*=1-move*.92;
      card(c,x,y,pass&&gate>.1?CYAN:WHITE);c.restore();
    }
    c.save(); c.globalAlpha*=ship; c.strokeStyle=CYAN;c.lineWidth=4;c.strokeRect(1240,350,250,330);
    text(c,"PUBLISHED",1270,405,30,CYAN,true);
    line(c,[[1300,720],[1340,760],[1430,670]],CYAN,8);
    c.restore();
    text(c,"BACKLOG",95,822,18,DIM);text(c,"FORWARD MOTION",1130,822,18,CYAN);
    if(!opts.noCaption) {
      var captions=["That doc becomes a graveyard.", "That's it. That's the filter.", "Make fewer things. Make the right things."], index=t<4.5?0:t<8?1:2;
      c.font="64px "+DISPLAY;
      var words=captions[index].split(" "), row="", cy=108;
      words.forEach(function(word){
        var next=row?row+" "+word:word;
        if(c.measureText(next).width>1456 && row){text(c,row,72,cy,64,index===2?CYAN:WHITE,true);row=word;cy+=70;}else row=next;
      });
      text(c,row,72,cy,64,index===2?CYAN:WHITE,true);
    }
    c.restore();
  }
  (window.CYWScenes=window.CYWScenes||{})["idea-filter"]={duration:14,width:1600,height:900,posterTime:11.4,title:["FEWER THINGS.", "THE RIGHT THINGS."],alt:"Dozens of idea cards collect in a backlog. A narrow filter rejects the disconnected ideas; one cyan card passes through and becomes a published page connected to a reader.",draw:draw};
})();
