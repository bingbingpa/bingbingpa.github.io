(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"0s/0":function(e,t,a){},RXBc:function(e,t,a){"use strict";a.r(t);var n=a("dI71"),r=a("q1tI"),l=a.n(r),c=a("lXoy"),o=a("ma3e"),s=a("3765"),i=a.n(s),m=(a("UClz"),function(e){var t=e.scrollToContent,a=Object(r.useRef)();return Object(r.useEffect)((function(){var e=a.current,t=e.getContext("2d");e.height=window.innerHeight,e.width=window.innerWidth-15;for(var n=i.a.matrixTest.split(""),r=e.width/12,l=[],c=0;c<r;c++)l[c]=1;function o(){t.fillStyle="rgba(0, 0, 0, 0.05)",t.fillRect(0,0,e.width,e.height),t.fillStyle="#490",t.font="12px arial";for(var a=0;a<l.length;a++){var r=n[Math.floor(Math.random()*n.length)];t.fillText(r,12*a,12*l[a]),(12*l[a]>e.height||Math.random()>.98)&&(l[a]=0),l[a]++}}setTimeout((function(){setInterval(o,33)}))}),[]),l.a.createElement(l.a.Fragment,null,l.a.createElement("section",{className:"hero"},l.a.createElement("canvas",{ref:a,className:"matrix"}),l.a.createElement("button",{className:"button-matrix",onClick:t,"aria-label":"scroll"},l.a.createElement(o.b,null))))}),u=a("hkyM"),f=(a("pxef"),function(e){function t(){for(var t,a=arguments.length,n=new Array(a),r=0;r<a;r++)n[r]=arguments[r];return(t=e.call.apply(e,[this].concat(n))||this).separator=l.a.createRef(),t.scrollToContent=function(){t.separator.current.scrollIntoView({block:"start",behavior:"smooth"})},t}return Object(n.a)(t,e),t.prototype.render=function(){var e=this.props.data.posts.edges,t=void 0===e?[]:e;return l.a.createElement(l.a.Fragment,null,l.a.createElement(m,{scrollToContent:this.scrollToContent}),l.a.createElement("hr",{className:"hr-index",ref:this.separator}),l.a.createElement(c.a,{posts:t}),l.a.createElement(u.a,null))},t}(l.a.Component));t.default=f},UClz:function(e,t,a){},dkqk:function(e,t,a){},lXoy:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a("q1tI"),r=a.n(n),l=a("ma3e"),c=a("Wbzz"),o=(a("dkqk"),function(e){var t=e.post,a=t.excerpt,n=t.fields,o=n.slug,s=n.prefix,i=t.frontmatter,m=i.title,u=i.category;return r.a.createElement(r.a.Fragment,null,r.a.createElement("li",{className:"li-item"},r.a.createElement(c.Link,{to:o,key:o,className:"link"},r.a.createElement("h1",{className:"h1-item"},m," ",r.a.createElement(l.d,{className:"arrow"})),r.a.createElement("p",{className:"item-meta"},r.a.createElement("span",null,r.a.createElement(l.e,{size:18})," ",s),u&&r.a.createElement("span",null,r.a.createElement(l.h,{size:18})," ",u)),r.a.createElement("p",{className:"item-excerpt"},a))))}),s=(a("0s/0"),function(e){var t=e.posts;return r.a.createElement(r.a.Fragment,null,r.a.createElement("main",{className:"main"},r.a.createElement("ul",{className:"blog-ul"},t.map((function(e){var t=e.node,a=e.node.fields.slug;return r.a.createElement(o,{key:a,post:t})})))))})},pxef:function(e,t,a){}}]);
//# sourceMappingURL=component---src-pages-index-js-40c65a7ad6176a365423.js.map