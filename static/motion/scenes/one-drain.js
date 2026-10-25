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
    var audit=ease((t-5)/1.2), reroute=ease((t-7.5)/1.5);
    text(c,"THE SAME SEQUENCE",100,245,21,DIM);text(c,"DEPENDENCY",1150,245,21,DIM);
    c.strokeStyle="rgba(255,255,255,.45)";c.lineWidth=4;c.beginPath();c.ellipse(395,510,250,190,0,0,Math.PI*2);c.stroke();
    card(c,395,510,WHITE);
    text(c,"YOU",365,590,24,WHITE);
    line(c,[[645,510],[1180,510]],"rgba(255,255,255,.4)",4);
    for(var b=0;b<9;b++){
      var on=clamp((t-b*.5)/.5);c.save();c.globalAlpha*=on*(1-reroute*.65);
      c.strokeStyle=WHITE;c.lineWidth=3;c.strokeRect(1180+(b%3)*85,545-Math.floor(b/3)*90,78,82);c.restore();
    }
    c.save();c.globalAlpha*=audit;
    c.strokeStyle=CYAN;c.lineWidth=6;c.beginPath();c.arc(650,510,64,0,Math.PI*2);c.stroke();
    text(c,"ONE DRAIN",700,395,23,CYAN);
    line(c,[[650,575],[650,730],[1000,730]],CYAN,5);
    c.strokeRect(1010,635,430,155);text(c,"OWNED SYSTEM",1040,690,40,CYAN,true);
    text(c,"MAP → SEPARATE → OWN",1040,770,18,CYAN);c.restore();
    for(var i=0;i<18;i++){
      var phase=((t*.22+i/18)%1),x,y;
      if(phase<.65){var a=phase/.65*Math.PI*2; x=395+250*Math.cos(a);y=510+190*Math.sin(a);}
      else {var u=(phase-.65)/.35; x=645+u*485;y=510;
        if(t>7.5){x=u<.3?650:650+(u-.3)/.7*510;y=u<.3?510+u/.3*220:730;}}
      clock(c,x,y,16,t>7.5?CYAN:WHITE);
    }
    text(c,"REPEAT",100,835,18,DIM);text(c,"RECLAIM",1250,835,18,CYAN);
    if(!opts.noCaption) {
      var captions=["The real cost is compounding.", "Map it before you move it.", "You built this business. The infrastructure should answer to you."], index=t<4.5?0:t<8?1:2;
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
  (window.CYWScenes=window.CYWScenes||{})["one-drain"]={duration:14,width:1600,height:900,posterTime:11.4,title:["RECLAIM", "YOUR HOURS"],alt:"Clock tokens orbit a repeated manual task and feed a growing tower of dependency. A one-drain audit opens a documented route, sending the hours into an owned system instead.",draw:draw};
})();
