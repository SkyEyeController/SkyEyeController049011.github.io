const numberOfParticules=20;const minOrbitRadius=50;const maxOrbitRadius=100;const minCircleRadius=10;const maxCircleRadius=20;const minAnimeDuration=900;const maxAnimeDuration=1500;const minDiffuseRadius=50;const maxDiffuseRadius=100;let canvasEl=document.querySelector(".fireworks");let ctx=canvasEl.getContext("2d");let pointerX=0;let pointerY=0;let tap="ontouchstart"in window||navigator.msMaxTouchPoints?"touchstart":"mousedown";let colors=["127, 180, 226","157, 209, 243","204, 229, 255"];function setCanvasSize(){canvasEl.width=window.innerWidth;canvasEl.height=window.innerHeight;canvasEl.style.width=window.innerWidth+"px";canvasEl.style.height=window.innerHeight+"px"}function updateCoords(t){pointerX=t.clientX||t.touches[0].clientX;pointerY=t.clientY||t.touches[0].clientY}function setParticuleDirection(t){let e=anime.random(0,360)*Math.PI/180;let n=anime.random(minDiffuseRadius,maxDiffuseRadius);let i=[-1,1][anime.random(0,1)]*n;return{x:t.x+i*Math.cos(e),y:t.y+i*Math.sin(e)}}function createParticule(t,e){let n={};n.x=t;n.y=e;n.color="rgba("+colors[anime.random(0,colors.length-1)]+","+anime.random(.2,.8)+")";n.radius=anime.random(minCircleRadius,maxCircleRadius);n.endPos=setParticuleDirection(n);n.draw=function(){ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,2*Math.PI,true);ctx.fillStyle=n.color;ctx.fill()};return n}function createCircle(t,e){let n={};n.x=t;n.y=e;n.color="#000";n.radius=.1;n.alpha=.5;n.lineWidth=6;n.draw=function(){ctx.globalAlpha=n.alpha;ctx.beginPath();ctx.arc(n.x,n.y,n.radius,0,2*Math.PI,true);ctx.lineWidth=n.lineWidth;ctx.strokeStyle=n.color;ctx.stroke();ctx.globalAlpha=1};return n}function renderParticule(t){for(let e=0;e<t.animatables.length;e++){t.animatables[e].target.draw()}}function animateParticules(t,e){let n=createCircle(t,e);let i=[];for(let n=0;n<numberOfParticules;n++){i.push(createParticule(t,e))}anime.timeline().add({targets:i,x:function(t){return t.endPos.x},y:function(t){return t.endPos.y},radius:.1,duration:anime.random(minAnimeDuration,maxAnimeDuration),easing:"easeOutExpo",update:renderParticule}).add({targets:n,radius:anime.random(minOrbitRadius,maxOrbitRadius),lineWidth:0,alpha:{value:0,easing:"linear",duration:anime.random(600,800)},duration:anime.random(1200,1800),easing:"easeOutExpo",update:renderParticule,offset:0})}let render=anime({duration:Infinity,update:function(){ctx.clearRect(0,0,canvasEl.width,canvasEl.height)}});document.addEventListener(tap,(function(t){render.play();updateCoords(t);animateParticules(pointerX,pointerY)}),false);setCanvasSize();window.addEventListener("resize",setCanvasSize,false);