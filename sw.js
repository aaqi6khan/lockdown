try{self["workbox:core:5.1.3"]&&_()}catch(e){}const e=(e,...t)=>{let s=e;return t.length>0&&(s+=" :: "+JSON.stringify(t)),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}try{self["workbox:routing:5.1.3"]&&_()}catch(e){}const s=e=>e&&"object"==typeof e?e:{handle:e};class n{constructor(e,t,n="GET"){this.handler=s(t),this.match=e,this.method=n}}class a extends n{constructor(e,t,s){super(({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)},t,s)}}const i=e=>new URL(String(e),location.href).href.replace(new RegExp("^"+location.origin),"");class r{constructor(){this._routes=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(e=>{"string"==typeof e&&(e=[e]);const t=new Request(...e);return this.handleRequest({request:t})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const{params:n,route:a}=this.findMatchingRoute({url:s,request:e,event:t});let i,r=a&&a.handler;if(!r&&this._defaultHandler&&(r=this._defaultHandler),r){try{i=r.handle({url:s,request:e,event:t,params:n})}catch(e){i=Promise.reject(e)}return i instanceof Promise&&this._catchHandler&&(i=i.catch(n=>this._catchHandler.handle({url:s,request:e,event:t}))),i}}findMatchingRoute({url:e,request:t,event:s}){const n=this._routes.get(t.method)||[];for(const a of n){let n;const i=a.match({url:e,request:t,event:s});if(i)return n=i,(Array.isArray(i)&&0===i.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(n=void 0),{route:a,params:n}}return{}}setDefaultHandler(e){this._defaultHandler=s(e)}setCatchHandler(e){this._catchHandler=s(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new t("unregister-route-but-not-found-with-method",{method:e.method});const s=this._routes.get(e.method).indexOf(e);if(!(s>-1))throw new t("unregister-route-route-not-registered");this._routes.get(e.method).splice(s,1)}}let c;const o=()=>(c||(c=new r,c.addFetchListener(),c.addCacheListener()),c);function h(e,s,i){let r;if("string"==typeof e){const t=new URL(e,location.href);r=new n(({url:e})=>e.href===t.href,s,i)}else if(e instanceof RegExp)r=new a(e,s,i);else if("function"==typeof e)r=new n(e,s,i);else{if(!(e instanceof n))throw new t("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});r=e}return o().registerRoute(r),r}const l={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},u=e=>[l.prefix,e,l.suffix].filter(e=>e&&e.length>0).join("-"),d=e=>e||u(l.precache),p=e=>e||u(l.runtime),f=new Set;const g=(e,t)=>e.filter(e=>t in e),m=async({request:e,mode:t,plugins:s=[]})=>{const n=g(s,"cacheKeyWillBeUsed");let a=e;for(const e of n)a=await e.cacheKeyWillBeUsed.call(e,{mode:t,request:a}),"string"==typeof a&&(a=new Request(a));return a},w=async({cacheName:e,request:t,event:s,matchOptions:n,plugins:a=[]})=>{const i=await self.caches.open(e),r=await m({plugins:a,request:t,mode:"read"});let c=await i.match(r,n);for(const t of a)if("cachedResponseWillBeUsed"in t){const a=t.cachedResponseWillBeUsed;c=await a.call(t,{cacheName:e,event:s,matchOptions:n,cachedResponse:c,request:r})}return c},y=async({cacheName:e,request:s,response:n,event:a,plugins:r=[],matchOptions:c})=>{const o=await m({plugins:r,request:s,mode:"write"});if(!n)throw new t("cache-put-with-no-response",{url:i(o.url)});const h=await(async({request:e,response:t,event:s,plugins:n=[]})=>{let a=t,i=!1;for(const t of n)if("cacheWillUpdate"in t){i=!0;const n=t.cacheWillUpdate;if(a=await n.call(t,{request:e,response:a,event:s}),!a)break}return i||(a=a&&200===a.status?a:void 0),a||null})({event:a,plugins:r,response:n,request:o});if(!h)return;const l=await self.caches.open(e),u=g(r,"cacheDidUpdate"),d=u.length>0?await w({cacheName:e,matchOptions:c,request:o}):null;try{await l.put(o,h)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of f)await e()}(),e}for(const t of u)await t.cacheDidUpdate.call(t,{cacheName:e,event:a,oldResponse:d,newResponse:h,request:o})},R=w,q=async({request:e,fetchOptions:s,event:n,plugins:a=[]})=>{if("string"==typeof e&&(e=new Request(e)),n instanceof FetchEvent&&n.preloadResponse){const e=await n.preloadResponse;if(e)return e}const i=g(a,"fetchDidFail"),r=i.length>0?e.clone():null;try{for(const t of a)if("requestWillFetch"in t){const s=t.requestWillFetch,a=e.clone();e=await s.call(t,{request:a,event:n})}}catch(e){throw new t("plugin-error-request-will-fetch",{thrownError:e})}const c=e.clone();try{let t;t="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of a)"fetchDidSucceed"in e&&(t=await e.fetchDidSucceed.call(e,{event:n,request:c,response:t}));return t}catch(e){for(const t of i)await t.fetchDidFail.call(t,{error:e,event:n,originalRequest:r.clone(),request:c.clone()});throw e}};try{self["workbox:strategies:5.1.3"]&&_()}catch(e){}const v={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class x{constructor(e={}){if(this._cacheName=p(e.cacheName),e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this._plugins=t?e.plugins:[v,...e.plugins]}else this._plugins=[v];this._networkTimeoutSeconds=e.networkTimeoutSeconds||0,this._fetchOptions=e.fetchOptions,this._matchOptions=e.matchOptions}async handle({event:e,request:s}){const n=[];"string"==typeof s&&(s=new Request(s));const a=[];let i;if(this._networkTimeoutSeconds){const{id:t,promise:r}=this._getTimeoutPromise({request:s,event:e,logs:n});i=t,a.push(r)}const r=this._getNetworkPromise({timeoutId:i,request:s,event:e,logs:n});a.push(r);let c=await Promise.race(a);if(c||(c=await r),!c)throw new t("no-response",{url:s.url});return c}_getTimeoutPromise({request:e,logs:t,event:s}){let n;return{promise:new Promise(t=>{n=setTimeout(async()=>{t(await this._respondFromCache({request:e,event:s}))},1e3*this._networkTimeoutSeconds)}),id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,event:n}){let a,i;try{i=await q({request:t,event:n,fetchOptions:this._fetchOptions,plugins:this._plugins})}catch(e){a=e}if(e&&clearTimeout(e),a||!i)i=await this._respondFromCache({request:t,event:n});else{const e=i.clone(),s=y({cacheName:this._cacheName,request:t,response:e,event:n,plugins:this._plugins});if(n)try{n.waitUntil(s)}catch(e){}}return i}_respondFromCache({event:e,request:t}){return R({cacheName:this._cacheName,request:t,event:e,matchOptions:this._matchOptions,plugins:this._plugins})}}try{self["workbox:precaching:5.1.3"]&&_()}catch(e){}const N=[],U={get:()=>N,add(e){N.push(...e)}};let b;async function T(e,t){const s=e.clone(),n={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},a=t?t(n):n,i=function(){if(void 0===b){const e=new Response("");if("body"in e)try{new Response(e.body),b=!0}catch(e){b=!1}b=!1}return b}()?s.body:await s.blob();return new Response(i,a)}function E(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:n}=e;if(!n)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(n,location.href);return{cacheKey:e.href,url:e.href}}const a=new URL(n,location.href),i=new URL(n,location.href);return a.searchParams.set("__WB_REVISION__",s),{cacheKey:a.href,url:i.href}}class L{constructor(e){this._cacheName=d(e),this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map}addToCacheList(e){const s=[];for(const n of e){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:e,url:a}=E(n),i="string"!=typeof n&&n.revision?"reload":"default";if(this._urlsToCacheKeys.has(a)&&this._urlsToCacheKeys.get(a)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(a),secondEntry:e});if("string"!=typeof n&&n.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==n.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:a});this._cacheKeysToIntegrities.set(e,n.integrity)}if(this._urlsToCacheKeys.set(a,e),this._urlsToCacheModes.set(a,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}async install({event:e,plugins:t}={}){const s=[],n=[],a=await self.caches.open(this._cacheName),i=await a.keys(),r=new Set(i.map(e=>e.url));for(const[e,t]of this._urlsToCacheKeys)r.has(t)?n.push(e):s.push({cacheKey:t,url:e});const c=s.map(({cacheKey:s,url:n})=>{const a=this._cacheKeysToIntegrities.get(s),i=this._urlsToCacheModes.get(n);return this._addURLToCache({cacheKey:s,cacheMode:i,event:e,integrity:a,plugins:t,url:n})});await Promise.all(c);return{updatedURLs:s.map(e=>e.url),notUpdatedURLs:n}}async activate(){const e=await self.caches.open(this._cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}async _addURLToCache({cacheKey:e,url:s,cacheMode:n,event:a,plugins:i,integrity:r}){const c=new Request(s,{integrity:r,cache:n,credentials:"same-origin"});let o,h=await q({event:a,plugins:i,request:c});for(const e of i||[])"cacheWillUpdate"in e&&(o=e);if(!(o?await o.cacheWillUpdate({event:a,request:c,response:h}):h.status<400))throw new t("bad-precaching-response",{url:s,status:h.status});h.redirected&&(h=await T(h)),await y({event:a,plugins:i,response:h,request:e===s?c:new Request(e),cacheName:this._cacheName,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this._cacheName)).match(s)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new t("missing-precache-entry",{cacheName:this._cacheName,url:s instanceof Request?s.url:s})}catch(t){if(e)return fetch(s);throw t}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new t("non-precached-url",{url:e});const n=this.createHandler(s),a=new Request(e);return()=>n({request:a})}}let O;const C=()=>(O||(O=new L),O);const K=(e,t)=>{const s=C().getURLsToCacheKeys();for(const n of function*(e,{ignoreURLParametersMatching:t,directoryIndex:s,cleanURLs:n,urlManipulation:a}={}){const i=new URL(e,location.href);i.hash="",yield i.href;const r=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some(e=>e.test(s))&&e.searchParams.delete(s);return e}(i,t);if(yield r.href,s&&r.pathname.endsWith("/")){const e=new URL(r.href);e.pathname+=s,yield e.href}if(n){const e=new URL(r.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:i});for(const t of e)yield t.href}}(e,t)){const e=s.get(n);if(e)return e}};let k=!1;function M(e){k||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:n}={})=>{const a=d();self.addEventListener("fetch",i=>{const r=K(i.request.url,{cleanURLs:s,directoryIndex:t,ignoreURLParametersMatching:e,urlManipulation:n});if(!r)return;let c=self.caches.open(a).then(e=>e.match(r)).then(e=>e||fetch(r));i.respondWith(c)})})(e),k=!0)}const S=e=>{const t=C(),s=U.get();e.waitUntil(t.install({event:e,plugins:s}).catch(e=>{throw e}))},A=e=>{const t=C();e.waitUntil(t.activate())};try{self["workbox:cacheable-response:5.1.3"]&&_()}catch(e){}class P{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some(t=>e.headers.get(t)===this._headers[t])),t}}function I(e){e.then(()=>{})}class W{constructor(e,t,{onupgradeneeded:s,onversionchange:n}={}){this._db=null,this._name=e,this._version=t,this._onupgradeneeded=s,this._onversionchange=n||(()=>this.close())}get db(){return this._db}async open(){if(!this._db)return this._db=await new Promise((e,t)=>{let s=!1;setTimeout(()=>{s=!0,t(new Error("The open request was blocked and timed out"))},this.OPEN_TIMEOUT);const n=indexedDB.open(this._name,this._version);n.onerror=()=>t(n.error),n.onupgradeneeded=e=>{s?(n.transaction.abort(),n.result.close()):"function"==typeof this._onupgradeneeded&&this._onupgradeneeded(e)},n.onsuccess=()=>{const t=n.result;s?t.close():(t.onversionchange=this._onversionchange.bind(this),e(t))}}),this}async getKey(e,t){return(await this.getAllKeys(e,t,1))[0]}async getAll(e,t,s){return await this.getAllMatching(e,{query:t,count:s})}async getAllKeys(e,t,s){return(await this.getAllMatching(e,{query:t,count:s,includeKeys:!0})).map(e=>e.key)}async getAllMatching(e,{index:t,query:s=null,direction:n="next",count:a,includeKeys:i=!1}={}){return await this.transaction([e],"readonly",(r,c)=>{const o=r.objectStore(e),h=t?o.index(t):o,l=[],u=h.openCursor(s,n);u.onsuccess=()=>{const e=u.result;e?(l.push(i?e:e.value),a&&l.length>=a?c(l):e.continue()):c(l)}})}async transaction(e,t,s){return await this.open(),await new Promise((n,a)=>{const i=this._db.transaction(e,t);i.onabort=()=>a(i.error),i.oncomplete=()=>n(),s(i,e=>n(e))})}async _call(e,t,s,...n){return await this.transaction([t],s,(s,a)=>{const i=s.objectStore(t),r=i[e].apply(i,n);r.onsuccess=()=>a(r.result)})}close(){this._db&&(this._db.close(),this._db=null)}}W.prototype.OPEN_TIMEOUT=2e3;const D={readonly:["get","count","getKey","getAll","getAllKeys"],readwrite:["add","put","clear","delete"]};for(const[e,t]of Object.entries(D))for(const s of t)s in IDBObjectStore.prototype&&(W.prototype[s]=async function(t,...n){return await this._call(s,t,e,...n)});try{self["workbox:expiration:5.1.3"]&&_()}catch(e){}const F=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class H{constructor(e){this._cacheName=e,this._db=new W("workbox-expiration",1,{onupgradeneeded:e=>this._handleUpgrade(e)})}_handleUpgrade(e){const t=e.target.result.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1}),(async e=>{await new Promise((t,s)=>{const n=indexedDB.deleteDatabase(e);n.onerror=()=>{s(n.error)},n.onblocked=()=>{s(new Error("Delete blocked"))},n.onsuccess=()=>{t()}})})(this._cacheName)}async setTimestamp(e,t){const s={url:e=F(e),timestamp:t,cacheName:this._cacheName,id:this._getId(e)};await this._db.put("cache-entries",s)}async getTimestamp(e){return(await this._db.get("cache-entries",this._getId(e))).timestamp}async expireEntries(e,t){const s=await this._db.transaction("cache-entries","readwrite",(s,n)=>{const a=s.objectStore("cache-entries").index("timestamp").openCursor(null,"prev"),i=[];let r=0;a.onsuccess=()=>{const s=a.result;if(s){const n=s.value;n.cacheName===this._cacheName&&(e&&n.timestamp<e||t&&r>=t?i.push(s.value):r++),s.continue()}else n(i)}}),n=[];for(const e of s)await this._db.delete("cache-entries",e.id),n.push(e.url);return n}_getId(e){return this._cacheName+"|"+F(e)}}class j{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._cacheName=e,this._timestampModel=new H(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const e of t)await s.delete(e);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,I(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){return await this._timestampModel.getTimestamp(e)<Date.now()-1e3*this._maxAgeSeconds}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}class B{constructor(e={}){var t;this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this._isResponseDateFresh(n),i=this._getCacheExpiration(s);I(i.expireEntries());const r=i.updateTimestamp(t.url);if(e)try{e.waitUntil(r)}catch(e){}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&(t=()=>this.deleteCacheAndMetadata(),f.add(t))}_getCacheExpiration(e){if(e===p())throw new t("expire-custom-caches-only");let s=this._cacheExpirations.get(e);return s||(s=new j(e,this._config),this._cacheExpirations.set(e,s)),s}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;return t>=Date.now()-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}var Q;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),h(/^https:\/\/fonts\.googleapis\.com/,new class{constructor(e={}){if(this._cacheName=p(e.cacheName),this._plugins=e.plugins||[],e.plugins){const t=e.plugins.some(e=>!!e.cacheWillUpdate);this._plugins=t?e.plugins:[v,...e.plugins]}else this._plugins=[v];this._fetchOptions=e.fetchOptions,this._matchOptions=e.matchOptions}async handle({event:e,request:s}){"string"==typeof s&&(s=new Request(s));const n=this._getFromNetwork({request:s,event:e});let a,i=await R({cacheName:this._cacheName,request:s,event:e,matchOptions:this._matchOptions,plugins:this._plugins});if(i){if(e)try{e.waitUntil(n)}catch(a){}}else try{i=await n}catch(e){a=e}if(!i)throw new t("no-response",{url:s.url,error:a});return i}async _getFromNetwork({request:e,event:t}){const s=await q({request:e,event:t,fetchOptions:this._fetchOptions,plugins:this._plugins}),n=y({cacheName:this._cacheName,request:e,response:s.clone(),event:t,plugins:this._plugins});if(t)try{t.waitUntil(n)}catch(e){}return s}}({cacheName:"google-fonts-stylesheets"})),h(/^https:\/\/fonts\.gstatic\.com/,new class{constructor(e={}){this._cacheName=p(e.cacheName),this._plugins=e.plugins||[],this._fetchOptions=e.fetchOptions,this._matchOptions=e.matchOptions}async handle({event:e,request:s}){"string"==typeof s&&(s=new Request(s));let n,a=await R({cacheName:this._cacheName,request:s,event:e,matchOptions:this._matchOptions,plugins:this._plugins});if(!a)try{a=await this._getFromNetwork(s,e)}catch(e){n=e}if(!a)throw new t("no-response",{url:s.url,error:n});return a}async _getFromNetwork(e,t){const s=await q({request:e,event:t,fetchOptions:this._fetchOptions,plugins:this._plugins}),n=s.clone(),a=y({cacheName:this._cacheName,request:e,response:n,event:t,plugins:this._plugins});if(t)try{t.waitUntil(a)}catch(e){}return s}}({cacheName:"google-fonts-webfonts",plugins:[new class{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new P(e)}}({statuses:[0,200]}),new B({maxAgeSeconds:31536e3,maxEntries:30})]})),h(new RegExp(".*data/territories/.*.json"),new x({cacheName:"territories",plugins:[new B({maxEntries:5,purgeOnQuotaError:!0})]})),h(new RegExp(".*data/.*.json"),new x({cacheName:"datafiles"})),h(new RegExp("https://api.coronatracker.com/v3/.*"),new x({cacheName:"coronatracker",plugins:[new B({maxEntries:5,purgeOnQuotaError:!0})]})),function(e){C().addToCacheList(e),e.length>0&&(self.addEventListener("install",S),self.addEventListener("activate",A))}([{"revision":"a16f86b3ab34779384da44257beadd96","url":"35f0d12f.js"},{"revision":"33efd4a39713b0b0bf48822d4b900052","url":"3917964b.js"},{"revision":"e52f36e53c855b59767d31f726986dd7","url":"717902fc.js"},{"revision":"5696a8b84729f623c6b4500d62e1370d","url":"87a8df42.js"},{"revision":"65542a5af76fef4492d7f1de26c686bc","url":"ad5ee51b.js"},{"revision":"2140a7753149d0934a7a841ad669f508","url":"index.html"},{"revision":"1ad8486d375f9eb1cc95f5fe4c4f4f22","url":"src/assets/icons/arrow-left.js"},{"revision":"8996bcfd869187a3d7e1d6f5a439db15","url":"src/assets/icons/arrow-right.js"},{"revision":"1af9946b4b4f19e166838cea42262ed4","url":"src/assets/icons/burger.svg.js"},{"revision":"0e22542592f7e5ca87552d95e5d48ddb","url":"src/assets/icons/calendar.svg.js"},{"revision":"5cdcfae6de06af2859a60dafef34bd7f","url":"src/assets/icons/chevron-down.js"},{"revision":"ebf62b73a4f7d614fb37859cf8ee87e7","url":"src/assets/icons/chevron-up.js"},{"revision":"676fcd396ed31321316cf03d489e8359","url":"src/assets/icons/contribute.svg.js"},{"revision":"d484fee49162d385e22b3ffb81150315","url":"src/assets/icons/icons.js"},{"revision":"376fa867a2aa8139b977c2d89729bf3a","url":"src/assets/icons/info.svg.js"},{"revision":"5aa5d2fe58a2a126b8161c55afce99a1","url":"src/assets/icons/list.svg.js"},{"revision":"14265697ee7c9691823952e1f03223db","url":"src/assets/icons/loading.svg.js"},{"revision":"976fa2e970cfc1d61fe41b459097e511","url":"src/assets/icons/lock.svg.js"},{"revision":"e24830babb83c2b5f11e2bc6134d0f33","url":"src/assets/icons/logo.svg.js"},{"revision":"212e5f10fc3f22a3b8927cbed09dcb60","url":"src/assets/icons/magnify.svg.js"},{"revision":"7e1827f432ab6479221d021d59c35db4","url":"src/assets/icons/measures.svg.js"},{"revision":"0f9737c0e2e2d1968f55ea34423536b4","url":"src/assets/icons/menu.svg.js"},{"revision":"49b01896de2e46d7466495d968d0403d","url":"src/assets/icons/offline.svg.js"},{"revision":"c9ee5e2bea0383dfe4ccacb10fc55157","url":"src/assets/icons/settings.svg.js"},{"revision":"57865823655dddc1b3a1bf472c997c60","url":"src/assets/icons/ticker.svg.js"},{"revision":"649351b5866009b84d3b200b0b5bd655","url":"src/assets/icons/travel-flight.svg.js"},{"revision":"d0c648fad1caae340bb15fa5ffb08210","url":"src/assets/icons/travel-land.svg.js"},{"revision":"5f7376819f16ee0e28ab689c132d105c","url":"src/assets/icons/travel-sea.svg.js"},{"revision":"f498ac0ec6f1275d545f43b7f227bbf2","url":"src/assets/icons/true.svg.js"},{"revision":"1e1df5566aa8726e17e63e384c633e66","url":"src/assets/icons/unlock.svg.js"},{"revision":"c374a5eee464960264af389cd46fd8f7","url":"src/assets/icons/virus.svg.js"},{"revision":"6ad18a6c3fae996c7445ed81bc0db5fc","url":"src/assets/icons/viruslock.svg.js"},{"revision":"9eb44bf948ea2173d5b853a6f28c05c3","url":"src/assets/icons/world.js"},{"revision":"13e7515b13df56873f20ea3033c89b9d","url":"src/assets/icons/x.svg.js"},{"revision":"7d37bbdeb1c29bc333521425b015d1c0","url":"src/style/main.css"},{"revision":"0bc1ac319ddda777c750385b5dd9ced5","url":"translations/ar/index.js"},{"revision":"59d74a2c0a05f64e614ad9ab88456fd2","url":"translations/en-US/index.js"},{"revision":"138a8927424f09f1e4d8066813623af8","url":"translations/en/index.js"},{"revision":"1447e7b2f60e21ae0290c331ca0efc94","url":"translations/es-ES/index.js"},{"revision":"f8b5ba6a3b7cba278dd1ae17316336c0","url":"translations/es-MX/index.js"},{"revision":"befbcd9eac3e4bcfbfcebfed12d02855","url":"translations/es/index.js"},{"revision":"d350d627e14aa9a1e3a723ed08e42388","url":"translations/it/index.js"},{"revision":"a91116c2b4842902bad327191f4059ef","url":"translations/pt-BR/index.js"},{"revision":"1f5fac9fa2d9cff8d4520b8c3f93678a","url":"translations/pt/index.js"},{"revision":"6c7304c56553ac919313ec7adda65b4a","url":"translations/ru/index.js"},{"revision":"9fbf9b1a97238b1d5dfbe7356d21fee5","url":"translations/zh-CN/index.js"},{"revision":"a39e321310f45d0e6ff43451ce4b5523","url":"translations/zh-HK/index.js"}]),M(Q);const G=(J="/index.html",C().createHandlerBoundToURL(J));var J;h(new class extends n{constructor(e,{allowlist:t=[/./],denylist:s=[]}={}){super(e=>this._match(e),e),this._allowlist=t,this._denylist=s}_match({url:e,request:t}){if(t&&"navigate"!==t.mode)return!1;const s=e.pathname+e.search;for(const e of this._denylist)if(e.test(s))return!1;return!!this._allowlist.some(e=>e.test(s))}}(G,{}));
