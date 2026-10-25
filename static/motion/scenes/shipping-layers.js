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
    var go=ease((t-9)/2.5),labels=["ARTIFACT","DISTRIBUTION","PIPELINE","AUDIENCE","RE-ENTRY"];
    var active=[];
    for(var i=0;i<5;i++){
      var x=110+i*285,light=i===0?1:ease((t-(3.4+i*1.1))/.65); active.push(light);
      c.fillStyle="rgba(255,255,255,.025)";c.fillRect(x,280,240,380);
      c.strokeStyle=light>.5?CYAN:DIM;c.lineWidth=light>.5?4:2;c.strokeRect(x,280,240,380);
      text(c,"0"+(i+1),x+22,345,58,light>.5?CYAN:DIM,true);text(c,labels[i],x+18,620,18,light>.5?CYAN:DIM);
      if(i<4){line(c,[[x+240,470],[x+285,470]],light>.5?CYAN:DIM,4);}
      if(i>0){
        c.save();c.globalAlpha*=light;
        if(i===1){line(c,[[x+65,435],[x+120,400],[x+175,435],[x+120,470],[x+65,435],[x+65,500],[x+120,535],[x+175,500],[x+175,435]],CYAN,4);}
        if(i===2){for(var j=0;j<3;j++){c.strokeStyle=CYAN;c.strokeRect(x+30+j*65,420,45,65);}}
        if(i===3){for(var j=0;j<3;j++){c.strokeStyle=CYAN;c.lineWidth=3;c.beginPath();c.arc(x+55+j*65,435,13,0,Math.PI*2);c.stroke();
          line(c,[[x+35+j*65,495],[x+35+j*65,470],[x+45+j*65,458],[x+65+j*65,458],[x+75+j*65,470],[x+75+j*65,495]],CYAN,3);}}
        if(i===4){c.strokeStyle=CYAN;c.lineWidth=5;c.beginPath();c.arc(x+120,465,55,-Math.PI*.2,Math.PI*1.6);c.stroke();}
        c.restore();
      }
    }
    var px=t<5?225+Math.sin(t*5)*28:225+go*1140;card(c,px,470,CYAN);
    if(t<5){line(c,[[320,405],[320,530]],WHITE,7);}
    c.save();c.globalAlpha*=go;line(c,[[1370,680],[1370,760],[225,760],[225,680]],CYAN,4);
    line(c,[[210,705],[225,680],[240,705]],CYAN,4);c.restore();
    text(c,go>.9?"SHIPPED → NEXT LOOP":"BUILD THE ROUTE",100,835,24,CYAN);
    if(!opts.noCaption) {
      var captions=["The manuscript was done. The system around the manuscript wasn't.", "Willpower runs out. Pipelines compound.", "With the loop, the launch is a flywheel."], index=t<4.5?0:t<8?1:2;
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
  (window.CYWScenes=window.CYWScenes||{})["shipping-layers"]={duration:14,width:1600,height:900,posterTime:11.4,title:["BUILD THE SYSTEM", "AROUND THE THING"],alt:"An artifact repeatedly bumps into a closed route. Distribution, pipeline, audience and re-entry layers light up in sequence, opening a route that ships the artifact and loops readers back to the next one.",draw:draw};
})();
