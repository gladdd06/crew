/* ЭКИПАЖ — лендинг: подсветка раздела в меню при прокрутке */
(function(){
  var links=[].slice.call(document.querySelectorAll('.nav a'));
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var secs=links.map(function(a){return document.getElementById(a.getAttribute('href').slice(1));}).filter(Boolean);
  function setOn(id){
    links.forEach(function(a){a.classList.toggle('on',a===map[id]);});
    var a=map[id];
    if(a&&a.parentNode.scrollWidth>a.parentNode.clientWidth){
      var p=a.parentNode,l=a.offsetLeft-p.clientWidth/2+a.clientWidth/2;p.scrollTo({left:l,behavior:'smooth'});
    }
  }
  if('IntersectionObserver' in window){
    var vis={};
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){vis[e.target.id]=e.isIntersecting?e.intersectionRatio:0;});
      var best=null,bv=0;secs.forEach(function(s){if((vis[s.id]||0)>bv){bv=vis[s.id];best=s.id;}});
      if(best)setOn(best);else if(window.scrollY<200)setOn(null);
    },{rootMargin:'-40% 0px -50% 0px',threshold:[0,0.01,0.5,1]});
    secs.forEach(function(s){io.observe(s);});
  }
})();
