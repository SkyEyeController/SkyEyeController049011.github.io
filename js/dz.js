const isMobile={Android:function(){return navigator.userAgent.match(/Android/i)},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)},Opera:function(){return navigator.userAgent.match(/Opera Mini/i)},Windows:function(){return navigator.userAgent.match(/IEMobile/i)},any:function(){return isMobile.Android()||isMobile.BlackBerry()||isMobile.iOS()||isMobile.Opera()||isMobile.Windows()}};function dz(){function n(n,e,t){return n.getAttribute(e)||t}function e(n){return document.getElementsByTagName(n)}function t(){var t=e("script"),i=t.length,o=t[i-1];return{l:i,z:n(o,"zIndex",-1),o:n(o,"opacity",.5),c:n(o,"color","0,0,0"),n:n(o,"count",99)}}function i(){a=c.width=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,r=c.height=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}function o(){m.clearRect(0,0,a,r);var n,e,t,i,c,l;x.forEach((function(o,s){for(o.x+=o.xa,o.y+=o.ya,o.xa*=o.x>a||o.x<0?-1:1,o.ya*=o.y>r||o.y<0?-1:1,m.fillRect(o.x-.5,o.y-.5,1,1),e=s+1;e<u.length;e++){n=u[e],null!==n.x&&null!==n.y&&(i=o.x-n.x,c=o.y-n.y,l=i*i+c*c,l<n.max&&(n===w&&l>=n.max/2&&(o.x-=.03*i,o.y-=.03*c),t=(n.max-l)/n.max,m.beginPath(),m.lineWidth=t/2,m.strokeStyle="rgba("+d.c+","+(t+.2)+")",m.moveTo(o.x,o.y),m.lineTo(n.x,n.y),m.stroke()))}})),s(o)}var a,r,u,c=document.createElement("canvas"),d=t(),l="c_n"+d.l,m=c.getContext("2d"),s=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(n){window.setTimeout(n,1e3/45)},y=Math.random,w={x:null,y:null,max:2e4};c.id=l,c.style.cssText="position:fixed;top:0;left:0;z-index:"+d.z+";opacity:"+d.o,e("body")[0].appendChild(c),i(),window.onresize=i,window.onmousemove=function(n){n=n||window.event,w.x=n.clientX,w.y=n.clientY},window.onmouseout=function(){w.x=null,w.y=null};for(var x=[],f=0;d.n>f;f++){var h=y()*a,g=y()*r,b=2*y()-1,v=2*y()-1;x.push({x:h,y:g,xa:b,ya:v,max:6e3})}u=x.concat([w]),setTimeout((function(){o()}),100)}!isMobile.any()&&dz();