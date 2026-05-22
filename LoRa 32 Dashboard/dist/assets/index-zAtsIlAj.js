(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();function fo(){"serviceWorker"in navigator&&window.addEventListener("load",async()=>{try{await navigator.serviceWorker.register("/sw.js"),console.log("✅ Service Worker registered")}catch(n){console.error("SW registration failed:",n)}})}function ct(n){let e=n;const t=[];function s(){t.forEach(i=>i(e))}return{get(){return e},set(i){e=i,s()},update(i){e=i(e),s()},subscribe(i){t.push(i)}}}function po(n,e){const t=ct(e(n.get()));return n.subscribe(()=>{t.set(e(n.get()))}),t}var Ds={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai={NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m=function(n,e){if(!n)throw Le(e)},Le=function(n){return new Error("Firebase Database ("+Ai.SDK_VERSION+") INTERNAL ASSERT FAILED: "+n)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&s+1<n.length&&(n.charCodeAt(s+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++s)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},mo=function(n){const e=[];let t=0,s=0;for(;t<n.length;){const i=n[t++];if(i<128)e[s++]=String.fromCharCode(i);else if(i>191&&i<224){const r=n[t++];e[s++]=String.fromCharCode((i&31)<<6|r&63)}else if(i>239&&i<365){const r=n[t++],o=n[t++],a=n[t++],l=((i&7)<<18|(r&63)<<12|(o&63)<<6|a&63)-65536;e[s++]=String.fromCharCode(55296+(l>>10)),e[s++]=String.fromCharCode(56320+(l&1023))}else{const r=n[t++],o=n[t++];e[s++]=String.fromCharCode((i&15)<<12|(r&63)<<6|o&63)}}return e.join("")},Hn={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let i=0;i<n.length;i+=3){const r=n[i],o=i+1<n.length,a=o?n[i+1]:0,l=i+2<n.length,c=l?n[i+2]:0,d=r>>2,u=(r&3)<<4|a>>4;let h=(a&15)<<2|c>>6,f=c&63;l||(f=64,o||(h=64)),s.push(t[d],t[u],t[h],t[f])}return s.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(Ni(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):mo(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let i=0;i<n.length;){const r=t[n.charAt(i++)],a=i<n.length?t[n.charAt(i)]:0;++i;const c=i<n.length?t[n.charAt(i)]:64;++i;const u=i<n.length?t[n.charAt(i)]:64;if(++i,r==null||a==null||c==null||u==null)throw new go;const h=r<<2|a>>4;if(s.push(h),c!==64){const f=a<<4&240|c>>2;if(s.push(f),u!==64){const g=c<<6&192|u;s.push(g)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class go extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Di=function(n){const e=Ni(n);return Hn.encodeByteArray(e,!0)},At=function(n){return Di(n).replace(/\./g,"")},vn=function(n){try{return Hn.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _o(n){return ki(void 0,n)}function ki(n,e){if(!(e instanceof Object))return e;switch(e.constructor){case Date:const t=e;return new Date(t.getTime());case Object:n===void 0&&(n={});break;case Array:n=[];break;default:return e}for(const t in e)!e.hasOwnProperty(t)||!yo(t)||(n[t]=ki(n[t],e[t]));return n}function yo(n){return n!=="__proto__"}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vo(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bo=()=>vo().__FIREBASE_DEFAULTS__,wo=()=>{if(typeof process>"u"||typeof Ds>"u")return;const n=Ds.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},xo=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&vn(n[1]);return e&&JSON.parse(e)},Pi=()=>{try{return bo()||wo()||xo()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Eo=n=>{var e,t;return(t=(e=Pi())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[n]},Co=n=>{const e=Eo(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const s=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),s]:[e.substring(0,t),s]},Mi=()=>{var n;return(n=Pi())===null||n===void 0?void 0:n.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dt{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,s)=>{t?this.reject(t):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,s))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Io(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},s=e||"demo-project",i=n.iat||0,r=n.sub||n.user_id;if(!r)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${s}`,aud:s,iat:i,exp:i+3600,auth_time:i,sub:r,user_id:r,firebase:{sign_in_provider:"custom",identities:{}}},n);return[At(JSON.stringify(t)),At(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function So(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Li(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(So())}function To(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Ro(){return Ai.NODE_ADMIN===!0}function Ao(){try{return typeof indexedDB=="object"}catch{return!1}}function No(){return new Promise((n,e)=>{try{let t=!0;const s="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(s);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(s),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var r;e(((r=i.error)===null||r===void 0?void 0:r.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Do="FirebaseError";class ut extends Error{constructor(e,t,s){super(t),this.code=e,this.customData=s,this.name=Do,Object.setPrototypeOf(this,ut.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Oi.prototype.create)}}class Oi{constructor(e,t,s){this.service=e,this.serviceName=t,this.errors=s}create(e,...t){const s=t[0]||{},i=`${this.service}/${e}`,r=this.errors[e],o=r?ko(r,s):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new ut(i,a,s)}}function ko(n,e){return n.replace(Po,(t,s)=>{const i=e[s];return i!=null?String(i):`<${s}?>`})}const Po=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke(n){return JSON.parse(n)}function L(n){return JSON.stringify(n)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fi=function(n){let e={},t={},s={},i="";try{const r=n.split(".");e=Ke(vn(r[0])||""),t=Ke(vn(r[1])||""),i=r[2],s=t.d||{},delete t.d}catch{}return{header:e,claims:t,data:s,signature:i}},Mo=function(n){const e=Fi(n),t=e.claims;return!!t&&typeof t=="object"&&t.hasOwnProperty("iat")},Lo=function(n){const e=Fi(n).claims;return typeof e=="object"&&e.admin===!0};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function J(n,e){return Object.prototype.hasOwnProperty.call(n,e)}function Ne(n,e){if(Object.prototype.hasOwnProperty.call(n,e))return n[e]}function ks(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Nt(n,e,t){const s={};for(const i in n)Object.prototype.hasOwnProperty.call(n,i)&&(s[i]=e.call(t,n[i],i,n));return s}function bn(n,e){if(n===e)return!0;const t=Object.keys(n),s=Object.keys(e);for(const i of t){if(!s.includes(i))return!1;const r=n[i],o=e[i];if(Ps(r)&&Ps(o)){if(!bn(r,o))return!1}else if(r!==o)return!1}for(const i of s)if(!t.includes(i))return!1;return!0}function Ps(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oo(n){const e=[];for(const[t,s]of Object.entries(n))Array.isArray(s)?s.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=512/8,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){t||(t=0);const s=this.W_;if(typeof e=="string")for(let u=0;u<16;u++)s[u]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let u=0;u<16;u++)s[u]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let u=16;u<80;u++){const h=s[u-3]^s[u-8]^s[u-14]^s[u-16];s[u]=(h<<1|h>>>31)&4294967295}let i=this.chain_[0],r=this.chain_[1],o=this.chain_[2],a=this.chain_[3],l=this.chain_[4],c,d;for(let u=0;u<80;u++){u<40?u<20?(c=a^r&(o^a),d=1518500249):(c=r^o^a,d=1859775393):u<60?(c=r&o|a&(r|o),d=2400959708):(c=r^o^a,d=3395469782);const h=(i<<5|i>>>27)+c+l+d+s[u]&4294967295;l=a,a=o,o=(r<<30|r>>>2)&4294967295,r=i,i=h}this.chain_[0]=this.chain_[0]+i&4294967295,this.chain_[1]=this.chain_[1]+r&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+a&4294967295,this.chain_[4]=this.chain_[4]+l&4294967295}update(e,t){if(e==null)return;t===void 0&&(t=e.length);const s=t-this.blockSize;let i=0;const r=this.buf_;let o=this.inbuf_;for(;i<t;){if(o===0)for(;i<=s;)this.compress_(e,i),i+=this.blockSize;if(typeof e=="string"){for(;i<t;)if(r[o]=e.charCodeAt(i),++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}else for(;i<t;)if(r[o]=e[i],++o,++i,o===this.blockSize){this.compress_(r),o=0;break}}this.inbuf_=o,this.total_+=t}digest(){const e=[];let t=this.total_*8;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let i=this.blockSize-1;i>=56;i--)this.buf_[i]=t&255,t/=256;this.compress_(this.buf_);let s=0;for(let i=0;i<5;i++)for(let r=24;r>=0;r-=8)e[s]=this.chain_[i]>>r&255,++s;return e}}function qt(n,e){return`${n} failed: ${e} argument `}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $o=function(n){const e=[];let t=0;for(let s=0;s<n.length;s++){let i=n.charCodeAt(s);if(i>=55296&&i<=56319){const r=i-55296;s++,m(s<n.length,"Surrogate pair missing trail surrogate.");const o=n.charCodeAt(s)-56320;i=65536+(r<<10)+o}i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):i<65536?(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Qt=function(n){let e=0;for(let t=0;t<n.length;t++){const s=n.charCodeAt(t);s<128?e++:s<2048?e+=2:s>=55296&&s<=56319?(e+=4,t++):e+=3}return e};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ee(n){return n&&n._delegate?n._delegate:n}class Xe{constructor(e,t,s){this.name=e,this.instanceFactory=t,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ge="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const s=new dt;if(this.instancesDeferred.set(t,s),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&s.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),i=(t=e==null?void 0:e.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(r){if(i)return null;throw r}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Wo(e))try{this.getOrInitializeService({instanceIdentifier:ge})}catch{}for(const[t,s]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const r=this.getOrInitializeService({instanceIdentifier:i});s.resolve(r)}catch{}}}}clearInstance(e=ge){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=ge){return this.instances.has(e)}getOptions(e=ge){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:s,options:t});for(const[r,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(r);s===a&&o.resolve(i)}return i}onInit(e,t){var s;const i=this.normalizeInstanceIdentifier(t),r=(s=this.onInitCallbacks.get(i))!==null&&s!==void 0?s:new Set;r.add(e),this.onInitCallbacks.set(i,r);const o=this.instances.get(i);return o&&e(o,i),()=>{r.delete(e)}}invokeOnInitCallbacks(e,t){const s=this.onInitCallbacks.get(t);if(s)for(const i of s)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Uo(e),options:t}),this.instances.set(e,s),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=ge){return this.component?this.component.multipleInstances?e:ge:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Uo(n){return n===ge?void 0:n}function Wo(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Bo(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var N;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(N||(N={}));const jo={debug:N.DEBUG,verbose:N.VERBOSE,info:N.INFO,warn:N.WARN,error:N.ERROR,silent:N.SILENT},Vo=N.INFO,zo={[N.DEBUG]:"log",[N.VERBOSE]:"log",[N.INFO]:"info",[N.WARN]:"warn",[N.ERROR]:"error"},Go=(n,e,...t)=>{if(e<n.logLevel)return;const s=new Date().toISOString(),i=zo[e];if(i)console[i](`[${s}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class $i{constructor(e){this.name=e,this._logLevel=Vo,this._logHandler=Go,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in N))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?jo[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,N.DEBUG,...e),this._logHandler(this,N.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,N.VERBOSE,...e),this._logHandler(this,N.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,N.INFO,...e),this._logHandler(this,N.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,N.WARN,...e),this._logHandler(this,N.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,N.ERROR,...e),this._logHandler(this,N.ERROR,...e)}}const qo=(n,e)=>e.some(t=>n instanceof t);let Ms,Ls;function Qo(){return Ms||(Ms=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yo(){return Ls||(Ls=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Bi=new WeakMap,wn=new WeakMap,Ui=new WeakMap,an=new WeakMap,jn=new WeakMap;function Ko(n){const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("success",r),n.removeEventListener("error",o)},r=()=>{t(le(n.result)),i()},o=()=>{s(n.error),i()};n.addEventListener("success",r),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Bi.set(t,n)}).catch(()=>{}),jn.set(e,n),e}function Xo(n){if(wn.has(n))return;const e=new Promise((t,s)=>{const i=()=>{n.removeEventListener("complete",r),n.removeEventListener("error",o),n.removeEventListener("abort",o)},r=()=>{t(),i()},o=()=>{s(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",r),n.addEventListener("error",o),n.addEventListener("abort",o)});wn.set(n,e)}let xn={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return wn.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ui.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return le(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Jo(n){xn=n(xn)}function Zo(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const s=n.call(ln(this),e,...t);return Ui.set(s,e.sort?e.sort():[e]),le(s)}:Yo().includes(n)?function(...e){return n.apply(ln(this),e),le(Bi.get(this))}:function(...e){return le(n.apply(ln(this),e))}}function ea(n){return typeof n=="function"?Zo(n):(n instanceof IDBTransaction&&Xo(n),qo(n,Qo())?new Proxy(n,xn):n)}function le(n){if(n instanceof IDBRequest)return Ko(n);if(an.has(n))return an.get(n);const e=ea(n);return e!==n&&(an.set(n,e),jn.set(e,n)),e}const ln=n=>jn.get(n);function ta(n,e,{blocked:t,upgrade:s,blocking:i,terminated:r}={}){const o=indexedDB.open(n,e),a=le(o);return s&&o.addEventListener("upgradeneeded",l=>{s(le(o.result),l.oldVersion,l.newVersion,le(o.transaction),l)}),t&&o.addEventListener("blocked",l=>t(l.oldVersion,l.newVersion,l)),a.then(l=>{r&&l.addEventListener("close",()=>r()),i&&l.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}const na=["get","getKey","getAll","getAllKeys","count"],sa=["put","add","delete","clear"],cn=new Map;function Os(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(cn.get(e))return cn.get(e);const t=e.replace(/FromIndex$/,""),s=e!==t,i=sa.includes(t);if(!(t in(s?IDBIndex:IDBObjectStore).prototype)||!(i||na.includes(t)))return;const r=async function(o,...a){const l=this.transaction(o,i?"readwrite":"readonly");let c=l.store;return s&&(c=c.index(a.shift())),(await Promise.all([c[t](...a),i&&l.done]))[0]};return cn.set(e,r),r}Jo(n=>({...n,get:(e,t,s)=>Os(e,t)||n.get(e,t,s),has:(e,t)=>!!Os(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ra(t)){const s=t.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(t=>t).join(" ")}}function ra(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const En="@firebase/app",Fs="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ne=new $i("@firebase/app"),oa="@firebase/app-compat",aa="@firebase/analytics-compat",la="@firebase/analytics",ca="@firebase/app-check-compat",da="@firebase/app-check",ua="@firebase/auth",ha="@firebase/auth-compat",fa="@firebase/database",pa="@firebase/data-connect",ma="@firebase/database-compat",ga="@firebase/functions",_a="@firebase/functions-compat",ya="@firebase/installations",va="@firebase/installations-compat",ba="@firebase/messaging",wa="@firebase/messaging-compat",xa="@firebase/performance",Ea="@firebase/performance-compat",Ca="@firebase/remote-config",Ia="@firebase/remote-config-compat",Sa="@firebase/storage",Ta="@firebase/storage-compat",Ra="@firebase/firestore",Aa="@firebase/vertexai-preview",Na="@firebase/firestore-compat",Da="firebase",ka="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn="[DEFAULT]",Pa={[En]:"fire-core",[oa]:"fire-core-compat",[la]:"fire-analytics",[aa]:"fire-analytics-compat",[da]:"fire-app-check",[ca]:"fire-app-check-compat",[ua]:"fire-auth",[ha]:"fire-auth-compat",[fa]:"fire-rtdb",[pa]:"fire-data-connect",[ma]:"fire-rtdb-compat",[ga]:"fire-fn",[_a]:"fire-fn-compat",[ya]:"fire-iid",[va]:"fire-iid-compat",[ba]:"fire-fcm",[wa]:"fire-fcm-compat",[xa]:"fire-perf",[Ea]:"fire-perf-compat",[Ca]:"fire-rc",[Ia]:"fire-rc-compat",[Sa]:"fire-gcs",[Ta]:"fire-gcs-compat",[Ra]:"fire-fst",[Na]:"fire-fst-compat",[Aa]:"fire-vertex","fire-js":"fire-js",[Da]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Je=new Map,Ma=new Map,In=new Map;function $s(n,e){try{n.container.addComponent(e)}catch(t){ne.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Dt(n){const e=n.name;if(In.has(e))return ne.debug(`There were multiple attempts to register component ${e}.`),!1;In.set(e,n);for(const t of Je.values())$s(t,n);for(const t of Ma.values())$s(t,n);return!0}function La(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ce=new Oi("app","Firebase",Oa);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fa{constructor(e,t,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new Xe("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ce.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a=ka;function Wi(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const s=Object.assign({name:Cn,automaticDataCollectionEnabled:!1},e),i=s.name;if(typeof i!="string"||!i)throw ce.create("bad-app-name",{appName:String(i)});if(t||(t=Mi()),!t)throw ce.create("no-options");const r=Je.get(i);if(r){if(bn(t,r.options)&&bn(s,r.config))return r;throw ce.create("duplicate-app",{appName:i})}const o=new Ho(i);for(const l of In.values())o.addComponent(l);const a=new Fa(t,s,o);return Je.set(i,a),a}function Ba(n=Cn){const e=Je.get(n);if(!e&&n===Cn&&Mi())return Wi();if(!e)throw ce.create("no-app",{appName:n});return e}function Ua(){return Array.from(Je.values())}function Re(n,e,t){var s;let i=(s=Pa[n])!==null&&s!==void 0?s:n;t&&(i+=`-${t}`);const r=i.match(/\s|\//),o=e.match(/\s|\//);if(r||o){const a=[`Unable to register library "${i}" with version "${e}":`];r&&a.push(`library name "${i}" contains illegal characters (whitespace or "/")`),r&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),ne.warn(a.join(" "));return}Dt(new Xe(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa="firebase-heartbeat-database",Ha=1,Ze="firebase-heartbeat-store";let dn=null;function Hi(){return dn||(dn=ta(Wa,Ha,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Ze)}catch(t){console.warn(t)}}}}).catch(n=>{throw ce.create("idb-open",{originalErrorMessage:n.message})})),dn}async function ja(n){try{const t=(await Hi()).transaction(Ze),s=await t.objectStore(Ze).get(ji(n));return await t.done,s}catch(e){if(e instanceof ut)ne.warn(e.message);else{const t=ce.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});ne.warn(t.message)}}}async function Bs(n,e){try{const s=(await Hi()).transaction(Ze,"readwrite");await s.objectStore(Ze).put(e,ji(n)),await s.done}catch(t){if(t instanceof ut)ne.warn(t.message);else{const s=ce.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});ne.warn(s.message)}}}function ji(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Va=1024,za=30*24*60*60*1e3;class Ga{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Qa(t),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,t;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Us();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(o=>o.date===r)?void 0:(this._heartbeatsCache.heartbeats.push({date:r,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const a=new Date(o.date).valueOf();return Date.now()-a<=za}),this._storage.overwrite(this._heartbeatsCache))}catch(s){ne.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Us(),{heartbeatsToSend:s,unsentEntries:i}=qa(this._heartbeatsCache.heartbeats),r=At(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),r}catch(t){return ne.warn(t),""}}}function Us(){return new Date().toISOString().substring(0,10)}function qa(n,e=Va){const t=[];let s=n.slice();for(const i of n){const r=t.find(o=>o.agent===i.agent);if(r){if(r.dates.push(i.date),Ws(t)>e){r.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Ws(t)>e){t.pop();break}s=s.slice(1)}return{heartbeatsToSend:t,unsentEntries:s}}class Qa{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ao()?No().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await ja(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Bs(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return Bs(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function Ws(n){return At(JSON.stringify({version:2,heartbeats:n})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ya(n){Dt(new Xe("platform-logger",e=>new ia(e),"PRIVATE")),Dt(new Xe("heartbeat",e=>new Ga(e),"PRIVATE")),Re(En,Fs,n),Re(En,Fs,"esm2017"),Re("fire-js","")}Ya("");var Ka="firebase",Xa="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Re(Ka,Xa,"app");var Hs={};const js="@firebase/database",Vs="1.0.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vi="";function Ja(n){Vi=n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(e){this.domStorage_=e,this.prefix_="firebase:"}set(e,t){t==null?this.domStorage_.removeItem(this.prefixedName_(e)):this.domStorage_.setItem(this.prefixedName_(e),L(t))}get(e){const t=this.domStorage_.getItem(this.prefixedName_(e));return t==null?null:Ke(t)}remove(e){this.domStorage_.removeItem(this.prefixedName_(e))}prefixedName_(e){return this.prefix_+e}toString(){return this.domStorage_.toString()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(){this.cache_={},this.isInMemoryStorage=!0}set(e,t){t==null?delete this.cache_[e]:this.cache_[e]=t}get(e){return J(this.cache_,e)?this.cache_[e]:null}remove(e){delete this.cache_[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi=function(n){try{if(typeof window<"u"&&typeof window[n]<"u"){const e=window[n];return e.setItem("firebase:sentinel","cache"),e.removeItem("firebase:sentinel"),new Za(e)}}catch{}return new el},ye=zi("localStorage"),tl=zi("sessionStorage");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ae=new $i("@firebase/database"),nl=function(){let n=1;return function(){return n++}}(),Gi=function(n){const e=$o(n),t=new Fo;t.update(e);const s=t.digest();return Hn.encodeByteArray(s)},ht=function(...n){let e="";for(let t=0;t<n.length;t++){const s=n[t];Array.isArray(s)||s&&typeof s=="object"&&typeof s.length=="number"?e+=ht.apply(null,s):typeof s=="object"?e+=L(s):e+=s,e+=" "}return e};let ze=null,zs=!0;const sl=function(n,e){m(!0,"Can't turn on custom loggers persistently."),Ae.logLevel=N.VERBOSE,ze=Ae.log.bind(Ae)},$=function(...n){if(zs===!0&&(zs=!1,ze===null&&tl.get("logging_enabled")===!0&&sl()),ze){const e=ht.apply(null,n);ze(e)}},ft=function(n){return function(...e){$(n,...e)}},Sn=function(...n){const e="FIREBASE INTERNAL ERROR: "+ht(...n);Ae.error(e)},se=function(...n){const e=`FIREBASE FATAL ERROR: ${ht(...n)}`;throw Ae.error(e),new Error(e)},j=function(...n){const e="FIREBASE WARNING: "+ht(...n);Ae.warn(e)},il=function(){typeof window<"u"&&window.location&&window.location.protocol&&window.location.protocol.indexOf("https:")!==-1&&j("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().")},Vn=function(n){return typeof n=="number"&&(n!==n||n===Number.POSITIVE_INFINITY||n===Number.NEGATIVE_INFINITY)},rl=function(n){if(document.readyState==="complete")n();else{let e=!1;const t=function(){if(!document.body){setTimeout(t,Math.floor(10));return}e||(e=!0,n())};document.addEventListener?(document.addEventListener("DOMContentLoaded",t,!1),window.addEventListener("load",t,!1)):document.attachEvent&&(document.attachEvent("onreadystatechange",()=>{document.readyState==="complete"&&t()}),window.attachEvent("onload",t))}},be="[MIN_NAME]",he="[MAX_NAME]",Ce=function(n,e){if(n===e)return 0;if(n===be||e===he)return-1;if(e===be||n===he)return 1;{const t=Gs(n),s=Gs(e);return t!==null?s!==null?t-s===0?n.length-e.length:t-s:-1:s!==null?1:n<e?-1:1}},ol=function(n,e){return n===e?0:n<e?-1:1},We=function(n,e){if(e&&n in e)return e[n];throw new Error("Missing required key ("+n+") in object: "+L(e))},zn=function(n){if(typeof n!="object"||n===null)return L(n);const e=[];for(const s in n)e.push(s);e.sort();let t="{";for(let s=0;s<e.length;s++)s!==0&&(t+=","),t+=L(e[s]),t+=":",t+=zn(n[e[s]]);return t+="}",t},qi=function(n,e){const t=n.length;if(t<=e)return[n];const s=[];for(let i=0;i<t;i+=e)i+e>t?s.push(n.substring(i,t)):s.push(n.substring(i,i+e));return s};function B(n,e){for(const t in n)n.hasOwnProperty(t)&&e(t,n[t])}const Qi=function(n){m(!Vn(n),"Invalid JSON number");const e=11,t=52,s=(1<<e-1)-1;let i,r,o,a,l;n===0?(r=0,o=0,i=1/n===-1/0?1:0):(i=n<0,n=Math.abs(n),n>=Math.pow(2,1-s)?(a=Math.min(Math.floor(Math.log(n)/Math.LN2),s),r=a+s,o=Math.round(n*Math.pow(2,t-a)-Math.pow(2,t))):(r=0,o=Math.round(n/Math.pow(2,1-s-t))));const c=[];for(l=t;l;l-=1)c.push(o%2?1:0),o=Math.floor(o/2);for(l=e;l;l-=1)c.push(r%2?1:0),r=Math.floor(r/2);c.push(i?1:0),c.reverse();const d=c.join("");let u="";for(l=0;l<64;l+=8){let h=parseInt(d.substr(l,8),2).toString(16);h.length===1&&(h="0"+h),u=u+h}return u.toLowerCase()},al=function(){return!!(typeof window=="object"&&window.chrome&&window.chrome.extension&&!/^chrome/.test(window.location.href))},ll=function(){return typeof Windows=="object"&&typeof Windows.UI=="object"};function cl(n,e){let t="Unknown Error";n==="too_big"?t="The data requested exceeds the maximum size that can be accessed with a single request.":n==="permission_denied"?t="Client doesn't have permission to access the desired data.":n==="unavailable"&&(t="The service is unavailable");const s=new Error(n+" at "+e._path.toString()+": "+t);return s.code=n.toUpperCase(),s}const dl=new RegExp("^-?(0*)\\d{1,10}$"),ul=-2147483648,hl=2147483647,Gs=function(n){if(dl.test(n)){const e=Number(n);if(e>=ul&&e<=hl)return e}return null},Oe=function(n){try{n()}catch(e){setTimeout(()=>{const t=e.stack||"";throw j("Exception was thrown by user callback.",t),e},Math.floor(0))}},fl=function(){return(typeof window=="object"&&window.navigator&&window.navigator.userAgent||"").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)>=0},Ge=function(n,e){const t=setTimeout(n,e);return typeof t=="number"&&typeof Deno<"u"&&Deno.unrefTimer?Deno.unrefTimer(t):typeof t=="object"&&t.unref&&t.unref(),t};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e,t){this.appName_=e,this.appCheckProvider=t,this.appCheck=t==null?void 0:t.getImmediate({optional:!0}),this.appCheck||t==null||t.get().then(s=>this.appCheck=s)}getToken(e){return this.appCheck?this.appCheck.getToken(e):new Promise((t,s)=>{setTimeout(()=>{this.appCheck?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){var t;(t=this.appCheckProvider)===null||t===void 0||t.get().then(s=>s.addTokenListener(e))}notifyForInvalidToken(){j(`Provided AppCheck credentials for the app named "${this.appName_}" are invalid. This usually indicates your app was not initialized correctly.`)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ml{constructor(e,t,s){this.appName_=e,this.firebaseOptions_=t,this.authProvider_=s,this.auth_=null,this.auth_=s.getImmediate({optional:!0}),this.auth_||s.onInit(i=>this.auth_=i)}getToken(e){return this.auth_?this.auth_.getToken(e).catch(t=>t&&t.code==="auth/token-not-initialized"?($("Got auth/token-not-initialized error.  Treating as null token."),null):Promise.reject(t)):new Promise((t,s)=>{setTimeout(()=>{this.auth_?this.getToken(e).then(t,s):t(null)},0)})}addTokenChangeListener(e){this.auth_?this.auth_.addAuthTokenListener(e):this.authProvider_.get().then(t=>t.addAuthTokenListener(e))}removeTokenChangeListener(e){this.authProvider_.get().then(t=>t.removeAuthTokenListener(e))}notifyForInvalidToken(){let e='Provided authentication credentials for the app named "'+this.appName_+'" are invalid. This usually indicates your app was not initialized correctly. ';"credential"in this.firebaseOptions_?e+='Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':"serviceAccount"in this.firebaseOptions_?e+='Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.':e+='Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.',j(e)}}class Tt{constructor(e){this.accessToken=e}getToken(e){return Promise.resolve({accessToken:this.accessToken})}addTokenChangeListener(e){e(this.accessToken)}removeTokenChangeListener(e){}notifyForInvalidToken(){}}Tt.OWNER="owner";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gn="5",Yi="v",Ki="s",Xi="r",Ji="f",Zi=/(console\.firebase|firebase-console-\w+\.corp|firebase\.corp)\.google\.com/,er="ls",tr="p",Tn="ac",nr="websocket",sr="long_polling";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,t,s,i,r=!1,o="",a=!1,l=!1){this.secure=t,this.namespace=s,this.webSocketOnly=i,this.nodeAdmin=r,this.persistenceKey=o,this.includeNamespaceInQueryParams=a,this.isUsingEmulator=l,this._host=e.toLowerCase(),this._domain=this._host.substr(this._host.indexOf(".")+1),this.internalHost=ye.get("host:"+e)||this._host}isCacheableHost(){return this.internalHost.substr(0,2)==="s-"}isCustomHost(){return this._domain!=="firebaseio.com"&&this._domain!=="firebaseio-demo.com"}get host(){return this._host}set host(e){e!==this.internalHost&&(this.internalHost=e,this.isCacheableHost()&&ye.set("host:"+this._host,this.internalHost))}toString(){let e=this.toURLString();return this.persistenceKey&&(e+="<"+this.persistenceKey+">"),e}toURLString(){const e=this.secure?"https://":"http://",t=this.includeNamespaceInQueryParams?`?ns=${this.namespace}`:"";return`${e}${this.host}/${t}`}}function gl(n){return n.host!==n.internalHost||n.isCustomHost()||n.includeNamespaceInQueryParams}function rr(n,e,t){m(typeof e=="string","typeof type must == string"),m(typeof t=="object","typeof params must == object");let s;if(e===nr)s=(n.secure?"wss://":"ws://")+n.internalHost+"/.ws?";else if(e===sr)s=(n.secure?"https://":"http://")+n.internalHost+"/.lp?";else throw new Error("Unknown connection type: "+e);gl(n)&&(t.ns=n.namespace);const i=[];return B(t,(r,o)=>{i.push(r+"="+o)}),s+i.join("&")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _l{constructor(){this.counters_={}}incrementCounter(e,t=1){J(this.counters_,e)||(this.counters_[e]=0),this.counters_[e]+=t}get(){return _o(this.counters_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const un={},hn={};function qn(n){const e=n.toString();return un[e]||(un[e]=new _l),un[e]}function yl(n,e){const t=n.toString();return hn[t]||(hn[t]=e()),hn[t]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vl{constructor(e){this.onMessage_=e,this.pendingResponses=[],this.currentResponseNum=0,this.closeAfterResponse=-1,this.onClose=null}closeAfter(e,t){this.closeAfterResponse=e,this.onClose=t,this.closeAfterResponse<this.currentResponseNum&&(this.onClose(),this.onClose=null)}handleResponse(e,t){for(this.pendingResponses[e]=t;this.pendingResponses[this.currentResponseNum];){const s=this.pendingResponses[this.currentResponseNum];delete this.pendingResponses[this.currentResponseNum];for(let i=0;i<s.length;++i)s[i]&&Oe(()=>{this.onMessage_(s[i])});if(this.currentResponseNum===this.closeAfterResponse){this.onClose&&(this.onClose(),this.onClose=null);break}this.currentResponseNum++}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qs="start",bl="close",wl="pLPCommand",xl="pRTLPCB",or="id",ar="pw",lr="ser",El="cb",Cl="seg",Il="ts",Sl="d",Tl="dframe",cr=1870,dr=30,Rl=cr-dr,Al=25e3,Nl=3e4;class Te{constructor(e,t,s,i,r,o,a){this.connId=e,this.repoInfo=t,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.transportSessionId=o,this.lastSessionId=a,this.bytesSent=0,this.bytesReceived=0,this.everConnected_=!1,this.log_=ft(e),this.stats_=qn(t),this.urlFn=l=>(this.appCheckToken&&(l[Tn]=this.appCheckToken),rr(t,sr,l))}open(e,t){this.curSegmentNum=0,this.onDisconnect_=t,this.myPacketOrderer=new vl(e),this.isClosed_=!1,this.connectTimeoutTimer_=setTimeout(()=>{this.log_("Timed out trying to connect."),this.onClosed_(),this.connectTimeoutTimer_=null},Math.floor(Nl)),rl(()=>{if(this.isClosed_)return;this.scriptTagHolder=new Qn((...r)=>{const[o,a,l,c,d]=r;if(this.incrementIncomingBytes_(r),!!this.scriptTagHolder)if(this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null),this.everConnected_=!0,o===qs)this.id=a,this.password=l;else if(o===bl)a?(this.scriptTagHolder.sendNewPolls=!1,this.myPacketOrderer.closeAfter(a,()=>{this.onClosed_()})):this.onClosed_();else throw new Error("Unrecognized command received: "+o)},(...r)=>{const[o,a]=r;this.incrementIncomingBytes_(r),this.myPacketOrderer.handleResponse(o,a)},()=>{this.onClosed_()},this.urlFn);const s={};s[qs]="t",s[lr]=Math.floor(Math.random()*1e8),this.scriptTagHolder.uniqueCallbackIdentifier&&(s[El]=this.scriptTagHolder.uniqueCallbackIdentifier),s[Yi]=Gn,this.transportSessionId&&(s[Ki]=this.transportSessionId),this.lastSessionId&&(s[er]=this.lastSessionId),this.applicationId&&(s[tr]=this.applicationId),this.appCheckToken&&(s[Tn]=this.appCheckToken),typeof location<"u"&&location.hostname&&Zi.test(location.hostname)&&(s[Xi]=Ji);const i=this.urlFn(s);this.log_("Connecting via long-poll to "+i),this.scriptTagHolder.addTag(i,()=>{})})}start(){this.scriptTagHolder.startLongPoll(this.id,this.password),this.addDisconnectPingFrame(this.id,this.password)}static forceAllow(){Te.forceAllow_=!0}static forceDisallow(){Te.forceDisallow_=!0}static isAvailable(){return Te.forceAllow_?!0:!Te.forceDisallow_&&typeof document<"u"&&document.createElement!=null&&!al()&&!ll()}markConnectionHealthy(){}shutdown_(){this.isClosed_=!0,this.scriptTagHolder&&(this.scriptTagHolder.close(),this.scriptTagHolder=null),this.myDisconnFrame&&(document.body.removeChild(this.myDisconnFrame),this.myDisconnFrame=null),this.connectTimeoutTimer_&&(clearTimeout(this.connectTimeoutTimer_),this.connectTimeoutTimer_=null)}onClosed_(){this.isClosed_||(this.log_("Longpoll is closing itself"),this.shutdown_(),this.onDisconnect_&&(this.onDisconnect_(this.everConnected_),this.onDisconnect_=null))}close(){this.isClosed_||(this.log_("Longpoll is being closed."),this.shutdown_())}send(e){const t=L(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=Di(t),i=qi(s,Rl);for(let r=0;r<i.length;r++)this.scriptTagHolder.enqueueSegment(this.curSegmentNum,i.length,i[r]),this.curSegmentNum++}addDisconnectPingFrame(e,t){this.myDisconnFrame=document.createElement("iframe");const s={};s[Tl]="t",s[or]=e,s[ar]=t,this.myDisconnFrame.src=this.urlFn(s),this.myDisconnFrame.style.display="none",document.body.appendChild(this.myDisconnFrame)}incrementIncomingBytes_(e){const t=L(e).length;this.bytesReceived+=t,this.stats_.incrementCounter("bytes_received",t)}}class Qn{constructor(e,t,s,i){this.onDisconnect=s,this.urlFn=i,this.outstandingRequests=new Set,this.pendingSegs=[],this.currentSerial=Math.floor(Math.random()*1e8),this.sendNewPolls=!0;{this.uniqueCallbackIdentifier=nl(),window[wl+this.uniqueCallbackIdentifier]=e,window[xl+this.uniqueCallbackIdentifier]=t,this.myIFrame=Qn.createIFrame_();let r="";this.myIFrame.src&&this.myIFrame.src.substr(0,11)==="javascript:"&&(r='<script>document.domain="'+document.domain+'";<\/script>');const o="<html><body>"+r+"</body></html>";try{this.myIFrame.doc.open(),this.myIFrame.doc.write(o),this.myIFrame.doc.close()}catch(a){$("frame writing exception"),a.stack&&$(a.stack),$(a)}}}static createIFrame_(){const e=document.createElement("iframe");if(e.style.display="none",document.body){document.body.appendChild(e);try{e.contentWindow.document||$("No IE domain setting required")}catch{const s=document.domain;e.src="javascript:void((function(){document.open();document.domain='"+s+"';document.close();})())"}}else throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";return e.contentDocument?e.doc=e.contentDocument:e.contentWindow?e.doc=e.contentWindow.document:e.document&&(e.doc=e.document),e}close(){this.alive=!1,this.myIFrame&&(this.myIFrame.doc.body.textContent="",setTimeout(()=>{this.myIFrame!==null&&(document.body.removeChild(this.myIFrame),this.myIFrame=null)},Math.floor(0)));const e=this.onDisconnect;e&&(this.onDisconnect=null,e())}startLongPoll(e,t){for(this.myID=e,this.myPW=t,this.alive=!0;this.newRequest_(););}newRequest_(){if(this.alive&&this.sendNewPolls&&this.outstandingRequests.size<(this.pendingSegs.length>0?2:1)){this.currentSerial++;const e={};e[or]=this.myID,e[ar]=this.myPW,e[lr]=this.currentSerial;let t=this.urlFn(e),s="",i=0;for(;this.pendingSegs.length>0&&this.pendingSegs[0].d.length+dr+s.length<=cr;){const o=this.pendingSegs.shift();s=s+"&"+Cl+i+"="+o.seg+"&"+Il+i+"="+o.ts+"&"+Sl+i+"="+o.d,i++}return t=t+s,this.addLongPollTag_(t,this.currentSerial),!0}else return!1}enqueueSegment(e,t,s){this.pendingSegs.push({seg:e,ts:t,d:s}),this.alive&&this.newRequest_()}addLongPollTag_(e,t){this.outstandingRequests.add(t);const s=()=>{this.outstandingRequests.delete(t),this.newRequest_()},i=setTimeout(s,Math.floor(Al)),r=()=>{clearTimeout(i),s()};this.addTag(e,r)}addTag(e,t){setTimeout(()=>{try{if(!this.sendNewPolls)return;const s=this.myIFrame.doc.createElement("script");s.type="text/javascript",s.async=!0,s.src=e,s.onload=s.onreadystatechange=function(){const i=s.readyState;(!i||i==="loaded"||i==="complete")&&(s.onload=s.onreadystatechange=null,s.parentNode&&s.parentNode.removeChild(s),t())},s.onerror=()=>{$("Long-poll script failed to load: "+e),this.sendNewPolls=!1,this.close()},this.myIFrame.doc.body.appendChild(s)}catch{}},Math.floor(1))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dl=16384,kl=45e3;let kt=null;typeof MozWebSocket<"u"?kt=MozWebSocket:typeof WebSocket<"u"&&(kt=WebSocket);class Q{constructor(e,t,s,i,r,o,a){this.connId=e,this.applicationId=s,this.appCheckToken=i,this.authToken=r,this.keepaliveTimer=null,this.frames=null,this.totalFrames=0,this.bytesSent=0,this.bytesReceived=0,this.log_=ft(this.connId),this.stats_=qn(t),this.connURL=Q.connectionURL_(t,o,a,i,s),this.nodeAdmin=t.nodeAdmin}static connectionURL_(e,t,s,i,r){const o={};return o[Yi]=Gn,typeof location<"u"&&location.hostname&&Zi.test(location.hostname)&&(o[Xi]=Ji),t&&(o[Ki]=t),s&&(o[er]=s),i&&(o[Tn]=i),r&&(o[tr]=r),rr(e,nr,o)}open(e,t){this.onDisconnect=t,this.onMessage=e,this.log_("Websocket connecting to "+this.connURL),this.everConnected_=!1,ye.set("previous_websocket_failure",!0);try{let s;Ro(),this.mySock=new kt(this.connURL,[],s)}catch(s){this.log_("Error instantiating WebSocket.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_();return}this.mySock.onopen=()=>{this.log_("Websocket connected."),this.everConnected_=!0},this.mySock.onclose=()=>{this.log_("Websocket connection was disconnected."),this.mySock=null,this.onClosed_()},this.mySock.onmessage=s=>{this.handleIncomingFrame(s)},this.mySock.onerror=s=>{this.log_("WebSocket error.  Closing connection.");const i=s.message||s.data;i&&this.log_(i),this.onClosed_()}}start(){}static forceDisallow(){Q.forceDisallow_=!0}static isAvailable(){let e=!1;if(typeof navigator<"u"&&navigator.userAgent){const t=/Android ([0-9]{0,}\.[0-9]{0,})/,s=navigator.userAgent.match(t);s&&s.length>1&&parseFloat(s[1])<4.4&&(e=!0)}return!e&&kt!==null&&!Q.forceDisallow_}static previouslyFailed(){return ye.isInMemoryStorage||ye.get("previous_websocket_failure")===!0}markConnectionHealthy(){ye.remove("previous_websocket_failure")}appendFrame_(e){if(this.frames.push(e),this.frames.length===this.totalFrames){const t=this.frames.join("");this.frames=null;const s=Ke(t);this.onMessage(s)}}handleNewFrameCount_(e){this.totalFrames=e,this.frames=[]}extractFrameCount_(e){if(m(this.frames===null,"We already have a frame buffer"),e.length<=6){const t=Number(e);if(!isNaN(t))return this.handleNewFrameCount_(t),null}return this.handleNewFrameCount_(1),e}handleIncomingFrame(e){if(this.mySock===null)return;const t=e.data;if(this.bytesReceived+=t.length,this.stats_.incrementCounter("bytes_received",t.length),this.resetKeepAlive(),this.frames!==null)this.appendFrame_(t);else{const s=this.extractFrameCount_(t);s!==null&&this.appendFrame_(s)}}send(e){this.resetKeepAlive();const t=L(e);this.bytesSent+=t.length,this.stats_.incrementCounter("bytes_sent",t.length);const s=qi(t,Dl);s.length>1&&this.sendString_(String(s.length));for(let i=0;i<s.length;i++)this.sendString_(s[i])}shutdown_(){this.isClosed_=!0,this.keepaliveTimer&&(clearInterval(this.keepaliveTimer),this.keepaliveTimer=null),this.mySock&&(this.mySock.close(),this.mySock=null)}onClosed_(){this.isClosed_||(this.log_("WebSocket is closing itself"),this.shutdown_(),this.onDisconnect&&(this.onDisconnect(this.everConnected_),this.onDisconnect=null))}close(){this.isClosed_||(this.log_("WebSocket is being closed"),this.shutdown_())}resetKeepAlive(){clearInterval(this.keepaliveTimer),this.keepaliveTimer=setInterval(()=>{this.mySock&&this.sendString_("0"),this.resetKeepAlive()},Math.floor(kl))}sendString_(e){try{this.mySock.send(e)}catch(t){this.log_("Exception thrown from WebSocket.send():",t.message||t.data,"Closing connection."),setTimeout(this.onClosed_.bind(this),0)}}}Q.responsesRequiredToBeHealthy=2;Q.healthyTimeout=3e4;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.initTransports_(e)}static get ALL_TRANSPORTS(){return[Te,Q]}static get IS_TRANSPORT_INITIALIZED(){return this.globalTransportInitialized_}initTransports_(e){const t=Q&&Q.isAvailable();let s=t&&!Q.previouslyFailed();if(e.webSocketOnly&&(t||j("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."),s=!0),s)this.transports_=[Q];else{const i=this.transports_=[];for(const r of et.ALL_TRANSPORTS)r&&r.isAvailable()&&i.push(r);et.globalTransportInitialized_=!0}}initialTransport(){if(this.transports_.length>0)return this.transports_[0];throw new Error("No transports available")}upgradeTransport(){return this.transports_.length>1?this.transports_[1]:null}}et.globalTransportInitialized_=!1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pl=6e4,Ml=5e3,Ll=10*1024,Ol=100*1024,fn="t",Qs="d",Fl="s",Ys="r",$l="e",Ks="o",Xs="a",Js="n",Zs="p",Bl="h";class Ul{constructor(e,t,s,i,r,o,a,l,c,d){this.id=e,this.repoInfo_=t,this.applicationId_=s,this.appCheckToken_=i,this.authToken_=r,this.onMessage_=o,this.onReady_=a,this.onDisconnect_=l,this.onKill_=c,this.lastSessionId=d,this.connectionCount=0,this.pendingDataMessages=[],this.state_=0,this.log_=ft("c:"+this.id+":"),this.transportManager_=new et(t),this.log_("Connection created"),this.start_()}start_(){const e=this.transportManager_.initialTransport();this.conn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,null,this.lastSessionId),this.primaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.conn_),s=this.disconnReceiver_(this.conn_);this.tx_=this.conn_,this.rx_=this.conn_,this.secondaryConn_=null,this.isHealthy_=!1,setTimeout(()=>{this.conn_&&this.conn_.open(t,s)},Math.floor(0));const i=e.healthyTimeout||0;i>0&&(this.healthyTimeout_=Ge(()=>{this.healthyTimeout_=null,this.isHealthy_||(this.conn_&&this.conn_.bytesReceived>Ol?(this.log_("Connection exceeded healthy timeout but has received "+this.conn_.bytesReceived+" bytes.  Marking connection healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()):this.conn_&&this.conn_.bytesSent>Ll?this.log_("Connection exceeded healthy timeout but has sent "+this.conn_.bytesSent+" bytes.  Leaving connection alive."):(this.log_("Closing unhealthy connection after timeout."),this.close()))},Math.floor(i)))}nextTransportId_(){return"c:"+this.id+":"+this.connectionCount++}disconnReceiver_(e){return t=>{e===this.conn_?this.onConnectionLost_(t):e===this.secondaryConn_?(this.log_("Secondary connection lost."),this.onSecondaryConnectionLost_()):this.log_("closing an old connection")}}connReceiver_(e){return t=>{this.state_!==2&&(e===this.rx_?this.onPrimaryMessageReceived_(t):e===this.secondaryConn_?this.onSecondaryMessageReceived_(t):this.log_("message on old connection"))}}sendRequest(e){const t={t:"d",d:e};this.sendData_(t)}tryCleanupConnection(){this.tx_===this.secondaryConn_&&this.rx_===this.secondaryConn_&&(this.log_("cleaning up and promoting a connection: "+this.secondaryConn_.connId),this.conn_=this.secondaryConn_,this.secondaryConn_=null)}onSecondaryControl_(e){if(fn in e){const t=e[fn];t===Xs?this.upgradeIfSecondaryHealthy_():t===Ys?(this.log_("Got a reset on secondary, closing it"),this.secondaryConn_.close(),(this.tx_===this.secondaryConn_||this.rx_===this.secondaryConn_)&&this.close()):t===Ks&&(this.log_("got pong on secondary."),this.secondaryResponsesRequired_--,this.upgradeIfSecondaryHealthy_())}}onSecondaryMessageReceived_(e){const t=We("t",e),s=We("d",e);if(t==="c")this.onSecondaryControl_(s);else if(t==="d")this.pendingDataMessages.push(s);else throw new Error("Unknown protocol layer: "+t)}upgradeIfSecondaryHealthy_(){this.secondaryResponsesRequired_<=0?(this.log_("Secondary connection is healthy."),this.isHealthy_=!0,this.secondaryConn_.markConnectionHealthy(),this.proceedWithUpgrade_()):(this.log_("sending ping on secondary."),this.secondaryConn_.send({t:"c",d:{t:Zs,d:{}}}))}proceedWithUpgrade_(){this.secondaryConn_.start(),this.log_("sending client ack on secondary"),this.secondaryConn_.send({t:"c",d:{t:Xs,d:{}}}),this.log_("Ending transmission on primary"),this.conn_.send({t:"c",d:{t:Js,d:{}}}),this.tx_=this.secondaryConn_,this.tryCleanupConnection()}onPrimaryMessageReceived_(e){const t=We("t",e),s=We("d",e);t==="c"?this.onControl_(s):t==="d"&&this.onDataMessage_(s)}onDataMessage_(e){this.onPrimaryResponse_(),this.onMessage_(e)}onPrimaryResponse_(){this.isHealthy_||(this.primaryResponsesRequired_--,this.primaryResponsesRequired_<=0&&(this.log_("Primary connection is healthy."),this.isHealthy_=!0,this.conn_.markConnectionHealthy()))}onControl_(e){const t=We(fn,e);if(Qs in e){const s=e[Qs];if(t===Bl){const i=Object.assign({},s);this.repoInfo_.isUsingEmulator&&(i.h=this.repoInfo_.host),this.onHandshake_(i)}else if(t===Js){this.log_("recvd end transmission on primary"),this.rx_=this.secondaryConn_;for(let i=0;i<this.pendingDataMessages.length;++i)this.onDataMessage_(this.pendingDataMessages[i]);this.pendingDataMessages=[],this.tryCleanupConnection()}else t===Fl?this.onConnectionShutdown_(s):t===Ys?this.onReset_(s):t===$l?Sn("Server Error: "+s):t===Ks?(this.log_("got pong on primary."),this.onPrimaryResponse_(),this.sendPingOnPrimaryIfNecessary_()):Sn("Unknown control packet command: "+t)}}onHandshake_(e){const t=e.ts,s=e.v,i=e.h;this.sessionId=e.s,this.repoInfo_.host=i,this.state_===0&&(this.conn_.start(),this.onConnectionEstablished_(this.conn_,t),Gn!==s&&j("Protocol version mismatch detected"),this.tryStartUpgrade_())}tryStartUpgrade_(){const e=this.transportManager_.upgradeTransport();e&&this.startUpgrade_(e)}startUpgrade_(e){this.secondaryConn_=new e(this.nextTransportId_(),this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,this.sessionId),this.secondaryResponsesRequired_=e.responsesRequiredToBeHealthy||0;const t=this.connReceiver_(this.secondaryConn_),s=this.disconnReceiver_(this.secondaryConn_);this.secondaryConn_.open(t,s),Ge(()=>{this.secondaryConn_&&(this.log_("Timed out trying to upgrade."),this.secondaryConn_.close())},Math.floor(Pl))}onReset_(e){this.log_("Reset packet received.  New host: "+e),this.repoInfo_.host=e,this.state_===1?this.close():(this.closeConnections_(),this.start_())}onConnectionEstablished_(e,t){this.log_("Realtime connection established."),this.conn_=e,this.state_=1,this.onReady_&&(this.onReady_(t,this.sessionId),this.onReady_=null),this.primaryResponsesRequired_===0?(this.log_("Primary connection is healthy."),this.isHealthy_=!0):Ge(()=>{this.sendPingOnPrimaryIfNecessary_()},Math.floor(Ml))}sendPingOnPrimaryIfNecessary_(){!this.isHealthy_&&this.state_===1&&(this.log_("sending ping on primary."),this.sendData_({t:"c",d:{t:Zs,d:{}}}))}onSecondaryConnectionLost_(){const e=this.secondaryConn_;this.secondaryConn_=null,(this.tx_===e||this.rx_===e)&&this.close()}onConnectionLost_(e){this.conn_=null,!e&&this.state_===0?(this.log_("Realtime connection failed."),this.repoInfo_.isCacheableHost()&&(ye.remove("host:"+this.repoInfo_.host),this.repoInfo_.internalHost=this.repoInfo_.host)):this.state_===1&&this.log_("Realtime connection lost."),this.close()}onConnectionShutdown_(e){this.log_("Connection shutdown command received. Shutting down..."),this.onKill_&&(this.onKill_(e),this.onKill_=null),this.onDisconnect_=null,this.close()}sendData_(e){if(this.state_!==1)throw"Connection is not connected";this.tx_.send(e)}close(){this.state_!==2&&(this.log_("Closing realtime connection."),this.state_=2,this.closeConnections_(),this.onDisconnect_&&(this.onDisconnect_(),this.onDisconnect_=null))}closeConnections_(){this.log_("Shutting down all connections"),this.conn_&&(this.conn_.close(),this.conn_=null),this.secondaryConn_&&(this.secondaryConn_.close(),this.secondaryConn_=null),this.healthyTimeout_&&(clearTimeout(this.healthyTimeout_),this.healthyTimeout_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{put(e,t,s,i){}merge(e,t,s,i){}refreshAuthToken(e){}refreshAppCheckToken(e){}onDisconnectPut(e,t,s){}onDisconnectMerge(e,t,s){}onDisconnectCancel(e,t){}reportStats(e){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e){this.allowedEvents_=e,this.listeners_={},m(Array.isArray(e)&&e.length>0,"Requires a non-empty array")}trigger(e,...t){if(Array.isArray(this.listeners_[e])){const s=[...this.listeners_[e]];for(let i=0;i<s.length;i++)s[i].callback.apply(s[i].context,t)}}on(e,t,s){this.validateEventType_(e),this.listeners_[e]=this.listeners_[e]||[],this.listeners_[e].push({callback:t,context:s});const i=this.getInitialEvent(e);i&&t.apply(s,i)}off(e,t,s){this.validateEventType_(e);const i=this.listeners_[e]||[];for(let r=0;r<i.length;r++)if(i[r].callback===t&&(!s||s===i[r].context)){i.splice(r,1);return}}validateEventType_(e){m(this.allowedEvents_.find(t=>t===e),"Unknown event: "+e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt extends hr{constructor(){super(["online"]),this.online_=!0,typeof window<"u"&&typeof window.addEventListener<"u"&&!Li()&&(window.addEventListener("online",()=>{this.online_||(this.online_=!0,this.trigger("online",!0))},!1),window.addEventListener("offline",()=>{this.online_&&(this.online_=!1,this.trigger("online",!1))},!1))}static getInstance(){return new Pt}getInitialEvent(e){return m(e==="online","Unknown event type: "+e),[this.online_]}currentlyOnline(){return this.online_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=32,ti=768;class R{constructor(e,t){if(t===void 0){this.pieces_=e.split("/");let s=0;for(let i=0;i<this.pieces_.length;i++)this.pieces_[i].length>0&&(this.pieces_[s]=this.pieces_[i],s++);this.pieces_.length=s,this.pieceNum_=0}else this.pieces_=e,this.pieceNum_=t}toString(){let e="";for(let t=this.pieceNum_;t<this.pieces_.length;t++)this.pieces_[t]!==""&&(e+="/"+this.pieces_[t]);return e||"/"}}function S(){return new R("")}function E(n){return n.pieceNum_>=n.pieces_.length?null:n.pieces_[n.pieceNum_]}function fe(n){return n.pieces_.length-n.pieceNum_}function D(n){let e=n.pieceNum_;return e<n.pieces_.length&&e++,new R(n.pieces_,e)}function Yn(n){return n.pieceNum_<n.pieces_.length?n.pieces_[n.pieces_.length-1]:null}function Wl(n){let e="";for(let t=n.pieceNum_;t<n.pieces_.length;t++)n.pieces_[t]!==""&&(e+="/"+encodeURIComponent(String(n.pieces_[t])));return e||"/"}function tt(n,e=0){return n.pieces_.slice(n.pieceNum_+e)}function fr(n){if(n.pieceNum_>=n.pieces_.length)return null;const e=[];for(let t=n.pieceNum_;t<n.pieces_.length-1;t++)e.push(n.pieces_[t]);return new R(e,0)}function P(n,e){const t=[];for(let s=n.pieceNum_;s<n.pieces_.length;s++)t.push(n.pieces_[s]);if(e instanceof R)for(let s=e.pieceNum_;s<e.pieces_.length;s++)t.push(e.pieces_[s]);else{const s=e.split("/");for(let i=0;i<s.length;i++)s[i].length>0&&t.push(s[i])}return new R(t,0)}function C(n){return n.pieceNum_>=n.pieces_.length}function H(n,e){const t=E(n),s=E(e);if(t===null)return e;if(t===s)return H(D(n),D(e));throw new Error("INTERNAL ERROR: innerPath ("+e+") is not within outerPath ("+n+")")}function Hl(n,e){const t=tt(n,0),s=tt(e,0);for(let i=0;i<t.length&&i<s.length;i++){const r=Ce(t[i],s[i]);if(r!==0)return r}return t.length===s.length?0:t.length<s.length?-1:1}function Kn(n,e){if(fe(n)!==fe(e))return!1;for(let t=n.pieceNum_,s=e.pieceNum_;t<=n.pieces_.length;t++,s++)if(n.pieces_[t]!==e.pieces_[s])return!1;return!0}function G(n,e){let t=n.pieceNum_,s=e.pieceNum_;if(fe(n)>fe(e))return!1;for(;t<n.pieces_.length;){if(n.pieces_[t]!==e.pieces_[s])return!1;++t,++s}return!0}class jl{constructor(e,t){this.errorPrefix_=t,this.parts_=tt(e,0),this.byteLength_=Math.max(1,this.parts_.length);for(let s=0;s<this.parts_.length;s++)this.byteLength_+=Qt(this.parts_[s]);pr(this)}}function Vl(n,e){n.parts_.length>0&&(n.byteLength_+=1),n.parts_.push(e),n.byteLength_+=Qt(e),pr(n)}function zl(n){const e=n.parts_.pop();n.byteLength_-=Qt(e),n.parts_.length>0&&(n.byteLength_-=1)}function pr(n){if(n.byteLength_>ti)throw new Error(n.errorPrefix_+"has a key path longer than "+ti+" bytes ("+n.byteLength_+").");if(n.parts_.length>ei)throw new Error(n.errorPrefix_+"path specified exceeds the maximum depth that can be written ("+ei+") or object contains a cycle "+_e(n))}function _e(n){return n.parts_.length===0?"":"in property '"+n.parts_.join(".")+"'"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn extends hr{constructor(){super(["visible"]);let e,t;typeof document<"u"&&typeof document.addEventListener<"u"&&(typeof document.hidden<"u"?(t="visibilitychange",e="hidden"):typeof document.mozHidden<"u"?(t="mozvisibilitychange",e="mozHidden"):typeof document.msHidden<"u"?(t="msvisibilitychange",e="msHidden"):typeof document.webkitHidden<"u"&&(t="webkitvisibilitychange",e="webkitHidden")),this.visible_=!0,t&&document.addEventListener(t,()=>{const s=!document[e];s!==this.visible_&&(this.visible_=s,this.trigger("visible",s))},!1)}static getInstance(){return new Xn}getInitialEvent(e){return m(e==="visible","Unknown event type: "+e),[this.visible_]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const He=1e3,Gl=60*5*1e3,ni=30*1e3,ql=1.3,Ql=3e4,Yl="server_kill",si=3;class te extends ur{constructor(e,t,s,i,r,o,a,l){if(super(),this.repoInfo_=e,this.applicationId_=t,this.onDataUpdate_=s,this.onConnectStatus_=i,this.onServerInfoUpdate_=r,this.authTokenProvider_=o,this.appCheckTokenProvider_=a,this.authOverride_=l,this.id=te.nextPersistentConnectionId_++,this.log_=ft("p:"+this.id+":"),this.interruptReasons_={},this.listens=new Map,this.outstandingPuts_=[],this.outstandingGets_=[],this.outstandingPutCount_=0,this.outstandingGetCount_=0,this.onDisconnectRequestQueue_=[],this.connected_=!1,this.reconnectDelay_=He,this.maxReconnectDelay_=Gl,this.securityDebugCallback_=null,this.lastSessionId=null,this.establishConnectionTimer_=null,this.visible_=!1,this.requestCBHash_={},this.requestNumber_=0,this.realtime_=null,this.authToken_=null,this.appCheckToken_=null,this.forceTokenRefresh_=!1,this.invalidAuthTokenCount_=0,this.invalidAppCheckTokenCount_=0,this.firstConnection_=!0,this.lastConnectionAttemptTime_=null,this.lastConnectionEstablishedTime_=null,l)throw new Error("Auth override specified in options, but not supported on non Node.js platforms");Xn.getInstance().on("visible",this.onVisible_,this),e.host.indexOf("fblocal")===-1&&Pt.getInstance().on("online",this.onOnline_,this)}sendRequest(e,t,s){const i=++this.requestNumber_,r={r:i,a:e,b:t};this.log_(L(r)),m(this.connected_,"sendRequest call when we're not connected not allowed."),this.realtime_.sendRequest(r),s&&(this.requestCBHash_[i]=s)}get(e){this.initConnection_();const t=new dt,i={action:"g",request:{p:e._path.toString(),q:e._queryObject},onComplete:o=>{const a=o.d;o.s==="ok"?t.resolve(a):t.reject(a)}};this.outstandingGets_.push(i),this.outstandingGetCount_++;const r=this.outstandingGets_.length-1;return this.connected_&&this.sendGet_(r),t.promise}listen(e,t,s,i){this.initConnection_();const r=e._queryIdentifier,o=e._path.toString();this.log_("Listen called for "+o+" "+r),this.listens.has(o)||this.listens.set(o,new Map),m(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"listen() called for non-default but complete query"),m(!this.listens.get(o).has(r),"listen() called twice for same path/queryId.");const a={onComplete:i,hashFn:t,query:e,tag:s};this.listens.get(o).set(r,a),this.connected_&&this.sendListen_(a)}sendGet_(e){const t=this.outstandingGets_[e];this.sendRequest("g",t.request,s=>{delete this.outstandingGets_[e],this.outstandingGetCount_--,this.outstandingGetCount_===0&&(this.outstandingGets_=[]),t.onComplete&&t.onComplete(s)})}sendListen_(e){const t=e.query,s=t._path.toString(),i=t._queryIdentifier;this.log_("Listen on "+s+" for "+i);const r={p:s},o="q";e.tag&&(r.q=t._queryObject,r.t=e.tag),r.h=e.hashFn(),this.sendRequest(o,r,a=>{const l=a.d,c=a.s;te.warnOnListenWarnings_(l,t),(this.listens.get(s)&&this.listens.get(s).get(i))===e&&(this.log_("listen response",a),c!=="ok"&&this.removeListen_(s,i),e.onComplete&&e.onComplete(c,l))})}static warnOnListenWarnings_(e,t){if(e&&typeof e=="object"&&J(e,"w")){const s=Ne(e,"w");if(Array.isArray(s)&&~s.indexOf("no_index")){const i='".indexOn": "'+t._queryParams.getIndex().toString()+'"',r=t._path.toString();j(`Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding ${i} at ${r} to your security rules for better performance.`)}}}refreshAuthToken(e){this.authToken_=e,this.log_("Auth token refreshed"),this.authToken_?this.tryAuth():this.connected_&&this.sendRequest("unauth",{},()=>{}),this.reduceReconnectDelayIfAdminCredential_(e)}reduceReconnectDelayIfAdminCredential_(e){(e&&e.length===40||Lo(e))&&(this.log_("Admin auth credential detected.  Reducing max reconnect time."),this.maxReconnectDelay_=ni)}refreshAppCheckToken(e){this.appCheckToken_=e,this.log_("App check token refreshed"),this.appCheckToken_?this.tryAppCheck():this.connected_&&this.sendRequest("unappeck",{},()=>{})}tryAuth(){if(this.connected_&&this.authToken_){const e=this.authToken_,t=Mo(e)?"auth":"gauth",s={cred:e};this.authOverride_===null?s.noauth=!0:typeof this.authOverride_=="object"&&(s.authvar=this.authOverride_),this.sendRequest(t,s,i=>{const r=i.s,o=i.d||"error";this.authToken_===e&&(r==="ok"?this.invalidAuthTokenCount_=0:this.onAuthRevoked_(r,o))})}}tryAppCheck(){this.connected_&&this.appCheckToken_&&this.sendRequest("appcheck",{token:this.appCheckToken_},e=>{const t=e.s,s=e.d||"error";t==="ok"?this.invalidAppCheckTokenCount_=0:this.onAppCheckRevoked_(t,s)})}unlisten(e,t){const s=e._path.toString(),i=e._queryIdentifier;this.log_("Unlisten called for "+s+" "+i),m(e._queryParams.isDefault()||!e._queryParams.loadsAllData(),"unlisten() called for non-default but complete query"),this.removeListen_(s,i)&&this.connected_&&this.sendUnlisten_(s,i,e._queryObject,t)}sendUnlisten_(e,t,s,i){this.log_("Unlisten on "+e+" for "+t);const r={p:e},o="n";i&&(r.q=s,r.t=i),this.sendRequest(o,r)}onDisconnectPut(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("o",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"o",data:t,onComplete:s})}onDisconnectMerge(e,t,s){this.initConnection_(),this.connected_?this.sendOnDisconnect_("om",e,t,s):this.onDisconnectRequestQueue_.push({pathString:e,action:"om",data:t,onComplete:s})}onDisconnectCancel(e,t){this.initConnection_(),this.connected_?this.sendOnDisconnect_("oc",e,null,t):this.onDisconnectRequestQueue_.push({pathString:e,action:"oc",data:null,onComplete:t})}sendOnDisconnect_(e,t,s,i){const r={p:t,d:s};this.log_("onDisconnect "+e,r),this.sendRequest(e,r,o=>{i&&setTimeout(()=>{i(o.s,o.d)},Math.floor(0))})}put(e,t,s,i){this.putInternal("p",e,t,s,i)}merge(e,t,s,i){this.putInternal("m",e,t,s,i)}putInternal(e,t,s,i,r){this.initConnection_();const o={p:t,d:s};r!==void 0&&(o.h=r),this.outstandingPuts_.push({action:e,request:o,onComplete:i}),this.outstandingPutCount_++;const a=this.outstandingPuts_.length-1;this.connected_?this.sendPut_(a):this.log_("Buffering put: "+t)}sendPut_(e){const t=this.outstandingPuts_[e].action,s=this.outstandingPuts_[e].request,i=this.outstandingPuts_[e].onComplete;this.outstandingPuts_[e].queued=this.connected_,this.sendRequest(t,s,r=>{this.log_(t+" response",r),delete this.outstandingPuts_[e],this.outstandingPutCount_--,this.outstandingPutCount_===0&&(this.outstandingPuts_=[]),i&&i(r.s,r.d)})}reportStats(e){if(this.connected_){const t={c:e};this.log_("reportStats",t),this.sendRequest("s",t,s=>{if(s.s!=="ok"){const r=s.d;this.log_("reportStats","Error sending stats: "+r)}})}}onDataMessage_(e){if("r"in e){this.log_("from server: "+L(e));const t=e.r,s=this.requestCBHash_[t];s&&(delete this.requestCBHash_[t],s(e.b))}else{if("error"in e)throw"A server-side error has occurred: "+e.error;"a"in e&&this.onDataPush_(e.a,e.b)}}onDataPush_(e,t){this.log_("handleServerMessage",e,t),e==="d"?this.onDataUpdate_(t.p,t.d,!1,t.t):e==="m"?this.onDataUpdate_(t.p,t.d,!0,t.t):e==="c"?this.onListenRevoked_(t.p,t.q):e==="ac"?this.onAuthRevoked_(t.s,t.d):e==="apc"?this.onAppCheckRevoked_(t.s,t.d):e==="sd"?this.onSecurityDebugPacket_(t):Sn("Unrecognized action received from server: "+L(e)+`
Are you using the latest client?`)}onReady_(e,t){this.log_("connection ready"),this.connected_=!0,this.lastConnectionEstablishedTime_=new Date().getTime(),this.handleTimestamp_(e),this.lastSessionId=t,this.firstConnection_&&this.sendConnectStats_(),this.restoreState_(),this.firstConnection_=!1,this.onConnectStatus_(!0)}scheduleConnect_(e){m(!this.realtime_,"Scheduling a connect when we're already connected/ing?"),this.establishConnectionTimer_&&clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=setTimeout(()=>{this.establishConnectionTimer_=null,this.establishConnection_()},Math.floor(e))}initConnection_(){!this.realtime_&&this.firstConnection_&&this.scheduleConnect_(0)}onVisible_(e){e&&!this.visible_&&this.reconnectDelay_===this.maxReconnectDelay_&&(this.log_("Window became visible.  Reducing delay."),this.reconnectDelay_=He,this.realtime_||this.scheduleConnect_(0)),this.visible_=e}onOnline_(e){e?(this.log_("Browser went online."),this.reconnectDelay_=He,this.realtime_||this.scheduleConnect_(0)):(this.log_("Browser went offline.  Killing connection."),this.realtime_&&this.realtime_.close())}onRealtimeDisconnect_(){if(this.log_("data client disconnected"),this.connected_=!1,this.realtime_=null,this.cancelSentTransactions_(),this.requestCBHash_={},this.shouldReconnect_()){this.visible_?this.lastConnectionEstablishedTime_&&(new Date().getTime()-this.lastConnectionEstablishedTime_>Ql&&(this.reconnectDelay_=He),this.lastConnectionEstablishedTime_=null):(this.log_("Window isn't visible.  Delaying reconnect."),this.reconnectDelay_=this.maxReconnectDelay_,this.lastConnectionAttemptTime_=new Date().getTime());const e=new Date().getTime()-this.lastConnectionAttemptTime_;let t=Math.max(0,this.reconnectDelay_-e);t=Math.random()*t,this.log_("Trying to reconnect in "+t+"ms"),this.scheduleConnect_(t),this.reconnectDelay_=Math.min(this.maxReconnectDelay_,this.reconnectDelay_*ql)}this.onConnectStatus_(!1)}async establishConnection_(){if(this.shouldReconnect_()){this.log_("Making a connection attempt"),this.lastConnectionAttemptTime_=new Date().getTime(),this.lastConnectionEstablishedTime_=null;const e=this.onDataMessage_.bind(this),t=this.onReady_.bind(this),s=this.onRealtimeDisconnect_.bind(this),i=this.id+":"+te.nextConnectionId_++,r=this.lastSessionId;let o=!1,a=null;const l=function(){a?a.close():(o=!0,s())},c=function(u){m(a,"sendRequest call when we're not connected not allowed."),a.sendRequest(u)};this.realtime_={close:l,sendRequest:c};const d=this.forceTokenRefresh_;this.forceTokenRefresh_=!1;try{const[u,h]=await Promise.all([this.authTokenProvider_.getToken(d),this.appCheckTokenProvider_.getToken(d)]);o?$("getToken() completed but was canceled"):($("getToken() completed. Creating connection."),this.authToken_=u&&u.accessToken,this.appCheckToken_=h&&h.token,a=new Ul(i,this.repoInfo_,this.applicationId_,this.appCheckToken_,this.authToken_,e,t,s,f=>{j(f+" ("+this.repoInfo_.toString()+")"),this.interrupt(Yl)},r))}catch(u){this.log_("Failed to get token: "+u),o||(this.repoInfo_.nodeAdmin&&j(u),l())}}}interrupt(e){$("Interrupting connection for reason: "+e),this.interruptReasons_[e]=!0,this.realtime_?this.realtime_.close():(this.establishConnectionTimer_&&(clearTimeout(this.establishConnectionTimer_),this.establishConnectionTimer_=null),this.connected_&&this.onRealtimeDisconnect_())}resume(e){$("Resuming connection for reason: "+e),delete this.interruptReasons_[e],ks(this.interruptReasons_)&&(this.reconnectDelay_=He,this.realtime_||this.scheduleConnect_(0))}handleTimestamp_(e){const t=e-new Date().getTime();this.onServerInfoUpdate_({serverTimeOffset:t})}cancelSentTransactions_(){for(let e=0;e<this.outstandingPuts_.length;e++){const t=this.outstandingPuts_[e];t&&"h"in t.request&&t.queued&&(t.onComplete&&t.onComplete("disconnect"),delete this.outstandingPuts_[e],this.outstandingPutCount_--)}this.outstandingPutCount_===0&&(this.outstandingPuts_=[])}onListenRevoked_(e,t){let s;t?s=t.map(r=>zn(r)).join("$"):s="default";const i=this.removeListen_(e,s);i&&i.onComplete&&i.onComplete("permission_denied")}removeListen_(e,t){const s=new R(e).toString();let i;if(this.listens.has(s)){const r=this.listens.get(s);i=r.get(t),r.delete(t),r.size===0&&this.listens.delete(s)}else i=void 0;return i}onAuthRevoked_(e,t){$("Auth token revoked: "+e+"/"+t),this.authToken_=null,this.forceTokenRefresh_=!0,this.realtime_.close(),(e==="invalid_token"||e==="permission_denied")&&(this.invalidAuthTokenCount_++,this.invalidAuthTokenCount_>=si&&(this.reconnectDelay_=ni,this.authTokenProvider_.notifyForInvalidToken()))}onAppCheckRevoked_(e,t){$("App check token revoked: "+e+"/"+t),this.appCheckToken_=null,this.forceTokenRefresh_=!0,(e==="invalid_token"||e==="permission_denied")&&(this.invalidAppCheckTokenCount_++,this.invalidAppCheckTokenCount_>=si&&this.appCheckTokenProvider_.notifyForInvalidToken())}onSecurityDebugPacket_(e){this.securityDebugCallback_?this.securityDebugCallback_(e):"msg"in e&&console.log("FIREBASE: "+e.msg.replace(`
`,`
FIREBASE: `))}restoreState_(){this.tryAuth(),this.tryAppCheck();for(const e of this.listens.values())for(const t of e.values())this.sendListen_(t);for(let e=0;e<this.outstandingPuts_.length;e++)this.outstandingPuts_[e]&&this.sendPut_(e);for(;this.onDisconnectRequestQueue_.length;){const e=this.onDisconnectRequestQueue_.shift();this.sendOnDisconnect_(e.action,e.pathString,e.data,e.onComplete)}for(let e=0;e<this.outstandingGets_.length;e++)this.outstandingGets_[e]&&this.sendGet_(e)}sendConnectStats_(){const e={};let t="js";e["sdk."+t+"."+Vi.replace(/\./g,"-")]=1,Li()?e["framework.cordova"]=1:To()&&(e["framework.reactnative"]=1),this.reportStats(e)}shouldReconnect_(){const e=Pt.getInstance().currentlyOnline();return ks(this.interruptReasons_)&&e}}te.nextPersistentConnectionId_=0;te.nextConnectionId_=0;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(e,t){this.name=e,this.node=t}static Wrap(e,t){return new I(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{getCompare(){return this.compare.bind(this)}indexedValueChanged(e,t){const s=new I(be,e),i=new I(be,t);return this.compare(s,i)!==0}minPost(){return I.MIN}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Et;class mr extends Yt{static get __EMPTY_NODE(){return Et}static set __EMPTY_NODE(e){Et=e}compare(e,t){return Ce(e.name,t.name)}isDefinedOn(e){throw Le("KeyIndex.isDefinedOn not expected to be called.")}indexedValueChanged(e,t){return!1}minPost(){return I.MIN}maxPost(){return new I(he,Et)}makePost(e,t){return m(typeof e=="string","KeyIndex indexValue must always be a string."),new I(e,Et)}toString(){return".key"}}const ve=new mr;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e,t,s,i,r=null){this.isReverse_=i,this.resultGenerator_=r,this.nodeStack_=[];let o=1;for(;!e.isEmpty();)if(e=e,o=t?s(e.key,t):1,i&&(o*=-1),o<0)this.isReverse_?e=e.left:e=e.right;else if(o===0){this.nodeStack_.push(e);break}else this.nodeStack_.push(e),this.isReverse_?e=e.right:e=e.left}getNext(){if(this.nodeStack_.length===0)return null;let e=this.nodeStack_.pop(),t;if(this.resultGenerator_?t=this.resultGenerator_(e.key,e.value):t={key:e.key,value:e.value},this.isReverse_)for(e=e.left;!e.isEmpty();)this.nodeStack_.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack_.push(e),e=e.left;return t}hasNext(){return this.nodeStack_.length>0}peek(){if(this.nodeStack_.length===0)return null;const e=this.nodeStack_[this.nodeStack_.length-1];return this.resultGenerator_?this.resultGenerator_(e.key,e.value):{key:e.key,value:e.value}}}class F{constructor(e,t,s,i,r){this.key=e,this.value=t,this.color=s??F.RED,this.left=i??V.EMPTY_NODE,this.right=r??V.EMPTY_NODE}copy(e,t,s,i,r){return new F(e??this.key,t??this.value,s??this.color,i??this.left,r??this.right)}count(){return this.left.count()+1+this.right.count()}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||!!e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min_(){return this.left.isEmpty()?this:this.left.min_()}minKey(){return this.min_().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,s){let i=this;const r=s(e,i.key);return r<0?i=i.copy(null,null,null,i.left.insert(e,t,s),null):r===0?i=i.copy(null,t,null,null,null):i=i.copy(null,null,null,null,i.right.insert(e,t,s)),i.fixUp_()}removeMin_(){if(this.left.isEmpty())return V.EMPTY_NODE;let e=this;return!e.left.isRed_()&&!e.left.left.isRed_()&&(e=e.moveRedLeft_()),e=e.copy(null,null,null,e.left.removeMin_(),null),e.fixUp_()}remove(e,t){let s,i;if(s=this,t(e,s.key)<0)!s.left.isEmpty()&&!s.left.isRed_()&&!s.left.left.isRed_()&&(s=s.moveRedLeft_()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed_()&&(s=s.rotateRight_()),!s.right.isEmpty()&&!s.right.isRed_()&&!s.right.left.isRed_()&&(s=s.moveRedRight_()),t(e,s.key)===0){if(s.right.isEmpty())return V.EMPTY_NODE;i=s.right.min_(),s=s.copy(i.key,i.value,null,null,s.right.removeMin_())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp_()}isRed_(){return this.color}fixUp_(){let e=this;return e.right.isRed_()&&!e.left.isRed_()&&(e=e.rotateLeft_()),e.left.isRed_()&&e.left.left.isRed_()&&(e=e.rotateRight_()),e.left.isRed_()&&e.right.isRed_()&&(e=e.colorFlip_()),e}moveRedLeft_(){let e=this.colorFlip_();return e.right.left.isRed_()&&(e=e.copy(null,null,null,null,e.right.rotateRight_()),e=e.rotateLeft_(),e=e.colorFlip_()),e}moveRedRight_(){let e=this.colorFlip_();return e.left.left.isRed_()&&(e=e.rotateRight_(),e=e.colorFlip_()),e}rotateLeft_(){const e=this.copy(null,null,F.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight_(){const e=this.copy(null,null,F.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip_(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth_(){const e=this.check_();return Math.pow(2,e)<=this.count()+1}check_(){if(this.isRed_()&&this.left.isRed_())throw new Error("Red node has red child("+this.key+","+this.value+")");if(this.right.isRed_())throw new Error("Right child of ("+this.key+","+this.value+") is red");const e=this.left.check_();if(e!==this.right.check_())throw new Error("Black depths differ");return e+(this.isRed_()?0:1)}}F.RED=!0;F.BLACK=!1;class Kl{copy(e,t,s,i,r){return this}insert(e,t,s){return new F(e,t,null)}remove(e,t){return this}count(){return 0}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}check_(){return 0}isRed_(){return!1}}class V{constructor(e,t=V.EMPTY_NODE){this.comparator_=e,this.root_=t}insert(e,t){return new V(this.comparator_,this.root_.insert(e,t,this.comparator_).copy(null,null,F.BLACK,null,null))}remove(e){return new V(this.comparator_,this.root_.remove(e,this.comparator_).copy(null,null,F.BLACK,null,null))}get(e){let t,s=this.root_;for(;!s.isEmpty();){if(t=this.comparator_(e,s.key),t===0)return s.value;t<0?s=s.left:t>0&&(s=s.right)}return null}getPredecessorKey(e){let t,s=this.root_,i=null;for(;!s.isEmpty();)if(t=this.comparator_(e,s.key),t===0){if(s.left.isEmpty())return i?i.key:null;for(s=s.left;!s.right.isEmpty();)s=s.right;return s.key}else t<0?s=s.left:t>0&&(i=s,s=s.right);throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")}isEmpty(){return this.root_.isEmpty()}count(){return this.root_.count()}minKey(){return this.root_.minKey()}maxKey(){return this.root_.maxKey()}inorderTraversal(e){return this.root_.inorderTraversal(e)}reverseTraversal(e){return this.root_.reverseTraversal(e)}getIterator(e){return new Ct(this.root_,null,this.comparator_,!1,e)}getIteratorFrom(e,t){return new Ct(this.root_,e,this.comparator_,!1,t)}getReverseIteratorFrom(e,t){return new Ct(this.root_,e,this.comparator_,!0,t)}getReverseIterator(e){return new Ct(this.root_,null,this.comparator_,!0,e)}}V.EMPTY_NODE=new Kl;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xl(n,e){return Ce(n.name,e.name)}function Jn(n,e){return Ce(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Rn;function Jl(n){Rn=n}const gr=function(n){return typeof n=="number"?"number:"+Qi(n):"string:"+n},_r=function(n){if(n.isLeafNode()){const e=n.val();m(typeof e=="string"||typeof e=="number"||typeof e=="object"&&J(e,".sv"),"Priority must be a string or number.")}else m(n===Rn||n.isEmpty(),"priority of unexpected type.");m(n===Rn||n.getPriority().isEmpty(),"Priority nodes can't have a priority of their own.")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ii;class O{constructor(e,t=O.__childrenNodeConstructor.EMPTY_NODE){this.value_=e,this.priorityNode_=t,this.lazyHash_=null,m(this.value_!==void 0&&this.value_!==null,"LeafNode shouldn't be created with null/undefined value."),_r(this.priorityNode_)}static set __childrenNodeConstructor(e){ii=e}static get __childrenNodeConstructor(){return ii}isLeafNode(){return!0}getPriority(){return this.priorityNode_}updatePriority(e){return new O(this.value_,e)}getImmediateChild(e){return e===".priority"?this.priorityNode_:O.__childrenNodeConstructor.EMPTY_NODE}getChild(e){return C(e)?this:E(e)===".priority"?this.priorityNode_:O.__childrenNodeConstructor.EMPTY_NODE}hasChild(){return!1}getPredecessorChildName(e,t){return null}updateImmediateChild(e,t){return e===".priority"?this.updatePriority(t):t.isEmpty()&&e!==".priority"?this:O.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(e,t).updatePriority(this.priorityNode_)}updateChild(e,t){const s=E(e);return s===null?t:t.isEmpty()&&s!==".priority"?this:(m(s!==".priority"||fe(e)===1,".priority must be the last token in a path"),this.updateImmediateChild(s,O.__childrenNodeConstructor.EMPTY_NODE.updateChild(D(e),t)))}isEmpty(){return!1}numChildren(){return 0}forEachChild(e,t){return!1}val(e){return e&&!this.getPriority().isEmpty()?{".value":this.getValue(),".priority":this.getPriority().val()}:this.getValue()}hash(){if(this.lazyHash_===null){let e="";this.priorityNode_.isEmpty()||(e+="priority:"+gr(this.priorityNode_.val())+":");const t=typeof this.value_;e+=t+":",t==="number"?e+=Qi(this.value_):e+=this.value_,this.lazyHash_=Gi(e)}return this.lazyHash_}getValue(){return this.value_}compareTo(e){return e===O.__childrenNodeConstructor.EMPTY_NODE?1:e instanceof O.__childrenNodeConstructor?-1:(m(e.isLeafNode(),"Unknown node type"),this.compareToLeafNode_(e))}compareToLeafNode_(e){const t=typeof e.value_,s=typeof this.value_,i=O.VALUE_TYPE_ORDER.indexOf(t),r=O.VALUE_TYPE_ORDER.indexOf(s);return m(i>=0,"Unknown leaf type: "+t),m(r>=0,"Unknown leaf type: "+s),i===r?s==="object"?0:this.value_<e.value_?-1:this.value_===e.value_?0:1:r-i}withIndex(){return this}isIndexed(){return!0}equals(e){if(e===this)return!0;if(e.isLeafNode()){const t=e;return this.value_===t.value_&&this.priorityNode_.equals(t.priorityNode_)}else return!1}}O.VALUE_TYPE_ORDER=["object","boolean","number","string"];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let yr,vr;function Zl(n){yr=n}function ec(n){vr=n}class tc extends Yt{compare(e,t){const s=e.node.getPriority(),i=t.node.getPriority(),r=s.compareTo(i);return r===0?Ce(e.name,t.name):r}isDefinedOn(e){return!e.getPriority().isEmpty()}indexedValueChanged(e,t){return!e.getPriority().equals(t.getPriority())}minPost(){return I.MIN}maxPost(){return new I(he,new O("[PRIORITY-POST]",vr))}makePost(e,t){const s=yr(e);return new I(t,new O("[PRIORITY-POST]",s))}toString(){return".priority"}}const k=new tc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nc=Math.log(2);class sc{constructor(e){const t=r=>parseInt(Math.log(r)/nc,10),s=r=>parseInt(Array(r+1).join("1"),2);this.count=t(e+1),this.current_=this.count-1;const i=s(this.count);this.bits_=e+1&i}nextBitIsOne(){const e=!(this.bits_&1<<this.current_);return this.current_--,e}}const Mt=function(n,e,t,s){n.sort(e);const i=function(l,c){const d=c-l;let u,h;if(d===0)return null;if(d===1)return u=n[l],h=t?t(u):u,new F(h,u.node,F.BLACK,null,null);{const f=parseInt(d/2,10)+l,g=i(l,f),w=i(f+1,c);return u=n[f],h=t?t(u):u,new F(h,u.node,F.BLACK,g,w)}},r=function(l){let c=null,d=null,u=n.length;const h=function(g,w){const _=u-g,x=u;u-=g;const p=i(_+1,x),v=n[_],y=t?t(v):v;f(new F(y,v.node,w,null,p))},f=function(g){c?(c.left=g,c=g):(d=g,c=g)};for(let g=0;g<l.count;++g){const w=l.nextBitIsOne(),_=Math.pow(2,l.count-(g+1));w?h(_,F.BLACK):(h(_,F.BLACK),h(_,F.RED))}return d},o=new sc(n.length),a=r(o);return new V(s||e,a)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pn;const Se={};class ee{constructor(e,t){this.indexes_=e,this.indexSet_=t}static get Default(){return m(Se&&k,"ChildrenNode.ts has not been loaded"),pn=pn||new ee({".priority":Se},{".priority":k}),pn}get(e){const t=Ne(this.indexes_,e);if(!t)throw new Error("No index defined for "+e);return t instanceof V?t:null}hasIndex(e){return J(this.indexSet_,e.toString())}addIndex(e,t){m(e!==ve,"KeyIndex always exists and isn't meant to be added to the IndexMap.");const s=[];let i=!1;const r=t.getIterator(I.Wrap);let o=r.getNext();for(;o;)i=i||e.isDefinedOn(o.node),s.push(o),o=r.getNext();let a;i?a=Mt(s,e.getCompare()):a=Se;const l=e.toString(),c=Object.assign({},this.indexSet_);c[l]=e;const d=Object.assign({},this.indexes_);return d[l]=a,new ee(d,c)}addToIndexes(e,t){const s=Nt(this.indexes_,(i,r)=>{const o=Ne(this.indexSet_,r);if(m(o,"Missing index implementation for "+r),i===Se)if(o.isDefinedOn(e.node)){const a=[],l=t.getIterator(I.Wrap);let c=l.getNext();for(;c;)c.name!==e.name&&a.push(c),c=l.getNext();return a.push(e),Mt(a,o.getCompare())}else return Se;else{const a=t.get(e.name);let l=i;return a&&(l=l.remove(new I(e.name,a))),l.insert(e,e.node)}});return new ee(s,this.indexSet_)}removeFromIndexes(e,t){const s=Nt(this.indexes_,i=>{if(i===Se)return i;{const r=t.get(e.name);return r?i.remove(new I(e.name,r)):i}});return new ee(s,this.indexSet_)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let je;class b{constructor(e,t,s){this.children_=e,this.priorityNode_=t,this.indexMap_=s,this.lazyHash_=null,this.priorityNode_&&_r(this.priorityNode_),this.children_.isEmpty()&&m(!this.priorityNode_||this.priorityNode_.isEmpty(),"An empty node cannot have a priority")}static get EMPTY_NODE(){return je||(je=new b(new V(Jn),null,ee.Default))}isLeafNode(){return!1}getPriority(){return this.priorityNode_||je}updatePriority(e){return this.children_.isEmpty()?this:new b(this.children_,e,this.indexMap_)}getImmediateChild(e){if(e===".priority")return this.getPriority();{const t=this.children_.get(e);return t===null?je:t}}getChild(e){const t=E(e);return t===null?this:this.getImmediateChild(t).getChild(D(e))}hasChild(e){return this.children_.get(e)!==null}updateImmediateChild(e,t){if(m(t,"We should always be passing snapshot nodes"),e===".priority")return this.updatePriority(t);{const s=new I(e,t);let i,r;t.isEmpty()?(i=this.children_.remove(e),r=this.indexMap_.removeFromIndexes(s,this.children_)):(i=this.children_.insert(e,t),r=this.indexMap_.addToIndexes(s,this.children_));const o=i.isEmpty()?je:this.priorityNode_;return new b(i,o,r)}}updateChild(e,t){const s=E(e);if(s===null)return t;{m(E(e)!==".priority"||fe(e)===1,".priority must be the last token in a path");const i=this.getImmediateChild(s).updateChild(D(e),t);return this.updateImmediateChild(s,i)}}isEmpty(){return this.children_.isEmpty()}numChildren(){return this.children_.count()}val(e){if(this.isEmpty())return null;const t={};let s=0,i=0,r=!0;if(this.forEachChild(k,(o,a)=>{t[o]=a.val(e),s++,r&&b.INTEGER_REGEXP_.test(o)?i=Math.max(i,Number(o)):r=!1}),!e&&r&&i<2*s){const o=[];for(const a in t)o[a]=t[a];return o}else return e&&!this.getPriority().isEmpty()&&(t[".priority"]=this.getPriority().val()),t}hash(){if(this.lazyHash_===null){let e="";this.getPriority().isEmpty()||(e+="priority:"+gr(this.getPriority().val())+":"),this.forEachChild(k,(t,s)=>{const i=s.hash();i!==""&&(e+=":"+t+":"+i)}),this.lazyHash_=e===""?"":Gi(e)}return this.lazyHash_}getPredecessorChildName(e,t,s){const i=this.resolveIndex_(s);if(i){const r=i.getPredecessorKey(new I(e,t));return r?r.name:null}else return this.children_.getPredecessorKey(e)}getFirstChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.minKey();return s&&s.name}else return this.children_.minKey()}getFirstChild(e){const t=this.getFirstChildName(e);return t?new I(t,this.children_.get(t)):null}getLastChildName(e){const t=this.resolveIndex_(e);if(t){const s=t.maxKey();return s&&s.name}else return this.children_.maxKey()}getLastChild(e){const t=this.getLastChildName(e);return t?new I(t,this.children_.get(t)):null}forEachChild(e,t){const s=this.resolveIndex_(e);return s?s.inorderTraversal(i=>t(i.name,i.node)):this.children_.inorderTraversal(t)}getIterator(e){return this.getIteratorFrom(e.minPost(),e)}getIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getIteratorFrom(e,i=>i);{const i=this.children_.getIteratorFrom(e.name,I.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)<0;)i.getNext(),r=i.peek();return i}}getReverseIterator(e){return this.getReverseIteratorFrom(e.maxPost(),e)}getReverseIteratorFrom(e,t){const s=this.resolveIndex_(t);if(s)return s.getReverseIteratorFrom(e,i=>i);{const i=this.children_.getReverseIteratorFrom(e.name,I.Wrap);let r=i.peek();for(;r!=null&&t.compare(r,e)>0;)i.getNext(),r=i.peek();return i}}compareTo(e){return this.isEmpty()?e.isEmpty()?0:-1:e.isLeafNode()||e.isEmpty()?1:e===pt?-1:0}withIndex(e){if(e===ve||this.indexMap_.hasIndex(e))return this;{const t=this.indexMap_.addIndex(e,this.children_);return new b(this.children_,this.priorityNode_,t)}}isIndexed(e){return e===ve||this.indexMap_.hasIndex(e)}equals(e){if(e===this)return!0;if(e.isLeafNode())return!1;{const t=e;if(this.getPriority().equals(t.getPriority()))if(this.children_.count()===t.children_.count()){const s=this.getIterator(k),i=t.getIterator(k);let r=s.getNext(),o=i.getNext();for(;r&&o;){if(r.name!==o.name||!r.node.equals(o.node))return!1;r=s.getNext(),o=i.getNext()}return r===null&&o===null}else return!1;else return!1}}resolveIndex_(e){return e===ve?null:this.indexMap_.get(e.toString())}}b.INTEGER_REGEXP_=/^(0|[1-9]\d*)$/;class ic extends b{constructor(){super(new V(Jn),b.EMPTY_NODE,ee.Default)}compareTo(e){return e===this?0:1}equals(e){return e===this}getPriority(){return this}getImmediateChild(e){return b.EMPTY_NODE}isEmpty(){return!1}}const pt=new ic;Object.defineProperties(I,{MIN:{value:new I(be,b.EMPTY_NODE)},MAX:{value:new I(he,pt)}});mr.__EMPTY_NODE=b.EMPTY_NODE;O.__childrenNodeConstructor=b;Jl(pt);ec(pt);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rc=!0;function M(n,e=null){if(n===null)return b.EMPTY_NODE;if(typeof n=="object"&&".priority"in n&&(e=n[".priority"]),m(e===null||typeof e=="string"||typeof e=="number"||typeof e=="object"&&".sv"in e,"Invalid priority type found: "+typeof e),typeof n=="object"&&".value"in n&&n[".value"]!==null&&(n=n[".value"]),typeof n!="object"||".sv"in n){const t=n;return new O(t,M(e))}if(!(n instanceof Array)&&rc){const t=[];let s=!1;if(B(n,(o,a)=>{if(o.substring(0,1)!=="."){const l=M(a);l.isEmpty()||(s=s||!l.getPriority().isEmpty(),t.push(new I(o,l)))}}),t.length===0)return b.EMPTY_NODE;const r=Mt(t,Xl,o=>o.name,Jn);if(s){const o=Mt(t,k.getCompare());return new b(r,M(e),new ee({".priority":o},{".priority":k}))}else return new b(r,M(e),ee.Default)}else{let t=b.EMPTY_NODE;return B(n,(s,i)=>{if(J(n,s)&&s.substring(0,1)!=="."){const r=M(i);(r.isLeafNode()||!r.isEmpty())&&(t=t.updateImmediateChild(s,r))}}),t.updatePriority(M(e))}}Zl(M);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn extends Yt{constructor(e){super(),this.indexPath_=e,m(!C(e)&&E(e)!==".priority","Can't create PathIndex with empty path or .priority key")}extractChild(e){return e.getChild(this.indexPath_)}isDefinedOn(e){return!e.getChild(this.indexPath_).isEmpty()}compare(e,t){const s=this.extractChild(e.node),i=this.extractChild(t.node),r=s.compareTo(i);return r===0?Ce(e.name,t.name):r}makePost(e,t){const s=M(e),i=b.EMPTY_NODE.updateChild(this.indexPath_,s);return new I(t,i)}maxPost(){const e=b.EMPTY_NODE.updateChild(this.indexPath_,pt);return new I(he,e)}toString(){return tt(this.indexPath_,0).join("/")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oc extends Yt{compare(e,t){const s=e.node.compareTo(t.node);return s===0?Ce(e.name,t.name):s}isDefinedOn(e){return!0}indexedValueChanged(e,t){return!e.equals(t)}minPost(){return I.MIN}maxPost(){return I.MAX}makePost(e,t){const s=M(e);return new I(t,s)}toString(){return".value"}}const br=new oc;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wr(n){return{type:"value",snapshotNode:n}}function De(n,e){return{type:"child_added",snapshotNode:e,childName:n}}function nt(n,e){return{type:"child_removed",snapshotNode:e,childName:n}}function st(n,e,t){return{type:"child_changed",snapshotNode:e,childName:n,oldSnap:t}}function ac(n,e){return{type:"child_moved",snapshotNode:e,childName:n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{constructor(e){this.index_=e}updateChild(e,t,s,i,r,o){m(e.isIndexed(this.index_),"A node must be indexed if only a child is updated");const a=e.getImmediateChild(t);return a.getChild(i).equals(s.getChild(i))&&a.isEmpty()===s.isEmpty()||(o!=null&&(s.isEmpty()?e.hasChild(t)?o.trackChildChange(nt(t,a)):m(e.isLeafNode(),"A child remove without an old child only makes sense on a leaf node"):a.isEmpty()?o.trackChildChange(De(t,s)):o.trackChildChange(st(t,s,a))),e.isLeafNode()&&s.isEmpty())?e:e.updateImmediateChild(t,s).withIndex(this.index_)}updateFullNode(e,t,s){return s!=null&&(e.isLeafNode()||e.forEachChild(k,(i,r)=>{t.hasChild(i)||s.trackChildChange(nt(i,r))}),t.isLeafNode()||t.forEachChild(k,(i,r)=>{if(e.hasChild(i)){const o=e.getImmediateChild(i);o.equals(r)||s.trackChildChange(st(i,r,o))}else s.trackChildChange(De(i,r))})),t.withIndex(this.index_)}updatePriority(e,t){return e.isEmpty()?b.EMPTY_NODE:e.updatePriority(t)}filtersNodes(){return!1}getIndexedFilter(){return this}getIndex(){return this.index_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class it{constructor(e){this.indexedFilter_=new es(e.getIndex()),this.index_=e.getIndex(),this.startPost_=it.getStartPost_(e),this.endPost_=it.getEndPost_(e),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}getStartPost(){return this.startPost_}getEndPost(){return this.endPost_}matches(e){const t=this.startIsInclusive_?this.index_.compare(this.getStartPost(),e)<=0:this.index_.compare(this.getStartPost(),e)<0,s=this.endIsInclusive_?this.index_.compare(e,this.getEndPost())<=0:this.index_.compare(e,this.getEndPost())<0;return t&&s}updateChild(e,t,s,i,r,o){return this.matches(new I(t,s))||(s=b.EMPTY_NODE),this.indexedFilter_.updateChild(e,t,s,i,r,o)}updateFullNode(e,t,s){t.isLeafNode()&&(t=b.EMPTY_NODE);let i=t.withIndex(this.index_);i=i.updatePriority(b.EMPTY_NODE);const r=this;return t.forEachChild(k,(o,a)=>{r.matches(new I(o,a))||(i=i.updateImmediateChild(o,b.EMPTY_NODE))}),this.indexedFilter_.updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.indexedFilter_}getIndex(){return this.index_}static getStartPost_(e){if(e.hasStart()){const t=e.getIndexStartName();return e.getIndex().makePost(e.getIndexStartValue(),t)}else return e.getIndex().minPost()}static getEndPost_(e){if(e.hasEnd()){const t=e.getIndexEndName();return e.getIndex().makePost(e.getIndexEndValue(),t)}else return e.getIndex().maxPost()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lc{constructor(e){this.withinDirectionalStart=t=>this.reverse_?this.withinEndPost(t):this.withinStartPost(t),this.withinDirectionalEnd=t=>this.reverse_?this.withinStartPost(t):this.withinEndPost(t),this.withinStartPost=t=>{const s=this.index_.compare(this.rangedFilter_.getStartPost(),t);return this.startIsInclusive_?s<=0:s<0},this.withinEndPost=t=>{const s=this.index_.compare(t,this.rangedFilter_.getEndPost());return this.endIsInclusive_?s<=0:s<0},this.rangedFilter_=new it(e),this.index_=e.getIndex(),this.limit_=e.getLimit(),this.reverse_=!e.isViewFromLeft(),this.startIsInclusive_=!e.startAfterSet_,this.endIsInclusive_=!e.endBeforeSet_}updateChild(e,t,s,i,r,o){return this.rangedFilter_.matches(new I(t,s))||(s=b.EMPTY_NODE),e.getImmediateChild(t).equals(s)?e:e.numChildren()<this.limit_?this.rangedFilter_.getIndexedFilter().updateChild(e,t,s,i,r,o):this.fullLimitUpdateChild_(e,t,s,r,o)}updateFullNode(e,t,s){let i;if(t.isLeafNode()||t.isEmpty())i=b.EMPTY_NODE.withIndex(this.index_);else if(this.limit_*2<t.numChildren()&&t.isIndexed(this.index_)){i=b.EMPTY_NODE.withIndex(this.index_);let r;this.reverse_?r=t.getReverseIteratorFrom(this.rangedFilter_.getEndPost(),this.index_):r=t.getIteratorFrom(this.rangedFilter_.getStartPost(),this.index_);let o=0;for(;r.hasNext()&&o<this.limit_;){const a=r.getNext();if(this.withinDirectionalStart(a))if(this.withinDirectionalEnd(a))i=i.updateImmediateChild(a.name,a.node),o++;else break;else continue}}else{i=t.withIndex(this.index_),i=i.updatePriority(b.EMPTY_NODE);let r;this.reverse_?r=i.getReverseIterator(this.index_):r=i.getIterator(this.index_);let o=0;for(;r.hasNext();){const a=r.getNext();o<this.limit_&&this.withinDirectionalStart(a)&&this.withinDirectionalEnd(a)?o++:i=i.updateImmediateChild(a.name,b.EMPTY_NODE)}}return this.rangedFilter_.getIndexedFilter().updateFullNode(e,i,s)}updatePriority(e,t){return e}filtersNodes(){return!0}getIndexedFilter(){return this.rangedFilter_.getIndexedFilter()}getIndex(){return this.index_}fullLimitUpdateChild_(e,t,s,i,r){let o;if(this.reverse_){const u=this.index_.getCompare();o=(h,f)=>u(f,h)}else o=this.index_.getCompare();const a=e;m(a.numChildren()===this.limit_,"");const l=new I(t,s),c=this.reverse_?a.getFirstChild(this.index_):a.getLastChild(this.index_),d=this.rangedFilter_.matches(l);if(a.hasChild(t)){const u=a.getImmediateChild(t);let h=i.getChildAfterChild(this.index_,c,this.reverse_);for(;h!=null&&(h.name===t||a.hasChild(h.name));)h=i.getChildAfterChild(this.index_,h,this.reverse_);const f=h==null?1:o(h,l);if(d&&!s.isEmpty()&&f>=0)return r!=null&&r.trackChildChange(st(t,s,u)),a.updateImmediateChild(t,s);{r!=null&&r.trackChildChange(nt(t,u));const w=a.updateImmediateChild(t,b.EMPTY_NODE);return h!=null&&this.rangedFilter_.matches(h)?(r!=null&&r.trackChildChange(De(h.name,h.node)),w.updateImmediateChild(h.name,h.node)):w}}else return s.isEmpty()?e:d&&o(c,l)>=0?(r!=null&&(r.trackChildChange(nt(c.name,c.node)),r.trackChildChange(De(t,s))),a.updateImmediateChild(t,s).updateImmediateChild(c.name,b.EMPTY_NODE)):e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ts{constructor(){this.limitSet_=!1,this.startSet_=!1,this.startNameSet_=!1,this.startAfterSet_=!1,this.endSet_=!1,this.endNameSet_=!1,this.endBeforeSet_=!1,this.limit_=0,this.viewFrom_="",this.indexStartValue_=null,this.indexStartName_="",this.indexEndValue_=null,this.indexEndName_="",this.index_=k}hasStart(){return this.startSet_}isViewFromLeft(){return this.viewFrom_===""?this.startSet_:this.viewFrom_==="l"}getIndexStartValue(){return m(this.startSet_,"Only valid if start has been set"),this.indexStartValue_}getIndexStartName(){return m(this.startSet_,"Only valid if start has been set"),this.startNameSet_?this.indexStartName_:be}hasEnd(){return this.endSet_}getIndexEndValue(){return m(this.endSet_,"Only valid if end has been set"),this.indexEndValue_}getIndexEndName(){return m(this.endSet_,"Only valid if end has been set"),this.endNameSet_?this.indexEndName_:he}hasLimit(){return this.limitSet_}hasAnchoredLimit(){return this.limitSet_&&this.viewFrom_!==""}getLimit(){return m(this.limitSet_,"Only valid if limit has been set"),this.limit_}getIndex(){return this.index_}loadsAllData(){return!(this.startSet_||this.endSet_||this.limitSet_)}isDefault(){return this.loadsAllData()&&this.index_===k}copy(){const e=new ts;return e.limitSet_=this.limitSet_,e.limit_=this.limit_,e.startSet_=this.startSet_,e.startAfterSet_=this.startAfterSet_,e.indexStartValue_=this.indexStartValue_,e.startNameSet_=this.startNameSet_,e.indexStartName_=this.indexStartName_,e.endSet_=this.endSet_,e.endBeforeSet_=this.endBeforeSet_,e.indexEndValue_=this.indexEndValue_,e.endNameSet_=this.endNameSet_,e.indexEndName_=this.indexEndName_,e.index_=this.index_,e.viewFrom_=this.viewFrom_,e}}function cc(n){return n.loadsAllData()?new es(n.getIndex()):n.hasLimit()?new lc(n):new it(n)}function dc(n,e){const t=n.copy();return t.limitSet_=!0,t.limit_=e,t.viewFrom_="r",t}function uc(n,e){const t=n.copy();return t.index_=e,t}function ri(n){const e={};if(n.isDefault())return e;let t;if(n.index_===k?t="$priority":n.index_===br?t="$value":n.index_===ve?t="$key":(m(n.index_ instanceof Zn,"Unrecognized index type!"),t=n.index_.toString()),e.orderBy=L(t),n.startSet_){const s=n.startAfterSet_?"startAfter":"startAt";e[s]=L(n.indexStartValue_),n.startNameSet_&&(e[s]+=","+L(n.indexStartName_))}if(n.endSet_){const s=n.endBeforeSet_?"endBefore":"endAt";e[s]=L(n.indexEndValue_),n.endNameSet_&&(e[s]+=","+L(n.indexEndName_))}return n.limitSet_&&(n.isViewFromLeft()?e.limitToFirst=n.limit_:e.limitToLast=n.limit_),e}function oi(n){const e={};if(n.startSet_&&(e.sp=n.indexStartValue_,n.startNameSet_&&(e.sn=n.indexStartName_),e.sin=!n.startAfterSet_),n.endSet_&&(e.ep=n.indexEndValue_,n.endNameSet_&&(e.en=n.indexEndName_),e.ein=!n.endBeforeSet_),n.limitSet_){e.l=n.limit_;let t=n.viewFrom_;t===""&&(n.isViewFromLeft()?t="l":t="r"),e.vf=t}return n.index_!==k&&(e.i=n.index_.toString()),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lt extends ur{constructor(e,t,s,i){super(),this.repoInfo_=e,this.onDataUpdate_=t,this.authTokenProvider_=s,this.appCheckTokenProvider_=i,this.log_=ft("p:rest:"),this.listens_={}}reportStats(e){throw new Error("Method not implemented.")}static getListenId_(e,t){return t!==void 0?"tag$"+t:(m(e._queryParams.isDefault(),"should have a tag if it's not a default query."),e._path.toString())}listen(e,t,s,i){const r=e._path.toString();this.log_("Listen called for "+r+" "+e._queryIdentifier);const o=Lt.getListenId_(e,s),a={};this.listens_[o]=a;const l=ri(e._queryParams);this.restRequest_(r+".json",l,(c,d)=>{let u=d;if(c===404&&(u=null,c=null),c===null&&this.onDataUpdate_(r,u,!1,s),Ne(this.listens_,o)===a){let h;c?c===401?h="permission_denied":h="rest_error:"+c:h="ok",i(h,null)}})}unlisten(e,t){const s=Lt.getListenId_(e,t);delete this.listens_[s]}get(e){const t=ri(e._queryParams),s=e._path.toString(),i=new dt;return this.restRequest_(s+".json",t,(r,o)=>{let a=o;r===404&&(a=null,r=null),r===null?(this.onDataUpdate_(s,a,!1,null),i.resolve(a)):i.reject(new Error(a))}),i.promise}refreshAuthToken(e){}restRequest_(e,t={},s){return t.format="export",Promise.all([this.authTokenProvider_.getToken(!1),this.appCheckTokenProvider_.getToken(!1)]).then(([i,r])=>{i&&i.accessToken&&(t.auth=i.accessToken),r&&r.token&&(t.ac=r.token);const o=(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host+e+"?ns="+this.repoInfo_.namespace+Oo(t);this.log_("Sending REST request for "+o);const a=new XMLHttpRequest;a.onreadystatechange=()=>{if(s&&a.readyState===4){this.log_("REST Response for "+o+" received. status:",a.status,"response:",a.responseText);let l=null;if(a.status>=200&&a.status<300){try{l=Ke(a.responseText)}catch{j("Failed to parse JSON response for "+o+": "+a.responseText)}s(null,l)}else a.status!==401&&a.status!==404&&j("Got unsuccessful REST response for "+o+" Status: "+a.status),s(a.status);s=null}},a.open("GET",o,!0),a.send()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(){this.rootNode_=b.EMPTY_NODE}getNode(e){return this.rootNode_.getChild(e)}updateSnapshot(e,t){this.rootNode_=this.rootNode_.updateChild(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ot(){return{value:null,children:new Map}}function xr(n,e,t){if(C(e))n.value=t,n.children.clear();else if(n.value!==null)n.value=n.value.updateChild(e,t);else{const s=E(e);n.children.has(s)||n.children.set(s,Ot());const i=n.children.get(s);e=D(e),xr(i,e,t)}}function An(n,e,t){n.value!==null?t(e,n.value):fc(n,(s,i)=>{const r=new R(e.toString()+"/"+s);An(i,r,t)})}function fc(n,e){n.children.forEach((t,s)=>{e(s,t)})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pc{constructor(e){this.collection_=e,this.last_=null}get(){const e=this.collection_.get(),t=Object.assign({},e);return this.last_&&B(this.last_,(s,i)=>{t[s]=t[s]-i}),this.last_=e,t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ai=10*1e3,mc=30*1e3,gc=5*60*1e3;class _c{constructor(e,t){this.server_=t,this.statsToReport_={},this.statsListener_=new pc(e);const s=ai+(mc-ai)*Math.random();Ge(this.reportStats_.bind(this),Math.floor(s))}reportStats_(){const e=this.statsListener_.get(),t={};let s=!1;B(e,(i,r)=>{r>0&&J(this.statsToReport_,i)&&(t[i]=r,s=!0)}),s&&this.server_.reportStats(t),Ge(this.reportStats_.bind(this),Math.floor(Math.random()*2*gc))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Y;(function(n){n[n.OVERWRITE=0]="OVERWRITE",n[n.MERGE=1]="MERGE",n[n.ACK_USER_WRITE=2]="ACK_USER_WRITE",n[n.LISTEN_COMPLETE=3]="LISTEN_COMPLETE"})(Y||(Y={}));function ns(){return{fromUser:!0,fromServer:!1,queryId:null,tagged:!1}}function ss(){return{fromUser:!1,fromServer:!0,queryId:null,tagged:!1}}function is(n){return{fromUser:!1,fromServer:!0,queryId:n,tagged:!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ft{constructor(e,t,s){this.path=e,this.affectedTree=t,this.revert=s,this.type=Y.ACK_USER_WRITE,this.source=ns()}operationForChild(e){if(C(this.path)){if(this.affectedTree.value!=null)return m(this.affectedTree.children.isEmpty(),"affectedTree should not have overlapping affected paths."),this;{const t=this.affectedTree.subtree(new R(e));return new Ft(S(),t,this.revert)}}else return m(E(this.path)===e,"operationForChild called for unrelated child."),new Ft(D(this.path),this.affectedTree,this.revert)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(e,t){this.source=e,this.path=t,this.type=Y.LISTEN_COMPLETE}operationForChild(e){return C(this.path)?new rt(this.source,S()):new rt(this.source,D(this.path))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we{constructor(e,t,s){this.source=e,this.path=t,this.snap=s,this.type=Y.OVERWRITE}operationForChild(e){return C(this.path)?new we(this.source,S(),this.snap.getImmediateChild(e)):new we(this.source,D(this.path),this.snap)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e,t,s){this.source=e,this.path=t,this.children=s,this.type=Y.MERGE}operationForChild(e){if(C(this.path)){const t=this.children.subtree(new R(e));return t.isEmpty()?null:t.value?new we(this.source,S(),t.value):new ke(this.source,S(),t)}else return m(E(this.path)===e,"Can't get a merge for a child not on the path of the operation"),new ke(this.source,D(this.path),this.children)}toString(){return"Operation("+this.path+": "+this.source.toString()+" merge: "+this.children.toString()+")"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e,t,s){this.node_=e,this.fullyInitialized_=t,this.filtered_=s}isFullyInitialized(){return this.fullyInitialized_}isFiltered(){return this.filtered_}isCompleteForPath(e){if(C(e))return this.isFullyInitialized()&&!this.filtered_;const t=E(e);return this.isCompleteForChild(t)}isCompleteForChild(e){return this.isFullyInitialized()&&!this.filtered_||this.node_.hasChild(e)}getNode(){return this.node_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yc{constructor(e){this.query_=e,this.index_=this.query_._queryParams.getIndex()}}function vc(n,e,t,s){const i=[],r=[];return e.forEach(o=>{o.type==="child_changed"&&n.index_.indexedValueChanged(o.oldSnap,o.snapshotNode)&&r.push(ac(o.childName,o.snapshotNode))}),Ve(n,i,"child_removed",e,s,t),Ve(n,i,"child_added",e,s,t),Ve(n,i,"child_moved",r,s,t),Ve(n,i,"child_changed",e,s,t),Ve(n,i,"value",e,s,t),i}function Ve(n,e,t,s,i,r){const o=s.filter(a=>a.type===t);o.sort((a,l)=>wc(n,a,l)),o.forEach(a=>{const l=bc(n,a,r);i.forEach(c=>{c.respondsTo(a.type)&&e.push(c.createEvent(l,n.query_))})})}function bc(n,e,t){return e.type==="value"||e.type==="child_removed"||(e.prevName=t.getPredecessorChildName(e.childName,e.snapshotNode,n.index_)),e}function wc(n,e,t){if(e.childName==null||t.childName==null)throw Le("Should only compare child_ events.");const s=new I(e.childName,e.snapshotNode),i=new I(t.childName,t.snapshotNode);return n.index_.compare(s,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kt(n,e){return{eventCache:n,serverCache:e}}function qe(n,e,t,s){return Kt(new pe(e,t,s),n.serverCache)}function Er(n,e,t,s){return Kt(n.eventCache,new pe(e,t,s))}function $t(n){return n.eventCache.isFullyInitialized()?n.eventCache.getNode():null}function xe(n){return n.serverCache.isFullyInitialized()?n.serverCache.getNode():null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let mn;const xc=()=>(mn||(mn=new V(ol)),mn);class A{constructor(e,t=xc()){this.value=e,this.children=t}static fromObject(e){let t=new A(null);return B(e,(s,i)=>{t=t.set(new R(s),i)}),t}isEmpty(){return this.value===null&&this.children.isEmpty()}findRootMostMatchingPathAndValue(e,t){if(this.value!=null&&t(this.value))return{path:S(),value:this.value};if(C(e))return null;{const s=E(e),i=this.children.get(s);if(i!==null){const r=i.findRootMostMatchingPathAndValue(D(e),t);return r!=null?{path:P(new R(s),r.path),value:r.value}:null}else return null}}findRootMostValueAndPath(e){return this.findRootMostMatchingPathAndValue(e,()=>!0)}subtree(e){if(C(e))return this;{const t=E(e),s=this.children.get(t);return s!==null?s.subtree(D(e)):new A(null)}}set(e,t){if(C(e))return new A(t,this.children);{const s=E(e),r=(this.children.get(s)||new A(null)).set(D(e),t),o=this.children.insert(s,r);return new A(this.value,o)}}remove(e){if(C(e))return this.children.isEmpty()?new A(null):new A(null,this.children);{const t=E(e),s=this.children.get(t);if(s){const i=s.remove(D(e));let r;return i.isEmpty()?r=this.children.remove(t):r=this.children.insert(t,i),this.value===null&&r.isEmpty()?new A(null):new A(this.value,r)}else return this}}get(e){if(C(e))return this.value;{const t=E(e),s=this.children.get(t);return s?s.get(D(e)):null}}setTree(e,t){if(C(e))return t;{const s=E(e),r=(this.children.get(s)||new A(null)).setTree(D(e),t);let o;return r.isEmpty()?o=this.children.remove(s):o=this.children.insert(s,r),new A(this.value,o)}}fold(e){return this.fold_(S(),e)}fold_(e,t){const s={};return this.children.inorderTraversal((i,r)=>{s[i]=r.fold_(P(e,i),t)}),t(e,this.value,s)}findOnPath(e,t){return this.findOnPath_(e,S(),t)}findOnPath_(e,t,s){const i=this.value?s(t,this.value):!1;if(i)return i;if(C(e))return null;{const r=E(e),o=this.children.get(r);return o?o.findOnPath_(D(e),P(t,r),s):null}}foreachOnPath(e,t){return this.foreachOnPath_(e,S(),t)}foreachOnPath_(e,t,s){if(C(e))return this;{this.value&&s(t,this.value);const i=E(e),r=this.children.get(i);return r?r.foreachOnPath_(D(e),P(t,i),s):new A(null)}}foreach(e){this.foreach_(S(),e)}foreach_(e,t){this.children.inorderTraversal((s,i)=>{i.foreach_(P(e,s),t)}),this.value&&t(e,this.value)}foreachChild(e){this.children.inorderTraversal((t,s)=>{s.value&&e(t,s.value)})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e){this.writeTree_=e}static empty(){return new K(new A(null))}}function Qe(n,e,t){if(C(e))return new K(new A(t));{const s=n.writeTree_.findRootMostValueAndPath(e);if(s!=null){const i=s.path;let r=s.value;const o=H(i,e);return r=r.updateChild(o,t),new K(n.writeTree_.set(i,r))}else{const i=new A(t),r=n.writeTree_.setTree(e,i);return new K(r)}}}function Nn(n,e,t){let s=n;return B(t,(i,r)=>{s=Qe(s,P(e,i),r)}),s}function li(n,e){if(C(e))return K.empty();{const t=n.writeTree_.setTree(e,new A(null));return new K(t)}}function Dn(n,e){return Ie(n,e)!=null}function Ie(n,e){const t=n.writeTree_.findRootMostValueAndPath(e);return t!=null?n.writeTree_.get(t.path).getChild(H(t.path,e)):null}function ci(n){const e=[],t=n.writeTree_.value;return t!=null?t.isLeafNode()||t.forEachChild(k,(s,i)=>{e.push(new I(s,i))}):n.writeTree_.children.inorderTraversal((s,i)=>{i.value!=null&&e.push(new I(s,i.value))}),e}function de(n,e){if(C(e))return n;{const t=Ie(n,e);return t!=null?new K(new A(t)):new K(n.writeTree_.subtree(e))}}function kn(n){return n.writeTree_.isEmpty()}function Pe(n,e){return Cr(S(),n.writeTree_,e)}function Cr(n,e,t){if(e.value!=null)return t.updateChild(n,e.value);{let s=null;return e.children.inorderTraversal((i,r)=>{i===".priority"?(m(r.value!==null,"Priority writes must always be leaf nodes"),s=r.value):t=Cr(P(n,i),r,t)}),!t.getChild(n).isEmpty()&&s!==null&&(t=t.updateChild(P(n,".priority"),s)),t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(n,e){return Rr(e,n)}function Ec(n,e,t,s,i){m(s>n.lastWriteId,"Stacking an older write on top of newer ones"),i===void 0&&(i=!0),n.allWrites.push({path:e,snap:t,writeId:s,visible:i}),i&&(n.visibleWrites=Qe(n.visibleWrites,e,t)),n.lastWriteId=s}function Cc(n,e,t,s){m(s>n.lastWriteId,"Stacking an older merge on top of newer ones"),n.allWrites.push({path:e,children:t,writeId:s,visible:!0}),n.visibleWrites=Nn(n.visibleWrites,e,t),n.lastWriteId=s}function Ic(n,e){for(let t=0;t<n.allWrites.length;t++){const s=n.allWrites[t];if(s.writeId===e)return s}return null}function Sc(n,e){const t=n.allWrites.findIndex(a=>a.writeId===e);m(t>=0,"removeWrite called with nonexistent writeId.");const s=n.allWrites[t];n.allWrites.splice(t,1);let i=s.visible,r=!1,o=n.allWrites.length-1;for(;i&&o>=0;){const a=n.allWrites[o];a.visible&&(o>=t&&Tc(a,s.path)?i=!1:G(s.path,a.path)&&(r=!0)),o--}if(i){if(r)return Rc(n),!0;if(s.snap)n.visibleWrites=li(n.visibleWrites,s.path);else{const a=s.children;B(a,l=>{n.visibleWrites=li(n.visibleWrites,P(s.path,l))})}return!0}else return!1}function Tc(n,e){if(n.snap)return G(n.path,e);for(const t in n.children)if(n.children.hasOwnProperty(t)&&G(P(n.path,t),e))return!0;return!1}function Rc(n){n.visibleWrites=Ir(n.allWrites,Ac,S()),n.allWrites.length>0?n.lastWriteId=n.allWrites[n.allWrites.length-1].writeId:n.lastWriteId=-1}function Ac(n){return n.visible}function Ir(n,e,t){let s=K.empty();for(let i=0;i<n.length;++i){const r=n[i];if(e(r)){const o=r.path;let a;if(r.snap)G(t,o)?(a=H(t,o),s=Qe(s,a,r.snap)):G(o,t)&&(a=H(o,t),s=Qe(s,S(),r.snap.getChild(a)));else if(r.children){if(G(t,o))a=H(t,o),s=Nn(s,a,r.children);else if(G(o,t))if(a=H(o,t),C(a))s=Nn(s,S(),r.children);else{const l=Ne(r.children,E(a));if(l){const c=l.getChild(D(a));s=Qe(s,S(),c)}}}else throw Le("WriteRecord should have .snap or .children")}}return s}function Sr(n,e,t,s,i){if(!s&&!i){const r=Ie(n.visibleWrites,e);if(r!=null)return r;{const o=de(n.visibleWrites,e);if(kn(o))return t;if(t==null&&!Dn(o,S()))return null;{const a=t||b.EMPTY_NODE;return Pe(o,a)}}}else{const r=de(n.visibleWrites,e);if(!i&&kn(r))return t;if(!i&&t==null&&!Dn(r,S()))return null;{const o=function(c){return(c.visible||i)&&(!s||!~s.indexOf(c.writeId))&&(G(c.path,e)||G(e,c.path))},a=Ir(n.allWrites,o,e),l=t||b.EMPTY_NODE;return Pe(a,l)}}}function Nc(n,e,t){let s=b.EMPTY_NODE;const i=Ie(n.visibleWrites,e);if(i)return i.isLeafNode()||i.forEachChild(k,(r,o)=>{s=s.updateImmediateChild(r,o)}),s;if(t){const r=de(n.visibleWrites,e);return t.forEachChild(k,(o,a)=>{const l=Pe(de(r,new R(o)),a);s=s.updateImmediateChild(o,l)}),ci(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}else{const r=de(n.visibleWrites,e);return ci(r).forEach(o=>{s=s.updateImmediateChild(o.name,o.node)}),s}}function Dc(n,e,t,s,i){m(s||i,"Either existingEventSnap or existingServerSnap must exist");const r=P(e,t);if(Dn(n.visibleWrites,r))return null;{const o=de(n.visibleWrites,r);return kn(o)?i.getChild(t):Pe(o,i.getChild(t))}}function kc(n,e,t,s){const i=P(e,t),r=Ie(n.visibleWrites,i);if(r!=null)return r;if(s.isCompleteForChild(t)){const o=de(n.visibleWrites,i);return Pe(o,s.getNode().getImmediateChild(t))}else return null}function Pc(n,e){return Ie(n.visibleWrites,e)}function Mc(n,e,t,s,i,r,o){let a;const l=de(n.visibleWrites,e),c=Ie(l,S());if(c!=null)a=c;else if(t!=null)a=Pe(l,t);else return[];if(a=a.withIndex(o),!a.isEmpty()&&!a.isLeafNode()){const d=[],u=o.getCompare(),h=r?a.getReverseIteratorFrom(s,o):a.getIteratorFrom(s,o);let f=h.getNext();for(;f&&d.length<i;)u(f,s)!==0&&d.push(f),f=h.getNext();return d}else return[]}function Lc(){return{visibleWrites:K.empty(),allWrites:[],lastWriteId:-1}}function Bt(n,e,t,s){return Sr(n.writeTree,n.treePath,e,t,s)}function rs(n,e){return Nc(n.writeTree,n.treePath,e)}function di(n,e,t,s){return Dc(n.writeTree,n.treePath,e,t,s)}function Ut(n,e){return Pc(n.writeTree,P(n.treePath,e))}function Oc(n,e,t,s,i,r){return Mc(n.writeTree,n.treePath,e,t,s,i,r)}function os(n,e,t){return kc(n.writeTree,n.treePath,e,t)}function Tr(n,e){return Rr(P(n.treePath,e),n.writeTree)}function Rr(n,e){return{treePath:n,writeTree:e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{constructor(){this.changeMap=new Map}trackChildChange(e){const t=e.type,s=e.childName;m(t==="child_added"||t==="child_changed"||t==="child_removed","Only child changes supported for tracking"),m(s!==".priority","Only non-priority child changes can be tracked.");const i=this.changeMap.get(s);if(i){const r=i.type;if(t==="child_added"&&r==="child_removed")this.changeMap.set(s,st(s,e.snapshotNode,i.snapshotNode));else if(t==="child_removed"&&r==="child_added")this.changeMap.delete(s);else if(t==="child_removed"&&r==="child_changed")this.changeMap.set(s,nt(s,i.oldSnap));else if(t==="child_changed"&&r==="child_added")this.changeMap.set(s,De(s,e.snapshotNode));else if(t==="child_changed"&&r==="child_changed")this.changeMap.set(s,st(s,e.snapshotNode,i.oldSnap));else throw Le("Illegal combination of changes: "+e+" occurred after "+i)}else this.changeMap.set(s,e)}getChanges(){return Array.from(this.changeMap.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $c{getCompleteChild(e){return null}getChildAfterChild(e,t,s){return null}}const Ar=new $c;class as{constructor(e,t,s=null){this.writes_=e,this.viewCache_=t,this.optCompleteServerCache_=s}getCompleteChild(e){const t=this.viewCache_.eventCache;if(t.isCompleteForChild(e))return t.getNode().getImmediateChild(e);{const s=this.optCompleteServerCache_!=null?new pe(this.optCompleteServerCache_,!0,!1):this.viewCache_.serverCache;return os(this.writes_,e,s)}}getChildAfterChild(e,t,s){const i=this.optCompleteServerCache_!=null?this.optCompleteServerCache_:xe(this.viewCache_),r=Oc(this.writes_,i,t,1,s,e);return r.length===0?null:r[0]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bc(n){return{filter:n}}function Uc(n,e){m(e.eventCache.getNode().isIndexed(n.filter.getIndex()),"Event snap not indexed"),m(e.serverCache.getNode().isIndexed(n.filter.getIndex()),"Server snap not indexed")}function Wc(n,e,t,s,i){const r=new Fc;let o,a;if(t.type===Y.OVERWRITE){const c=t;c.source.fromUser?o=Pn(n,e,c.path,c.snap,s,i,r):(m(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered()&&!C(c.path),o=Wt(n,e,c.path,c.snap,s,i,a,r))}else if(t.type===Y.MERGE){const c=t;c.source.fromUser?o=jc(n,e,c.path,c.children,s,i,r):(m(c.source.fromServer,"Unknown source."),a=c.source.tagged||e.serverCache.isFiltered(),o=Mn(n,e,c.path,c.children,s,i,a,r))}else if(t.type===Y.ACK_USER_WRITE){const c=t;c.revert?o=Gc(n,e,c.path,s,i,r):o=Vc(n,e,c.path,c.affectedTree,s,i,r)}else if(t.type===Y.LISTEN_COMPLETE)o=zc(n,e,t.path,s,r);else throw Le("Unknown operation type: "+t.type);const l=r.getChanges();return Hc(e,o,l),{viewCache:o,changes:l}}function Hc(n,e,t){const s=e.eventCache;if(s.isFullyInitialized()){const i=s.getNode().isLeafNode()||s.getNode().isEmpty(),r=$t(n);(t.length>0||!n.eventCache.isFullyInitialized()||i&&!s.getNode().equals(r)||!s.getNode().getPriority().equals(r.getPriority()))&&t.push(wr($t(e)))}}function Nr(n,e,t,s,i,r){const o=e.eventCache;if(Ut(s,t)!=null)return e;{let a,l;if(C(t))if(m(e.serverCache.isFullyInitialized(),"If change path is empty, we must have complete server data"),e.serverCache.isFiltered()){const c=xe(e),d=c instanceof b?c:b.EMPTY_NODE,u=rs(s,d);a=n.filter.updateFullNode(e.eventCache.getNode(),u,r)}else{const c=Bt(s,xe(e));a=n.filter.updateFullNode(e.eventCache.getNode(),c,r)}else{const c=E(t);if(c===".priority"){m(fe(t)===1,"Can't have a priority with additional path components");const d=o.getNode();l=e.serverCache.getNode();const u=di(s,t,d,l);u!=null?a=n.filter.updatePriority(d,u):a=o.getNode()}else{const d=D(t);let u;if(o.isCompleteForChild(c)){l=e.serverCache.getNode();const h=di(s,t,o.getNode(),l);h!=null?u=o.getNode().getImmediateChild(c).updateChild(d,h):u=o.getNode().getImmediateChild(c)}else u=os(s,c,e.serverCache);u!=null?a=n.filter.updateChild(o.getNode(),c,u,d,i,r):a=o.getNode()}}return qe(e,a,o.isFullyInitialized()||C(t),n.filter.filtersNodes())}}function Wt(n,e,t,s,i,r,o,a){const l=e.serverCache;let c;const d=o?n.filter:n.filter.getIndexedFilter();if(C(t))c=d.updateFullNode(l.getNode(),s,null);else if(d.filtersNodes()&&!l.isFiltered()){const f=l.getNode().updateChild(t,s);c=d.updateFullNode(l.getNode(),f,null)}else{const f=E(t);if(!l.isCompleteForPath(t)&&fe(t)>1)return e;const g=D(t),_=l.getNode().getImmediateChild(f).updateChild(g,s);f===".priority"?c=d.updatePriority(l.getNode(),_):c=d.updateChild(l.getNode(),f,_,g,Ar,null)}const u=Er(e,c,l.isFullyInitialized()||C(t),d.filtersNodes()),h=new as(i,u,r);return Nr(n,u,t,i,h,a)}function Pn(n,e,t,s,i,r,o){const a=e.eventCache;let l,c;const d=new as(i,e,r);if(C(t))c=n.filter.updateFullNode(e.eventCache.getNode(),s,o),l=qe(e,c,!0,n.filter.filtersNodes());else{const u=E(t);if(u===".priority")c=n.filter.updatePriority(e.eventCache.getNode(),s),l=qe(e,c,a.isFullyInitialized(),a.isFiltered());else{const h=D(t),f=a.getNode().getImmediateChild(u);let g;if(C(h))g=s;else{const w=d.getCompleteChild(u);w!=null?Yn(h)===".priority"&&w.getChild(fr(h)).isEmpty()?g=w:g=w.updateChild(h,s):g=b.EMPTY_NODE}if(f.equals(g))l=e;else{const w=n.filter.updateChild(a.getNode(),u,g,h,d,o);l=qe(e,w,a.isFullyInitialized(),n.filter.filtersNodes())}}}return l}function ui(n,e){return n.eventCache.isCompleteForChild(e)}function jc(n,e,t,s,i,r,o){let a=e;return s.foreach((l,c)=>{const d=P(t,l);ui(e,E(d))&&(a=Pn(n,a,d,c,i,r,o))}),s.foreach((l,c)=>{const d=P(t,l);ui(e,E(d))||(a=Pn(n,a,d,c,i,r,o))}),a}function hi(n,e,t){return t.foreach((s,i)=>{e=e.updateChild(s,i)}),e}function Mn(n,e,t,s,i,r,o,a){if(e.serverCache.getNode().isEmpty()&&!e.serverCache.isFullyInitialized())return e;let l=e,c;C(t)?c=s:c=new A(null).setTree(t,s);const d=e.serverCache.getNode();return c.children.inorderTraversal((u,h)=>{if(d.hasChild(u)){const f=e.serverCache.getNode().getImmediateChild(u),g=hi(n,f,h);l=Wt(n,l,new R(u),g,i,r,o,a)}}),c.children.inorderTraversal((u,h)=>{const f=!e.serverCache.isCompleteForChild(u)&&h.value===null;if(!d.hasChild(u)&&!f){const g=e.serverCache.getNode().getImmediateChild(u),w=hi(n,g,h);l=Wt(n,l,new R(u),w,i,r,o,a)}}),l}function Vc(n,e,t,s,i,r,o){if(Ut(i,t)!=null)return e;const a=e.serverCache.isFiltered(),l=e.serverCache;if(s.value!=null){if(C(t)&&l.isFullyInitialized()||l.isCompleteForPath(t))return Wt(n,e,t,l.getNode().getChild(t),i,r,a,o);if(C(t)){let c=new A(null);return l.getNode().forEachChild(ve,(d,u)=>{c=c.set(new R(d),u)}),Mn(n,e,t,c,i,r,a,o)}else return e}else{let c=new A(null);return s.foreach((d,u)=>{const h=P(t,d);l.isCompleteForPath(h)&&(c=c.set(d,l.getNode().getChild(h)))}),Mn(n,e,t,c,i,r,a,o)}}function zc(n,e,t,s,i){const r=e.serverCache,o=Er(e,r.getNode(),r.isFullyInitialized()||C(t),r.isFiltered());return Nr(n,o,t,s,Ar,i)}function Gc(n,e,t,s,i,r){let o;if(Ut(s,t)!=null)return e;{const a=new as(s,e,i),l=e.eventCache.getNode();let c;if(C(t)||E(t)===".priority"){let d;if(e.serverCache.isFullyInitialized())d=Bt(s,xe(e));else{const u=e.serverCache.getNode();m(u instanceof b,"serverChildren would be complete if leaf node"),d=rs(s,u)}d=d,c=n.filter.updateFullNode(l,d,r)}else{const d=E(t);let u=os(s,d,e.serverCache);u==null&&e.serverCache.isCompleteForChild(d)&&(u=l.getImmediateChild(d)),u!=null?c=n.filter.updateChild(l,d,u,D(t),a,r):e.eventCache.getNode().hasChild(d)?c=n.filter.updateChild(l,d,b.EMPTY_NODE,D(t),a,r):c=l,c.isEmpty()&&e.serverCache.isFullyInitialized()&&(o=Bt(s,xe(e)),o.isLeafNode()&&(c=n.filter.updateFullNode(c,o,r)))}return o=e.serverCache.isFullyInitialized()||Ut(s,S())!=null,qe(e,c,o,n.filter.filtersNodes())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qc{constructor(e,t){this.query_=e,this.eventRegistrations_=[];const s=this.query_._queryParams,i=new es(s.getIndex()),r=cc(s);this.processor_=Bc(r);const o=t.serverCache,a=t.eventCache,l=i.updateFullNode(b.EMPTY_NODE,o.getNode(),null),c=r.updateFullNode(b.EMPTY_NODE,a.getNode(),null),d=new pe(l,o.isFullyInitialized(),i.filtersNodes()),u=new pe(c,a.isFullyInitialized(),r.filtersNodes());this.viewCache_=Kt(u,d),this.eventGenerator_=new yc(this.query_)}get query(){return this.query_}}function Qc(n){return n.viewCache_.serverCache.getNode()}function Yc(n){return $t(n.viewCache_)}function Kc(n,e){const t=xe(n.viewCache_);return t&&(n.query._queryParams.loadsAllData()||!C(e)&&!t.getImmediateChild(E(e)).isEmpty())?t.getChild(e):null}function fi(n){return n.eventRegistrations_.length===0}function Xc(n,e){n.eventRegistrations_.push(e)}function pi(n,e,t){const s=[];if(t){m(e==null,"A cancel should cancel all event registrations.");const i=n.query._path;n.eventRegistrations_.forEach(r=>{const o=r.createCancelEvent(t,i);o&&s.push(o)})}if(e){let i=[];for(let r=0;r<n.eventRegistrations_.length;++r){const o=n.eventRegistrations_[r];if(!o.matches(e))i.push(o);else if(e.hasAnyCallback()){i=i.concat(n.eventRegistrations_.slice(r+1));break}}n.eventRegistrations_=i}else n.eventRegistrations_=[];return s}function mi(n,e,t,s){e.type===Y.MERGE&&e.source.queryId!==null&&(m(xe(n.viewCache_),"We should always have a full cache before handling merges"),m($t(n.viewCache_),"Missing event cache, even though we have a server cache"));const i=n.viewCache_,r=Wc(n.processor_,i,e,t,s);return Uc(n.processor_,r.viewCache),m(r.viewCache.serverCache.isFullyInitialized()||!i.serverCache.isFullyInitialized(),"Once a server snap is complete, it should never go back"),n.viewCache_=r.viewCache,Dr(n,r.changes,r.viewCache.eventCache.getNode(),null)}function Jc(n,e){const t=n.viewCache_.eventCache,s=[];return t.getNode().isLeafNode()||t.getNode().forEachChild(k,(r,o)=>{s.push(De(r,o))}),t.isFullyInitialized()&&s.push(wr(t.getNode())),Dr(n,s,t.getNode(),e)}function Dr(n,e,t,s){const i=s?[s]:n.eventRegistrations_;return vc(n.eventGenerator_,e,t,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ht;class kr{constructor(){this.views=new Map}}function Zc(n){m(!Ht,"__referenceConstructor has already been defined"),Ht=n}function ed(){return m(Ht,"Reference.ts has not been loaded"),Ht}function td(n){return n.views.size===0}function ls(n,e,t,s){const i=e.source.queryId;if(i!==null){const r=n.views.get(i);return m(r!=null,"SyncTree gave us an op for an invalid query."),mi(r,e,t,s)}else{let r=[];for(const o of n.views.values())r=r.concat(mi(o,e,t,s));return r}}function Pr(n,e,t,s,i){const r=e._queryIdentifier,o=n.views.get(r);if(!o){let a=Bt(t,i?s:null),l=!1;a?l=!0:s instanceof b?(a=rs(t,s),l=!1):(a=b.EMPTY_NODE,l=!1);const c=Kt(new pe(a,l,!1),new pe(s,i,!1));return new qc(e,c)}return o}function nd(n,e,t,s,i,r){const o=Pr(n,e,s,i,r);return n.views.has(e._queryIdentifier)||n.views.set(e._queryIdentifier,o),Xc(o,t),Jc(o,t)}function sd(n,e,t,s){const i=e._queryIdentifier,r=[];let o=[];const a=me(n);if(i==="default")for(const[l,c]of n.views.entries())o=o.concat(pi(c,t,s)),fi(c)&&(n.views.delete(l),c.query._queryParams.loadsAllData()||r.push(c.query));else{const l=n.views.get(i);l&&(o=o.concat(pi(l,t,s)),fi(l)&&(n.views.delete(i),l.query._queryParams.loadsAllData()||r.push(l.query)))}return a&&!me(n)&&r.push(new(ed())(e._repo,e._path)),{removed:r,events:o}}function Mr(n){const e=[];for(const t of n.views.values())t.query._queryParams.loadsAllData()||e.push(t);return e}function ue(n,e){let t=null;for(const s of n.views.values())t=t||Kc(s,e);return t}function Lr(n,e){if(e._queryParams.loadsAllData())return Jt(n);{const s=e._queryIdentifier;return n.views.get(s)}}function Or(n,e){return Lr(n,e)!=null}function me(n){return Jt(n)!=null}function Jt(n){for(const e of n.views.values())if(e.query._queryParams.loadsAllData())return e;return null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let jt;function id(n){m(!jt,"__referenceConstructor has already been defined"),jt=n}function rd(){return m(jt,"Reference.ts has not been loaded"),jt}let od=1;class gi{constructor(e){this.listenProvider_=e,this.syncPointTree_=new A(null),this.pendingWriteTree_=Lc(),this.tagToQueryMap=new Map,this.queryToTagMap=new Map}}function Fr(n,e,t,s,i){return Ec(n.pendingWriteTree_,e,t,s,i),i?Fe(n,new we(ns(),e,t)):[]}function ad(n,e,t,s){Cc(n.pendingWriteTree_,e,t,s);const i=A.fromObject(t);return Fe(n,new ke(ns(),e,i))}function oe(n,e,t=!1){const s=Ic(n.pendingWriteTree_,e);if(Sc(n.pendingWriteTree_,e)){let r=new A(null);return s.snap!=null?r=r.set(S(),!0):B(s.children,o=>{r=r.set(new R(o),!0)}),Fe(n,new Ft(s.path,r,t))}else return[]}function mt(n,e,t){return Fe(n,new we(ss(),e,t))}function ld(n,e,t){const s=A.fromObject(t);return Fe(n,new ke(ss(),e,s))}function cd(n,e){return Fe(n,new rt(ss(),e))}function dd(n,e,t){const s=ds(n,t);if(s){const i=us(s),r=i.path,o=i.queryId,a=H(r,e),l=new rt(is(o),a);return hs(n,r,l)}else return[]}function Vt(n,e,t,s,i=!1){const r=e._path,o=n.syncPointTree_.get(r);let a=[];if(o&&(e._queryIdentifier==="default"||Or(o,e))){const l=sd(o,e,t,s);td(o)&&(n.syncPointTree_=n.syncPointTree_.remove(r));const c=l.removed;if(a=l.events,!i){const d=c.findIndex(h=>h._queryParams.loadsAllData())!==-1,u=n.syncPointTree_.findOnPath(r,(h,f)=>me(f));if(d&&!u){const h=n.syncPointTree_.subtree(r);if(!h.isEmpty()){const f=fd(h);for(let g=0;g<f.length;++g){const w=f[g],_=w.query,x=Wr(n,w);n.listenProvider_.startListening(Ye(_),ot(n,_),x.hashFn,x.onComplete)}}}!u&&c.length>0&&!s&&(d?n.listenProvider_.stopListening(Ye(e),null):c.forEach(h=>{const f=n.queryToTagMap.get(Zt(h));n.listenProvider_.stopListening(Ye(h),f)}))}pd(n,c)}return a}function $r(n,e,t,s){const i=ds(n,s);if(i!=null){const r=us(i),o=r.path,a=r.queryId,l=H(o,e),c=new we(is(a),l,t);return hs(n,o,c)}else return[]}function ud(n,e,t,s){const i=ds(n,s);if(i){const r=us(i),o=r.path,a=r.queryId,l=H(o,e),c=A.fromObject(t),d=new ke(is(a),l,c);return hs(n,o,d)}else return[]}function Ln(n,e,t,s=!1){const i=e._path;let r=null,o=!1;n.syncPointTree_.foreachOnPath(i,(h,f)=>{const g=H(h,i);r=r||ue(f,g),o=o||me(f)});let a=n.syncPointTree_.get(i);a?(o=o||me(a),r=r||ue(a,S())):(a=new kr,n.syncPointTree_=n.syncPointTree_.set(i,a));let l;r!=null?l=!0:(l=!1,r=b.EMPTY_NODE,n.syncPointTree_.subtree(i).foreachChild((f,g)=>{const w=ue(g,S());w&&(r=r.updateImmediateChild(f,w))}));const c=Or(a,e);if(!c&&!e._queryParams.loadsAllData()){const h=Zt(e);m(!n.queryToTagMap.has(h),"View does not exist, but we have a tag");const f=md();n.queryToTagMap.set(h,f),n.tagToQueryMap.set(f,h)}const d=Xt(n.pendingWriteTree_,i);let u=nd(a,e,t,d,r,l);if(!c&&!o&&!s){const h=Lr(a,e);u=u.concat(gd(n,e,h))}return u}function cs(n,e,t){const i=n.pendingWriteTree_,r=n.syncPointTree_.findOnPath(e,(o,a)=>{const l=H(o,e),c=ue(a,l);if(c)return c});return Sr(i,e,r,t,!0)}function hd(n,e){const t=e._path;let s=null;n.syncPointTree_.foreachOnPath(t,(c,d)=>{const u=H(c,t);s=s||ue(d,u)});let i=n.syncPointTree_.get(t);i?s=s||ue(i,S()):(i=new kr,n.syncPointTree_=n.syncPointTree_.set(t,i));const r=s!=null,o=r?new pe(s,!0,!1):null,a=Xt(n.pendingWriteTree_,e._path),l=Pr(i,e,a,r?o.getNode():b.EMPTY_NODE,r);return Yc(l)}function Fe(n,e){return Br(e,n.syncPointTree_,null,Xt(n.pendingWriteTree_,S()))}function Br(n,e,t,s){if(C(n.path))return Ur(n,e,t,s);{const i=e.get(S());t==null&&i!=null&&(t=ue(i,S()));let r=[];const o=E(n.path),a=n.operationForChild(o),l=e.children.get(o);if(l&&a){const c=t?t.getImmediateChild(o):null,d=Tr(s,o);r=r.concat(Br(a,l,c,d))}return i&&(r=r.concat(ls(i,n,s,t))),r}}function Ur(n,e,t,s){const i=e.get(S());t==null&&i!=null&&(t=ue(i,S()));let r=[];return e.children.inorderTraversal((o,a)=>{const l=t?t.getImmediateChild(o):null,c=Tr(s,o),d=n.operationForChild(o);d&&(r=r.concat(Ur(d,a,l,c)))}),i&&(r=r.concat(ls(i,n,s,t))),r}function Wr(n,e){const t=e.query,s=ot(n,t);return{hashFn:()=>(Qc(e)||b.EMPTY_NODE).hash(),onComplete:i=>{if(i==="ok")return s?dd(n,t._path,s):cd(n,t._path);{const r=cl(i,t);return Vt(n,t,null,r)}}}}function ot(n,e){const t=Zt(e);return n.queryToTagMap.get(t)}function Zt(n){return n._path.toString()+"$"+n._queryIdentifier}function ds(n,e){return n.tagToQueryMap.get(e)}function us(n){const e=n.indexOf("$");return m(e!==-1&&e<n.length-1,"Bad queryKey."),{queryId:n.substr(e+1),path:new R(n.substr(0,e))}}function hs(n,e,t){const s=n.syncPointTree_.get(e);m(s,"Missing sync point for query tag that we're tracking");const i=Xt(n.pendingWriteTree_,e);return ls(s,t,i,null)}function fd(n){return n.fold((e,t,s)=>{if(t&&me(t))return[Jt(t)];{let i=[];return t&&(i=Mr(t)),B(s,(r,o)=>{i=i.concat(o)}),i}})}function Ye(n){return n._queryParams.loadsAllData()&&!n._queryParams.isDefault()?new(rd())(n._repo,n._path):n}function pd(n,e){for(let t=0;t<e.length;++t){const s=e[t];if(!s._queryParams.loadsAllData()){const i=Zt(s),r=n.queryToTagMap.get(i);n.queryToTagMap.delete(i),n.tagToQueryMap.delete(r)}}}function md(){return od++}function gd(n,e,t){const s=e._path,i=ot(n,e),r=Wr(n,t),o=n.listenProvider_.startListening(Ye(e),i,r.hashFn,r.onComplete),a=n.syncPointTree_.subtree(s);if(i)m(!me(a.value),"If we're adding a query, it shouldn't be shadowed");else{const l=a.fold((c,d,u)=>{if(!C(c)&&d&&me(d))return[Jt(d).query];{let h=[];return d&&(h=h.concat(Mr(d).map(f=>f.query))),B(u,(f,g)=>{h=h.concat(g)}),h}});for(let c=0;c<l.length;++c){const d=l[c];n.listenProvider_.stopListening(Ye(d),ot(n,d))}}return o}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fs{constructor(e){this.node_=e}getImmediateChild(e){const t=this.node_.getImmediateChild(e);return new fs(t)}node(){return this.node_}}class ps{constructor(e,t){this.syncTree_=e,this.path_=t}getImmediateChild(e){const t=P(this.path_,e);return new ps(this.syncTree_,t)}node(){return cs(this.syncTree_,this.path_)}}const _d=function(n){return n=n||{},n.timestamp=n.timestamp||new Date().getTime(),n},_i=function(n,e,t){if(!n||typeof n!="object")return n;if(m(".sv"in n,"Unexpected leaf node or priority contents"),typeof n[".sv"]=="string")return yd(n[".sv"],e,t);if(typeof n[".sv"]=="object")return vd(n[".sv"],e);m(!1,"Unexpected server value: "+JSON.stringify(n,null,2))},yd=function(n,e,t){switch(n){case"timestamp":return t.timestamp;default:m(!1,"Unexpected server value: "+n)}},vd=function(n,e,t){n.hasOwnProperty("increment")||m(!1,"Unexpected server value: "+JSON.stringify(n,null,2));const s=n.increment;typeof s!="number"&&m(!1,"Unexpected increment value: "+s);const i=e.node();if(m(i!==null&&typeof i<"u","Expected ChildrenNode.EMPTY_NODE for nulls"),!i.isLeafNode())return s;const o=i.getValue();return typeof o!="number"?s:o+s},Hr=function(n,e,t,s){return ms(e,new ps(t,n),s)},jr=function(n,e,t){return ms(n,new fs(e),t)};function ms(n,e,t){const s=n.getPriority().val(),i=_i(s,e.getImmediateChild(".priority"),t);let r;if(n.isLeafNode()){const o=n,a=_i(o.getValue(),e,t);return a!==o.getValue()||i!==o.getPriority().val()?new O(a,M(i)):n}else{const o=n;return r=o,i!==o.getPriority().val()&&(r=r.updatePriority(new O(i))),o.forEachChild(k,(a,l)=>{const c=ms(l,e.getImmediateChild(a),t);c!==l&&(r=r.updateImmediateChild(a,c))}),r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gs{constructor(e="",t=null,s={children:{},childCount:0}){this.name=e,this.parent=t,this.node=s}}function _s(n,e){let t=e instanceof R?e:new R(e),s=n,i=E(t);for(;i!==null;){const r=Ne(s.node.children,i)||{children:{},childCount:0};s=new gs(i,s,r),t=D(t),i=E(t)}return s}function $e(n){return n.node.value}function Vr(n,e){n.node.value=e,On(n)}function zr(n){return n.node.childCount>0}function bd(n){return $e(n)===void 0&&!zr(n)}function en(n,e){B(n.node.children,(t,s)=>{e(new gs(t,n,s))})}function Gr(n,e,t,s){t&&e(n),en(n,i=>{Gr(i,e,!0)})}function wd(n,e,t){let s=n.parent;for(;s!==null;){if(e(s))return!0;s=s.parent}return!1}function gt(n){return new R(n.parent===null?n.name:gt(n.parent)+"/"+n.name)}function On(n){n.parent!==null&&xd(n.parent,n.name,n)}function xd(n,e,t){const s=bd(t),i=J(n.node.children,e);s&&i?(delete n.node.children[e],n.node.childCount--,On(n)):!s&&!i&&(n.node.children[e]=t.node,n.node.childCount++,On(n))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed=/[\[\].#$\/\u0000-\u001F\u007F]/,Cd=/[\[\].#$\u0000-\u001F\u007F]/,gn=10*1024*1024,ys=function(n){return typeof n=="string"&&n.length!==0&&!Ed.test(n)},qr=function(n){return typeof n=="string"&&n.length!==0&&!Cd.test(n)},Id=function(n){return n&&(n=n.replace(/^\/*\.info(\/|$)/,"/")),qr(n)},Fn=function(n){return n===null||typeof n=="string"||typeof n=="number"&&!Vn(n)||n&&typeof n=="object"&&J(n,".sv")},Sd=function(n,e,t,s){tn(qt(n,"value"),e,t)},tn=function(n,e,t){const s=t instanceof R?new jl(t,n):t;if(e===void 0)throw new Error(n+"contains undefined "+_e(s));if(typeof e=="function")throw new Error(n+"contains a function "+_e(s)+" with contents = "+e.toString());if(Vn(e))throw new Error(n+"contains "+e.toString()+" "+_e(s));if(typeof e=="string"&&e.length>gn/3&&Qt(e)>gn)throw new Error(n+"contains a string greater than "+gn+" utf8 bytes "+_e(s)+" ('"+e.substring(0,50)+"...')");if(e&&typeof e=="object"){let i=!1,r=!1;if(B(e,(o,a)=>{if(o===".value")i=!0;else if(o!==".priority"&&o!==".sv"&&(r=!0,!ys(o)))throw new Error(n+" contains an invalid key ("+o+") "+_e(s)+`.  Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`);Vl(s,o),tn(n,a,s),zl(s)}),i&&r)throw new Error(n+' contains ".value" child '+_e(s)+" in addition to actual children.")}},Td=function(n,e){let t,s;for(t=0;t<e.length;t++){s=e[t];const r=tt(s);for(let o=0;o<r.length;o++)if(!(r[o]===".priority"&&o===r.length-1)){if(!ys(r[o]))throw new Error(n+"contains an invalid key ("+r[o]+") in path "+s.toString()+`. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"`)}}e.sort(Hl);let i=null;for(t=0;t<e.length;t++){if(s=e[t],i!==null&&G(i,s))throw new Error(n+"contains a path "+i.toString()+" that is ancestor of another path "+s.toString());i=s}},Rd=function(n,e,t,s){const i=qt(n,"values");if(!(e&&typeof e=="object")||Array.isArray(e))throw new Error(i+" must be an object containing the children to replace.");const r=[];B(e,(o,a)=>{const l=new R(o);if(tn(i,a,P(t,l)),Yn(l)===".priority"&&!Fn(a))throw new Error(i+"contains an invalid value for '"+l.toString()+"', which must be a valid Firebase priority (a string, finite number, server value, or null).");r.push(l)}),Td(i,r)},vs=function(n,e,t,s){if(!qr(t))throw new Error(qt(n,e)+'was an invalid path = "'+t+`". Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"`)},Ad=function(n,e,t,s){t&&(t=t.replace(/^\/*\.info(\/|$)/,"/")),vs(n,e,t)},Qr=function(n,e){if(E(e)===".info")throw new Error(n+" failed = Can't modify data under /.info/")},Nd=function(n,e){const t=e.path.toString();if(typeof e.repoInfo.host!="string"||e.repoInfo.host.length===0||!ys(e.repoInfo.namespace)&&e.repoInfo.host.split(":")[0]!=="localhost"||t.length!==0&&!Id(t))throw new Error(qt(n,"url")+`must be a valid firebase URL and the path can't contain ".", "#", "$", "[", or "]".`)};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(){this.eventLists_=[],this.recursionDepth_=0}}function nn(n,e){let t=null;for(let s=0;s<e.length;s++){const i=e[s],r=i.getPath();t!==null&&!Kn(r,t.path)&&(n.eventLists_.push(t),t=null),t===null&&(t={events:[],path:r}),t.events.push(i)}t&&n.eventLists_.push(t)}function Yr(n,e,t){nn(n,t),Kr(n,s=>Kn(s,e))}function q(n,e,t){nn(n,t),Kr(n,s=>G(s,e)||G(e,s))}function Kr(n,e){n.recursionDepth_++;let t=!0;for(let s=0;s<n.eventLists_.length;s++){const i=n.eventLists_[s];if(i){const r=i.path;e(r)?(kd(n.eventLists_[s]),n.eventLists_[s]=null):t=!1}}t&&(n.eventLists_=[]),n.recursionDepth_--}function kd(n){for(let e=0;e<n.events.length;e++){const t=n.events[e];if(t!==null){n.events[e]=null;const s=t.getEventRunner();ze&&$("event: "+t.toString()),Oe(s)}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pd="repo_interrupt",Md=25;class Ld{constructor(e,t,s,i){this.repoInfo_=e,this.forceRestClient_=t,this.authTokenProvider_=s,this.appCheckProvider_=i,this.dataUpdateCount=0,this.statsListener_=null,this.eventQueue_=new Dd,this.nextWriteId_=1,this.interceptServerDataCallback_=null,this.onDisconnect_=Ot(),this.transactionQueueTree_=new gs,this.persistentConnection_=null,this.key=this.repoInfo_.toURLString()}toString(){return(this.repoInfo_.secure?"https://":"http://")+this.repoInfo_.host}}function Od(n,e,t){if(n.stats_=qn(n.repoInfo_),n.forceRestClient_||fl())n.server_=new Lt(n.repoInfo_,(s,i,r,o)=>{yi(n,s,i,r,o)},n.authTokenProvider_,n.appCheckProvider_),setTimeout(()=>vi(n,!0),0);else{if(typeof t<"u"&&t!==null){if(typeof t!="object")throw new Error("Only objects are supported for option databaseAuthVariableOverride");try{L(t)}catch(s){throw new Error("Invalid authOverride provided: "+s)}}n.persistentConnection_=new te(n.repoInfo_,e,(s,i,r,o)=>{yi(n,s,i,r,o)},s=>{vi(n,s)},s=>{$d(n,s)},n.authTokenProvider_,n.appCheckProvider_,t),n.server_=n.persistentConnection_}n.authTokenProvider_.addTokenChangeListener(s=>{n.server_.refreshAuthToken(s)}),n.appCheckProvider_.addTokenChangeListener(s=>{n.server_.refreshAppCheckToken(s.token)}),n.statsReporter_=yl(n.repoInfo_,()=>new _c(n.stats_,n.server_)),n.infoData_=new hc,n.infoSyncTree_=new gi({startListening:(s,i,r,o)=>{let a=[];const l=n.infoData_.getNode(s._path);return l.isEmpty()||(a=mt(n.infoSyncTree_,s._path,l),setTimeout(()=>{o("ok")},0)),a},stopListening:()=>{}}),bs(n,"connected",!1),n.serverSyncTree_=new gi({startListening:(s,i,r,o)=>(n.server_.listen(s,r,i,(a,l)=>{const c=o(a,l);q(n.eventQueue_,s._path,c)}),[]),stopListening:(s,i)=>{n.server_.unlisten(s,i)}})}function Fd(n){const t=n.infoData_.getNode(new R(".info/serverTimeOffset")).val()||0;return new Date().getTime()+t}function sn(n){return _d({timestamp:Fd(n)})}function yi(n,e,t,s,i){n.dataUpdateCount++;const r=new R(e);t=n.interceptServerDataCallback_?n.interceptServerDataCallback_(e,t):t;let o=[];if(i)if(s){const l=Nt(t,c=>M(c));o=ud(n.serverSyncTree_,r,l,i)}else{const l=M(t);o=$r(n.serverSyncTree_,r,l,i)}else if(s){const l=Nt(t,c=>M(c));o=ld(n.serverSyncTree_,r,l)}else{const l=M(t);o=mt(n.serverSyncTree_,r,l)}let a=r;o.length>0&&(a=Me(n,r)),q(n.eventQueue_,a,o)}function vi(n,e){bs(n,"connected",e),e===!1&&Hd(n)}function $d(n,e){B(e,(t,s)=>{bs(n,t,s)})}function bs(n,e,t){const s=new R("/.info/"+e),i=M(t);n.infoData_.updateSnapshot(s,i);const r=mt(n.infoSyncTree_,s,i);q(n.eventQueue_,s,r)}function ws(n){return n.nextWriteId_++}function Bd(n,e,t){const s=hd(n.serverSyncTree_,e);return s!=null?Promise.resolve(s):n.server_.get(e).then(i=>{const r=M(i).withIndex(e._queryParams.getIndex());Ln(n.serverSyncTree_,e,t,!0);let o;if(e._queryParams.loadsAllData())o=mt(n.serverSyncTree_,e._path,r);else{const a=ot(n.serverSyncTree_,e);o=$r(n.serverSyncTree_,e._path,r,a)}return q(n.eventQueue_,e._path,o),Vt(n.serverSyncTree_,e,t,null,!0),r},i=>(_t(n,"get for query "+L(e)+" failed: "+i),Promise.reject(new Error(i))))}function Ud(n,e,t,s,i){_t(n,"set",{path:e.toString(),value:t,priority:s});const r=sn(n),o=M(t,s),a=cs(n.serverSyncTree_,e),l=jr(o,a,r),c=ws(n),d=Fr(n.serverSyncTree_,e,l,c,!0);nn(n.eventQueue_,d),n.server_.put(e.toString(),o.val(!0),(h,f)=>{const g=h==="ok";g||j("set at "+e+" failed: "+h);const w=oe(n.serverSyncTree_,c,!g);q(n.eventQueue_,e,w),$n(n,i,h,f)});const u=Es(n,e);Me(n,u),q(n.eventQueue_,u,[])}function Wd(n,e,t,s){_t(n,"update",{path:e.toString(),value:t});let i=!0;const r=sn(n),o={};if(B(t,(a,l)=>{i=!1,o[a]=Hr(P(e,a),M(l),n.serverSyncTree_,r)}),i)$("update() called with empty data.  Don't do anything."),$n(n,s,"ok",void 0);else{const a=ws(n),l=ad(n.serverSyncTree_,e,o,a);nn(n.eventQueue_,l),n.server_.merge(e.toString(),t,(c,d)=>{const u=c==="ok";u||j("update at "+e+" failed: "+c);const h=oe(n.serverSyncTree_,a,!u),f=h.length>0?Me(n,e):e;q(n.eventQueue_,f,h),$n(n,s,c,d)}),B(t,c=>{const d=Es(n,P(e,c));Me(n,d)}),q(n.eventQueue_,e,[])}}function Hd(n){_t(n,"onDisconnectEvents");const e=sn(n),t=Ot();An(n.onDisconnect_,S(),(i,r)=>{const o=Hr(i,r,n.serverSyncTree_,e);xr(t,i,o)});let s=[];An(t,S(),(i,r)=>{s=s.concat(mt(n.serverSyncTree_,i,r));const o=Es(n,i);Me(n,o)}),n.onDisconnect_=Ot(),q(n.eventQueue_,S(),s)}function jd(n,e,t){let s;E(e._path)===".info"?s=Ln(n.infoSyncTree_,e,t):s=Ln(n.serverSyncTree_,e,t),Yr(n.eventQueue_,e._path,s)}function bi(n,e,t){let s;E(e._path)===".info"?s=Vt(n.infoSyncTree_,e,t):s=Vt(n.serverSyncTree_,e,t),Yr(n.eventQueue_,e._path,s)}function Vd(n){n.persistentConnection_&&n.persistentConnection_.interrupt(Pd)}function _t(n,...e){let t="";n.persistentConnection_&&(t=n.persistentConnection_.id+":"),$(t,...e)}function $n(n,e,t,s){e&&Oe(()=>{if(t==="ok")e(null);else{const i=(t||"error").toUpperCase();let r=i;s&&(r+=": "+s);const o=new Error(r);o.code=i,e(o)}})}function Xr(n,e,t){return cs(n.serverSyncTree_,e,t)||b.EMPTY_NODE}function xs(n,e=n.transactionQueueTree_){if(e||rn(n,e),$e(e)){const t=Zr(n,e);m(t.length>0,"Sending zero length transaction queue"),t.every(i=>i.status===0)&&zd(n,gt(e),t)}else zr(e)&&en(e,t=>{xs(n,t)})}function zd(n,e,t){const s=t.map(c=>c.currentWriteId),i=Xr(n,e,s);let r=i;const o=i.hash();for(let c=0;c<t.length;c++){const d=t[c];m(d.status===0,"tryToSendTransactionQueue_: items in queue should all be run."),d.status=1,d.retryCount++;const u=H(e,d.path);r=r.updateChild(u,d.currentOutputSnapshotRaw)}const a=r.val(!0),l=e;n.server_.put(l.toString(),a,c=>{_t(n,"transaction put response",{path:l.toString(),status:c});let d=[];if(c==="ok"){const u=[];for(let h=0;h<t.length;h++)t[h].status=2,d=d.concat(oe(n.serverSyncTree_,t[h].currentWriteId)),t[h].onComplete&&u.push(()=>t[h].onComplete(null,!0,t[h].currentOutputSnapshotResolved)),t[h].unwatcher();rn(n,_s(n.transactionQueueTree_,e)),xs(n,n.transactionQueueTree_),q(n.eventQueue_,e,d);for(let h=0;h<u.length;h++)Oe(u[h])}else{if(c==="datastale")for(let u=0;u<t.length;u++)t[u].status===3?t[u].status=4:t[u].status=0;else{j("transaction at "+l.toString()+" failed: "+c);for(let u=0;u<t.length;u++)t[u].status=4,t[u].abortReason=c}Me(n,e)}},o)}function Me(n,e){const t=Jr(n,e),s=gt(t),i=Zr(n,t);return Gd(n,i,s),s}function Gd(n,e,t){if(e.length===0)return;const s=[];let i=[];const o=e.filter(a=>a.status===0).map(a=>a.currentWriteId);for(let a=0;a<e.length;a++){const l=e[a],c=H(t,l.path);let d=!1,u;if(m(c!==null,"rerunTransactionsUnderNode_: relativePath should not be null."),l.status===4)d=!0,u=l.abortReason,i=i.concat(oe(n.serverSyncTree_,l.currentWriteId,!0));else if(l.status===0)if(l.retryCount>=Md)d=!0,u="maxretry",i=i.concat(oe(n.serverSyncTree_,l.currentWriteId,!0));else{const h=Xr(n,l.path,o);l.currentInputSnapshot=h;const f=e[a].update(h.val());if(f!==void 0){tn("transaction failed: Data returned ",f,l.path);let g=M(f);typeof f=="object"&&f!=null&&J(f,".priority")||(g=g.updatePriority(h.getPriority()));const _=l.currentWriteId,x=sn(n),p=jr(g,h,x);l.currentOutputSnapshotRaw=g,l.currentOutputSnapshotResolved=p,l.currentWriteId=ws(n),o.splice(o.indexOf(_),1),i=i.concat(Fr(n.serverSyncTree_,l.path,p,l.currentWriteId,l.applyLocally)),i=i.concat(oe(n.serverSyncTree_,_,!0))}else d=!0,u="nodata",i=i.concat(oe(n.serverSyncTree_,l.currentWriteId,!0))}q(n.eventQueue_,t,i),i=[],d&&(e[a].status=2,function(h){setTimeout(h,Math.floor(0))}(e[a].unwatcher),e[a].onComplete&&(u==="nodata"?s.push(()=>e[a].onComplete(null,!1,e[a].currentInputSnapshot)):s.push(()=>e[a].onComplete(new Error(u),!1,null))))}rn(n,n.transactionQueueTree_);for(let a=0;a<s.length;a++)Oe(s[a]);xs(n,n.transactionQueueTree_)}function Jr(n,e){let t,s=n.transactionQueueTree_;for(t=E(e);t!==null&&$e(s)===void 0;)s=_s(s,t),e=D(e),t=E(e);return s}function Zr(n,e){const t=[];return eo(n,e,t),t.sort((s,i)=>s.order-i.order),t}function eo(n,e,t){const s=$e(e);if(s)for(let i=0;i<s.length;i++)t.push(s[i]);en(e,i=>{eo(n,i,t)})}function rn(n,e){const t=$e(e);if(t){let s=0;for(let i=0;i<t.length;i++)t[i].status!==2&&(t[s]=t[i],s++);t.length=s,Vr(e,t.length>0?t:void 0)}en(e,s=>{rn(n,s)})}function Es(n,e){const t=gt(Jr(n,e)),s=_s(n.transactionQueueTree_,e);return wd(s,i=>{_n(n,i)}),_n(n,s),Gr(s,i=>{_n(n,i)}),t}function _n(n,e){const t=$e(e);if(t){const s=[];let i=[],r=-1;for(let o=0;o<t.length;o++)t[o].status===3||(t[o].status===1?(m(r===o-1,"All SENT items should be at beginning of queue."),r=o,t[o].status=3,t[o].abortReason="set"):(m(t[o].status===0,"Unexpected transaction status in abort"),t[o].unwatcher(),i=i.concat(oe(n.serverSyncTree_,t[o].currentWriteId,!0)),t[o].onComplete&&s.push(t[o].onComplete.bind(null,new Error("set"),!1,null))));r===-1?Vr(e,void 0):t.length=r+1,q(n.eventQueue_,gt(e),i);for(let o=0;o<s.length;o++)Oe(s[o])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qd(n){let e="";const t=n.split("/");for(let s=0;s<t.length;s++)if(t[s].length>0){let i=t[s];try{i=decodeURIComponent(i.replace(/\+/g," "))}catch{}e+="/"+i}return e}function Qd(n){const e={};n.charAt(0)==="?"&&(n=n.substring(1));for(const t of n.split("&")){if(t.length===0)continue;const s=t.split("=");s.length===2?e[decodeURIComponent(s[0])]=decodeURIComponent(s[1]):j(`Invalid query segment '${t}' in query '${n}'`)}return e}const wi=function(n,e){const t=Yd(n),s=t.namespace;t.domain==="firebase.com"&&se(t.host+" is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"),(!s||s==="undefined")&&t.domain!=="localhost"&&se("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"),t.secure||il();const i=t.scheme==="ws"||t.scheme==="wss";return{repoInfo:new ir(t.host,t.secure,s,i,e,"",s!==t.subdomain),path:new R(t.pathString)}},Yd=function(n){let e="",t="",s="",i="",r="",o=!0,a="https",l=443;if(typeof n=="string"){let c=n.indexOf("//");c>=0&&(a=n.substring(0,c-1),n=n.substring(c+2));let d=n.indexOf("/");d===-1&&(d=n.length);let u=n.indexOf("?");u===-1&&(u=n.length),e=n.substring(0,Math.min(d,u)),d<u&&(i=qd(n.substring(d,u)));const h=Qd(n.substring(Math.min(n.length,u)));c=e.indexOf(":"),c>=0?(o=a==="https"||a==="wss",l=parseInt(e.substring(c+1),10)):c=e.length;const f=e.slice(0,c);if(f.toLowerCase()==="localhost")t="localhost";else if(f.split(".").length<=2)t=f;else{const g=e.indexOf(".");s=e.substring(0,g).toLowerCase(),t=e.substring(g+1),r=s}"ns"in h&&(r=h.ns)}return{host:e,port:l,domain:t,subdomain:s,secure:o,scheme:a,pathString:i,namespace:r}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kd{constructor(e,t,s,i){this.eventType=e,this.eventRegistration=t,this.snapshot=s,this.prevName=i}getPath(){const e=this.snapshot.ref;return this.eventType==="value"?e._path:e.parent._path}getEventType(){return this.eventType}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.getPath().toString()+":"+this.eventType+":"+L(this.snapshot.exportVal())}}class Xd{constructor(e,t,s){this.eventRegistration=e,this.error=t,this.path=s}getPath(){return this.path}getEventType(){return"cancel"}getEventRunner(){return this.eventRegistration.getEventRunner(this)}toString(){return this.path.toString()+":cancel"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(e,t){this.snapshotCallback=e,this.cancelCallback=t}onValue(e,t){this.snapshotCallback.call(null,e,t)}onCancel(e){return m(this.hasCancelCallback,"Raising a cancel event on a listener with no cancel callback"),this.cancelCallback.call(null,e)}get hasCancelCallback(){return!!this.cancelCallback}matches(e){return this.snapshotCallback===e.snapshotCallback||this.snapshotCallback.userCallback!==void 0&&this.snapshotCallback.userCallback===e.snapshotCallback.userCallback&&this.snapshotCallback.context===e.snapshotCallback.context}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,t,s,i){this._repo=e,this._path=t,this._queryParams=s,this._orderByCalled=i}get key(){return C(this._path)?null:Yn(this._path)}get ref(){return new ie(this._repo,this._path)}get _queryIdentifier(){const e=oi(this._queryParams),t=zn(e);return t==="{}"?"default":t}get _queryObject(){return oi(this._queryParams)}isEqual(e){if(e=Ee(e),!(e instanceof yt))return!1;const t=this._repo===e._repo,s=Kn(this._path,e._path),i=this._queryIdentifier===e._queryIdentifier;return t&&s&&i}toJSON(){return this.toString()}toString(){return this._repo.toString()+Wl(this._path)}}function Jd(n,e){if(n._orderByCalled===!0)throw new Error(e+": You can't combine multiple orderBy calls.")}function Zd(n){let e=null,t=null;if(n.hasStart()&&(e=n.getIndexStartValue()),n.hasEnd()&&(t=n.getIndexEndValue()),n.getIndex()===ve){const s="Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",i="Query: When ordering by key, the argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() must be a string.";if(n.hasStart()){if(n.getIndexStartName()!==be)throw new Error(s);if(typeof e!="string")throw new Error(i)}if(n.hasEnd()){if(n.getIndexEndName()!==he)throw new Error(s);if(typeof t!="string")throw new Error(i)}}else if(n.getIndex()===k){if(e!=null&&!Fn(e)||t!=null&&!Fn(t))throw new Error("Query: When ordering by priority, the first argument passed to startAt(), startAfter() endAt(), endBefore(), or equalTo() must be a valid priority value (null, a number, or a string).")}else if(m(n.getIndex()instanceof Zn||n.getIndex()===br,"unknown index type."),e!=null&&typeof e=="object"||t!=null&&typeof t=="object")throw new Error("Query: First argument passed to startAt(), startAfter(), endAt(), endBefore(), or equalTo() cannot be an object.")}class ie extends yt{constructor(e,t){super(e,t,new ts,!1)}get parent(){const e=fr(this._path);return e===null?null:new ie(this._repo,e)}get root(){let e=this;for(;e.parent!==null;)e=e.parent;return e}}class at{constructor(e,t,s){this._node=e,this.ref=t,this._index=s}get priority(){return this._node.getPriority().val()}get key(){return this.ref.key}get size(){return this._node.numChildren()}child(e){const t=new R(e),s=Bn(this.ref,e);return new at(this._node.getChild(t),s,k)}exists(){return!this._node.isEmpty()}exportVal(){return this._node.val(!0)}forEach(e){return this._node.isLeafNode()?!1:!!this._node.forEachChild(this._index,(s,i)=>e(new at(i,Bn(this.ref,s),k)))}hasChild(e){const t=new R(e);return!this._node.getChild(t).isEmpty()}hasChildren(){return this._node.isLeafNode()?!1:!this._node.isEmpty()}toJSON(){return this.exportVal()}val(){return this._node.val()}}function W(n,e){return n=Ee(n),n._checkNotDeleted("ref"),e!==void 0?Bn(n._root,e):n._root}function Bn(n,e){return n=Ee(n),E(n._path)===null?Ad("child","path",e):vs("child","path",e),new ie(n._repo,P(n._path,e))}function Be(n){return Qr("remove",n._path),vt(n,null)}function vt(n,e){n=Ee(n),Qr("set",n._path),Sd("set",e,n._path);const t=new dt;return Ud(n._repo,n._path,e,null,t.wrapCallback(()=>{})),t.promise}function eu(n,e){Rd("update",e,n._path);const t=new dt;return Wd(n._repo,n._path,e,t.wrapCallback(()=>{})),t.promise}function no(n){n=Ee(n);const e=new to(()=>{}),t=new on(e);return Bd(n._repo,n,t).then(s=>new at(s,new ie(n._repo,n._path),n._queryParams.getIndex()))}class on{constructor(e){this.callbackContext=e}respondsTo(e){return e==="value"}createEvent(e,t){const s=t._queryParams.getIndex();return new Kd("value",this,new at(e.snapshotNode,new ie(t._repo,t._path),s))}getEventRunner(e){return e.getEventType()==="cancel"?()=>this.callbackContext.onCancel(e.error):()=>this.callbackContext.onValue(e.snapshot,null)}createCancelEvent(e,t){return this.callbackContext.hasCancelCallback?new Xd(this,e,t):null}matches(e){return e instanceof on?!e.callbackContext||!this.callbackContext?!0:e.callbackContext.matches(this.callbackContext):!1}hasAnyCallback(){return this.callbackContext!==null}}function tu(n,e,t,s,i){let r;if(typeof s=="object"&&(r=void 0,i=s),typeof s=="function"&&(r=s),i&&i.onlyOnce){const l=t,c=(d,u)=>{bi(n._repo,n,a),l(d,u)};c.userCallback=t.userCallback,c.context=t.context,t=c}const o=new to(t,r||void 0),a=new on(o);return jd(n._repo,n,a),()=>bi(n._repo,n,a)}function Cs(n,e,t,s){return tu(n,"value",e,t,s)}class so{}class nu extends so{constructor(e){super(),this._limit=e,this.type="limitToLast"}_apply(e){if(e._queryParams.hasLimit())throw new Error("limitToLast: Limit was already set (by another call to limitToFirst or limitToLast).");return new yt(e._repo,e._path,dc(e._queryParams,this._limit),e._orderByCalled)}}function su(n){if(typeof n!="number"||Math.floor(n)!==n||n<=0)throw new Error("limitToLast: First argument must be a positive integer.");return new nu(n)}class iu extends so{constructor(e){super(),this._path=e,this.type="orderByChild"}_apply(e){Jd(e,"orderByChild");const t=new R(this._path);if(C(t))throw new Error("orderByChild: cannot pass in empty path. Use orderByValue() instead.");const s=new Zn(t),i=uc(e._queryParams,s);return Zd(i),new yt(e._repo,e._path,i,!0)}}function ru(n){return vs("orderByChild","path",n),new iu(n)}function ou(n,...e){let t=Ee(n);for(const s of e)t=s._apply(t);return t}Zc(ie);id(ie);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const au="FIREBASE_DATABASE_EMULATOR_HOST",Un={};let lu=!1;function cu(n,e,t,s){n.repoInfo_=new ir(`${e}:${t}`,!1,n.repoInfo_.namespace,n.repoInfo_.webSocketOnly,n.repoInfo_.nodeAdmin,n.repoInfo_.persistenceKey,n.repoInfo_.includeNamespaceInQueryParams,!0),s&&(n.authTokenProvider_=s)}function du(n,e,t,s,i){let r=s||n.options.databaseURL;r===void 0&&(n.options.projectId||se("Can't determine Firebase Database URL. Be sure to include  a Project ID when calling firebase.initializeApp()."),$("Using default host for project ",n.options.projectId),r=`${n.options.projectId}-default-rtdb.firebaseio.com`);let o=wi(r,i),a=o.repoInfo,l;typeof process<"u"&&Hs&&(l=Hs[au]),l?(r=`http://${l}?ns=${a.namespace}`,o=wi(r,i),a=o.repoInfo):o.repoInfo.secure;const c=new ml(n.name,n.options,e);Nd("Invalid Firebase Database URL",o),C(o.path)||se("Database URL must point to the root of a Firebase Database (not including a child path).");const d=hu(a,n,c,new pl(n.name,t));return new fu(d,n)}function uu(n,e){const t=Un[e];(!t||t[n.key]!==n)&&se(`Database ${e}(${n.repoInfo_}) has already been deleted.`),Vd(n),delete t[n.key]}function hu(n,e,t,s){let i=Un[e.name];i||(i={},Un[e.name]=i);let r=i[n.toURLString()];return r&&se("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."),r=new Ld(n,lu,t,s),i[n.toURLString()]=r,r}class fu{constructor(e,t){this._repoInternal=e,this.app=t,this.type="database",this._instanceStarted=!1}get _repo(){return this._instanceStarted||(Od(this._repoInternal,this.app.options.appId,this.app.options.databaseAuthVariableOverride),this._instanceStarted=!0),this._repoInternal}get _root(){return this._rootInternal||(this._rootInternal=new ie(this._repo,S())),this._rootInternal}_delete(){return this._rootInternal!==null&&(uu(this._repo,this.app.name),this._repoInternal=null,this._rootInternal=null),Promise.resolve()}_checkNotDeleted(e){this._rootInternal===null&&se("Cannot call "+e+" on a deleted database.")}}function pu(n=Ba(),e){const t=La(n,"database").getImmediate({identifier:e});if(!t._instanceStarted){const s=Co("database");s&&mu(t,...s)}return t}function mu(n,e,t,s={}){n=Ee(n),n._checkNotDeleted("useEmulator"),n._instanceStarted&&se("Cannot call useEmulator() after instance has already been initialized.");const i=n._repoInternal;let r;if(i.repoInfo_.nodeAdmin)s.mockUserToken&&se('mockUserToken is not supported by the Admin SDK. For client access with mock users, please use the "firebase" package instead of "firebase-admin".'),r=new Tt(Tt.OWNER);else if(s.mockUserToken){const o=typeof s.mockUserToken=="string"?s.mockUserToken:Io(s.mockUserToken,n.app.options.projectId);r=new Tt(o)}cu(i,e,t,r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gu(n){Ja($a),Dt(new Xe("database",(e,{instanceIdentifier:t})=>{const s=e.getProvider("app").getImmediate(),i=e.getProvider("auth-internal"),r=e.getProvider("app-check-internal");return du(s,i,r,t)},"PUBLIC").setMultipleInstances(!0)),Re(js,Vs,n),Re(js,Vs,"esm2017")}te.prototype.simpleListen=function(n,e){this.sendRequest("q",{p:n},e)};te.prototype.echo=function(n,e){this.sendRequest("echo",{d:n},e)};gu();const _u={apiKey:"AIzaSyBIgGu-HTkEhzG5dy1x8UaY6ayD0AumC2g",authDomain:"faculty-monitoring-e00b7.firebaseapp.com",databaseURL:"https://faculty-monitoring-e00b7-default-rtdb.asia-southeast1.firebasedatabase.app",projectId:"faculty-monitoring-e00b7"};let yn,U;try{const n=Ua();n.length>0?(yn=n[0],console.log("Using existing Firebase app")):(yn=Wi(_u),console.log("Firebase app initialized successfully")),U=pu(yn),console.log("Firebase Realtime Database initialized successfully")}catch(n){console.error("Failed to initialize Firebase:",n)}function io(n,e=50){console.log("Subscribing to Firebase logs...");try{const t=W(U,"monitoring_logs"),s=ou(t,ru("timestamp"),su(e));return Cs(s,r=>{console.log("Firebase snapshot received:",r.exists());const o=[];r.exists()&&r.forEach(a=>{const l=a.val();vu(l)?o.push({id:a.key,...l}):console.warn("Invalid log data:",a.key,l)}),o.sort((a,l)=>l.timestamp-a.timestamp),console.log("Calling callback with",o.length,"logs"),n(o,null)},r=>{console.error("Firebase Realtime Database error:",r),n([],r)})}catch(t){return console.error("Error setting up Firebase subscription:",t),n([],t),()=>{}}}function yu(n){n&&typeof n=="function"&&n()}function vu(n){return n?["uid","room_id","status","timestamp"].every(t=>{const s=n[t];return s!=null&&s!==""}):!1}async function bu(n,e){try{const t=W(U,`professors/${n}`);await vt(t,{...e,registered_at:Date.now()})}catch(t){throw console.error("Error saving professor:",t),t}}async function Is(){try{const n=W(U,"professors"),e=await no(n);if(!e.exists())return[];const t=[];return e.forEach(s=>{t.push({uid:s.key,...s.val()})}),t}catch(n){throw console.error("Error getting professors:",n),n}}async function ro(n,e){try{const t=W(U,`professors/${n}`);await eu(t,e)}catch(t){throw console.error("Error updating professor:",t),t}}async function wu(n){try{const e=W(U,`professors/${n}`);await Be(e)}catch(e){throw console.error("Error deleting professor:",e),e}}async function oo(n,e){try{const t=W(U,`admins/${n}`);await vt(t,e)}catch(t){throw console.error("Error saving admin:",t),t}}async function Ss(){try{const n=W(U,"admins"),e=await no(n);if(!e.exists())return[];const t=[];return e.forEach(s=>{t.push({uid:s.key,...s.val()})}),t}catch(n){throw console.error("Error getting admins:",n),n}}async function xu(n){try{const e=W(U,`admins/${n}`);await Be(e)}catch(e){throw console.error("Error deleting admin:",e),e}}async function Eu(n){try{const e=W(U,`monitoring_logs/${n}`);await Be(e),console.log(`Log ${n} deleted successfully`)}catch(e){throw console.error("Error deleting log:",e),e}}async function Cu(){try{const n=W(U,"monitoring_logs");await Be(n),console.log("All logs cleared successfully")}catch(n){throw console.error("Error clearing logs:",n),n}}function Iu(n){try{const e=W(U,"pending_registrations");return Cs(e,s=>{const i=[];s.exists()&&s.forEach(r=>{i.push({uid:r.key,...r.val()})}),i.sort((r,o)=>(o.scanned_at||0)-(r.scanned_at||0)),n(i,null)},s=>{console.error("Error subscribing to pending registrations:",s),n([],s)})}catch(e){return console.error("Error setting up pending registrations subscription:",e),n([],e),()=>{}}}async function Su(n,e){try{const t=W(U,`professors/${n}`);await vt(t,{name:e.name,department:e.department,status:"active",registered_at:Date.now()});const s=W(U,`pending_registrations/${n}`);await Be(s),console.log(`Registration approved for ${n}`)}catch(t){throw console.error("Error approving registration:",t),t}}async function Tu(n){try{const e=W(U,`pending_registrations/${n}`);await Be(e),console.log(`Registration rejected for ${n}`)}catch(e){throw console.error("Error rejecting registration:",e),e}}function Ru(n){try{const e=W(U,"system_config/registration_mode");return Cs(e,s=>{const i=s.exists()?s.val():!1;n(i,null)},s=>{console.error("Error subscribing to registration mode:",s),n(!1,s)})}catch(e){return console.error("Error setting up registration mode subscription:",e),n(!1,e),()=>{}}}async function Au(n){try{const e=W(U,"system_config/registration_mode");await vt(e,n),console.log(`Registration mode ${n?"enabled":"disabled"}`)}catch(e){throw console.error("Error setting registration mode:",e),e}}const ae=ct({user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,error:null});function Nu(){const n=localStorage.getItem("admin_session");if(n)try{const e=JSON.parse(n);ae.update(()=>({user:e.user,isAuthenticated:!0,isAdmin:!0,loading:!1,error:null}))}catch(e){console.error("Failed to restore session:",e),localStorage.removeItem("admin_session")}}async function Du(n,e){try{ae.update(r=>({...r,loading:!0,error:null}));const s=(await Ss()).find(r=>r.email===n&&r.password===e);if(!s)return ae.update(r=>({...r,loading:!1,error:"Invalid email or password"})),{success:!1,error:"Invalid email or password"};const i={uid:s.uid,email:s.email,role:s.role};return localStorage.setItem("admin_session",JSON.stringify({user:i})),ae.update(()=>({user:i,isAuthenticated:!0,isAdmin:!0,loading:!1,error:null})),{success:!0,user:i}}catch(t){return console.error("Login error:",t),ae.update(s=>({...s,loading:!1,error:"Login failed. Please try again."})),{success:!1,error:t.message}}}async function ku(){try{return localStorage.removeItem("admin_session"),ae.update(()=>({user:null,isAuthenticated:!1,isAdmin:!1,loading:!1,error:null})),location.hash="#/login",{success:!0}}catch(n){return console.error("Logout error:",n),{success:!1,error:n.message}}}function Ts(){return ae.get()}function ao(n){ae.subscribe(n)}let Wn=[];function bt(n){Wn.push(n)}function Pu(){Wn.forEach(n=>n()),Wn=[]}function Mu(){const n=location.hash.slice(1)||"/",e=Ts(),t=[{path:"/dashboard",label:"Monitoring"}],s=[{path:"/dashboard",label:"Monitoring"},{path:"/registration",label:"Registration"},{path:"/admin",label:"Admin Panel"}],i=e.isAuthenticated&&e.isAdmin?s:t;return bt(()=>{const r=document.getElementById("logout-btn");r&&(r.onclick=async o=>{o.preventDefault(),await ku()}),ao(o=>{document.getElementById("navigation-container")&&window.dispatchEvent(new HashChangeEvent("hashchange"))})}),`
    <nav id="navigation-container" class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Brand -->
          <div class="flex-shrink-0">
            <a href="#/" class="text-xl font-bold text-gray-900">
              Faculty Monitoring
            </a>
          </div>

          <!-- Navigation Tabs -->
          <div class="hidden md:flex space-x-4">
            ${i.map(r=>`
              <a
                href="#${r.path}"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors ${n===r.path?"bg-blue-600 text-white":"text-gray-700 hover:bg-gray-100"}"
              >
                ${r.label}
              </a>
            `).join("")}
          </div>

          <!-- Auth Button -->
          <div class="flex items-center">
            ${e.isAuthenticated?`
              <button
                id="logout-btn"
                class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            `:`
              <a
                href="#/login"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                Login
              </a>
            `}
          </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden pb-4">
          <div class="flex flex-col space-y-2">
            ${i.map(r=>`
              <a
                href="#${r.path}"
                class="px-3 py-2 rounded-md text-sm font-medium transition-colors ${n===r.path?"bg-blue-600 text-white":"text-gray-700 hover:bg-gray-100"}"
              >
                ${r.label}
              </a>
            `).join("")}
          </div>
        </div>
      </div>
    </nav>
  `}function Lu(n){return`
    ${Mu()}
    <main>${n}</main>
  `}function Ou(){return`
    <div class="min-h-screen flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow text-center">
        <h1 class="text-2xl font-bold">🚀 XUI Framework</h1>
        <p class="mt-2 text-gray-600">PWA • Firebase • Tailwind</p>
        
        <div class="mt-4 text-sm text-gray-500">
          Render time: <span id="render-time">...</span>
        </div>
      </div>
    </div>
  `}function lo(){return bt(async()=>{const n=document.getElementById("login-form"),e=document.getElementById("email"),t=document.getElementById("password"),s=document.getElementById("error-message"),i=document.getElementById("loading-indicator"),r=document.getElementById("submit-button"),o=document.getElementById("init-admin-button"),a=document.getElementById("init-admin-section");try{const c=await Ss();c.length>0?(a&&(a.style.display="none"),console.log(`Security: ${c.length} admin(s) found. Initialization button hidden.`)):console.log("Security: No admins found. Showing initialization button.")}catch(c){console.error("Security check error:",c),a&&(a.style.display="none")}if(Ts().isAuthenticated){location.hash="#/dashboard";return}ao(c=>{c.loading?(i.classList.remove("hidden"),r.disabled=!0):(i.classList.add("hidden"),r.disabled=!1),c.error?(s.textContent=c.error,s.classList.remove("hidden")):s.classList.add("hidden"),c.isAuthenticated&&(location.hash="#/dashboard")}),n.onsubmit=async c=>{c.preventDefault();const d=e.value.trim(),u=t.value;if(!d){s.textContent="Please enter your email",s.classList.remove("hidden");return}if(!u){s.textContent="Please enter your password",s.classList.remove("hidden");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d)){s.textContent="Please enter a valid email address",s.classList.remove("hidden");return}s.classList.add("hidden"),await Du(d,u)},o&&(o.onclick=async()=>{if(confirm("This will create a default admin account:\\n\\nEmail: admin@faculty.com\\nPassword: admin123\\n\\nYou can add more admins later from the Admin Panel.\\n\\nContinue?"))try{o.disabled=!0,o.textContent="Creating...";const d="admin_"+Date.now();await oo(d,{email:"admin@faculty.com",password:"admin123",role:"admin",created_at:Date.now()}),alert("✅ Admin account created successfully!\\n\\nEmail: admin@faculty.com\\nPassword: admin123\\n\\nClick OK to continue, then login with these credentials."),a&&(a.style.display="none"),e.value="admin@faculty.com",t.value="admin123"}catch(d){console.error("Error creating admin:",d),alert("❌ Failed to create admin account: "+d.message)}finally{o.disabled=!1,o.textContent="Initialize First Admin"}})}),`
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4">
      <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white">Faculty Monitoring</h1>
          <p class="text-gray-400 mt-2">Admin Login</p>
        </div>

        <form id="login-form" class="space-y-6">
          <!-- Error Message -->
          <div id="error-message" class="hidden bg-red-900/30 border border-red-500/50 rounded p-4 text-red-200 text-sm">
            Error message
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            id="submit-button"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

          <!-- Loading Indicator -->
          <div id="loading-indicator" class="hidden flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-300">Logging in...</span>
          </div>
        </form>

        <!-- Initialize Admin Button - SECURITY: Only shown if no admins exist -->
        <div id="init-admin-section" class="mt-6 pt-6 border-t border-slate-700">
          <button
            id="init-admin-button"
            class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Initialize First Admin
          </button>
          <p class="text-xs text-gray-400 text-center mt-2">
            Click here if this is your first time setting up the system
          </p>
        </div>

        <div class="mt-6 text-center text-sm text-gray-400">
          <p>Access to administrative features requires authentication</p>
        </div>
      </div>
    </div>
  `}function lt(n){if(!n)return"N/A";const e=new Date(n),t=e.getFullYear(),s=String(e.getMonth()+1).padStart(2,"0"),i=String(e.getDate()).padStart(2,"0"),r=String(e.getHours()).padStart(2,"0"),o=String(e.getMinutes()).padStart(2,"0"),a=String(e.getSeconds()).padStart(2,"0");return`${t}-${s}-${i} ${r}:${o}:${a}`}function wt(){const n=new Date;return n.setHours(0,0,0,0),n.getTime()}function xt(){const n=new Date;return n.setHours(23,59,59,999),n.getTime()}function Fu(){return Date.now()-24*60*60*1e3}function co(){return Date.now()-7*24*60*60*1e3}function xi(n){return n>-50?"good":n>=-70?"fair":"poor"}function Ei(n){return n>8?"good":n>=5?"fair":"poor"}function It(n){switch(n){case"good":return"text-green-600";case"fair":return"text-yellow-600";case"poor":return"text-red-600";default:return"text-gray-600"}}function Ci(n){return n==null?"N/A":`${n} dBm`}function Ii(n){return n==null?"N/A":`${n} dB`}function $u(n,e){return n>-50&&e>8}function Bu(n){const e=wt(),t=xt();return n.filter(s=>s.timestamp>=e&&s.timestamp<=t).length}function Uu(n){const e=wt(),t=xt(),s=n.filter(r=>r.timestamp>=e&&r.timestamp<=t);return new Set(s.map(r=>r.uid)).size}function Wu(n){const e=wt(),t=xt(),s=n.filter(r=>r.timestamp>=e&&r.timestamp<=t&&r.rssi!==null&&r.rssi!==void 0);if(s.length===0)return 0;const i=s.reduce((r,o)=>r+o.rssi,0);return Math.round(i/s.length*100)/100}function Hu(n){const e=wt(),t=xt(),s=n.filter(r=>r.timestamp>=e&&r.timestamp<=t&&r.snr!==null&&r.snr!==void 0);if(s.length===0)return 0;const i=s.reduce((r,o)=>r+o.snr,0);return Math.round(i/s.length*100)/100}function ju(n){const e=wt(),t=xt(),s=n.filter(r=>r.timestamp>=e&&r.timestamp<=t&&r.rssi!==null&&r.rssi!==void 0&&r.snr!==null&&r.snr!==void 0);if(s.length===0)return 0;const i=s.filter(r=>$u(r.rssi,r.snr)).length;return Math.round(i/s.length*100)}function Vu(n){return{totalLogsToday:Bu(n),uniqueUIDsToday:Uu(n),averageRSSI:Wu(n),averageSNR:Hu(n),signalQualityPercent:ju(n)}}function zu(n){const e=co();return n.filter(t=>t.timestamp>=e).length}function Gu(n){const e=co(),t=n.filter(i=>i.timestamp>=e);return new Set(t.map(i=>i.uid)).size}function qu(n){const e=Vu(n),t=e.signalQualityPercent<50;return`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Total Logs Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Total Logs Today</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">${e.totalLogsToday}</div>
      </div>

      <!-- Unique UIDs Today -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Unique UIDs Today</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">${e.uniqueUIDsToday}</div>
      </div>

      <!-- Average RSSI -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Average RSSI</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">
          ${e.averageRSSI!==0?e.averageRSSI+" dBm":"N/A"}
        </div>
      </div>

      <!-- Average SNR -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-sm font-medium text-gray-600">Average SNR</div>
        <div class="text-3xl font-bold text-gray-900 mt-2">
          ${e.averageSNR!==0?e.averageSNR+" dB":"N/A"}
        </div>
      </div>
    </div>

    <!-- Signal Quality Summary -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-sm font-medium text-gray-600">Signal Quality</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">${e.signalQualityPercent}%</div>
          <div class="text-sm text-gray-500 mt-1">Logs with good signal (RSSI > -50 dBm, SNR > 8 dB)</div>
        </div>
        ${t?`
          <div class="flex items-center text-red-600">
            <svg class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <span class="font-medium">Poor Signal Quality</span>
          </div>
        `:""}
      </div>
    </div>
  `}function Qu(n){if(!n||n.length===0)return`
      <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
        <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        <p class="text-lg font-medium">No monitoring logs found</p>
        <p class="text-sm mt-2">Logs will appear here when faculty activity is detected</p>
      </div>
    `;const e=`
    <div class="hidden md:block bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSSI</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SNR</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${n.map(s=>{const i=xi(s.rssi),r=Ei(s.snr),o=It(i),a=It(r);return`
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${s.uid||"N/A"}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${s.room_id||"N/A"}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${s.status==="IN"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                    ${s.status||"N/A"}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lt(s.timestamp)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${o}">${Ci(s.rssi)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${a}">${Ii(s.snr)}</td>
              </tr>
            `}).join("")}
        </tbody>
      </table>
    </div>
  `,t=`
    <div class="md:hidden space-y-4">
      ${n.map(s=>{const i=xi(s.rssi),r=Ei(s.snr),o=It(i),a=It(r);return`
          <div class="bg-white rounded-lg shadow p-4">
            <div class="flex justify-between items-start mb-3">
              <div class="font-mono text-sm font-medium text-gray-900">${s.uid||"N/A"}</div>
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${s.status==="IN"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                ${s.status||"N/A"}
              </span>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">Room:</span>
                <span class="font-medium text-gray-900">${s.room_id||"N/A"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Time:</span>
                <span class="font-medium text-gray-900">${lt(s.timestamp)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">RSSI:</span>
                <span class="font-medium ${o}">${Ci(s.rssi)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">SNR:</span>
                <span class="font-medium ${a}">${Ii(s.snr)}</span>
              </div>
            </div>
          </div>
        `}).join("")}
    </div>
  `;return`
    <div>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900">Monitoring Logs</h2>
        <span class="text-sm text-gray-600">Latest ${n.length} entries</span>
      </div>
      ${e}
      ${t}
    </div>
  `}function Yu(n){const e=Fu(),t=n.filter(r=>r.timestamp>=e);if(t.length===0)return`
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Room Activity (24h)</h2>
        <div class="text-center text-gray-500 py-8">
          <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p>No room activity in the past 24 hours</p>
        </div>
      </div>
    `;const s={};t.forEach(r=>{s[r.room_id]||(s[r.room_id]=[]),s[r.room_id].push(r)});const i=Object.keys(s).map(r=>{const o=s[r];o.sort((l,c)=>c.timestamp-l.timestamp);const a=o[0];return{roomId:r,logCount:o.length,latestStatus:a.status,latestTimestamp:a.timestamp}});return i.sort((r,o)=>o.latestTimestamp-r.latestTimestamp),`
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Room Activity (24h)</h2>
      <div class="space-y-3">
        ${i.map(r=>`
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div class="flex justify-between items-start mb-2">
              <div class="font-medium text-gray-900">${r.roomId}</div>
              <span class="px-2 py-1 text-xs font-semibold rounded-full ${r.latestStatus==="IN"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}">
                ${r.latestStatus}
              </span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <div class="flex justify-between">
                <span>Total Logs:</span>
                <span class="font-medium text-gray-900">${r.logCount}</span>
              </div>
              <div class="flex justify-between">
                <span>Last Activity:</span>
                <span class="font-medium text-gray-900">${lt(r.latestTimestamp)}</span>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function Si(n){if(!n||n.length===0){alert("No logs to export");return}const e=["UID","Room ID","Status","Timestamp","RSSI","SNR","Logged At"],t=n.map(g=>[g.uid||"",g.room_id||"",g.status||"",lt(g.timestamp),g.rssi!==null&&g.rssi!==void 0?g.rssi:"",g.snr!==null&&g.snr!==void 0?g.snr:"",g.logged_at||""]),s=[e.join(","),...t.map(g=>g.map(w=>{const _=String(w);return _.includes(",")||_.includes('"')||_.includes(`
`)?`"${_.replace(/"/g,'""')}"`:_}).join(","))].join(`
`),i=new Date,r=i.getFullYear(),o=String(i.getMonth()+1).padStart(2,"0"),a=String(i.getDate()).padStart(2,"0"),l=String(i.getHours()).padStart(2,"0"),c=String(i.getMinutes()).padStart(2,"0"),d=String(i.getSeconds()).padStart(2,"0"),u=`faculty_logs_${r}-${o}-${a}_${l}-${c}-${d}.csv`,h=new Blob([s],{type:"text/csv;charset=utf-8;"}),f=document.createElement("a");navigator.msSaveBlob?navigator.msSaveBlob(h,u):(f.href=URL.createObjectURL(h),f.download=u,f.style.display="none",document.body.appendChild(f),f.click(),document.body.removeChild(f))}const z=ct({logs:[],filters:{dateStart:null,dateEnd:null,roomId:"",uid:""},loading:!0,error:null,connected:!1,initialized:!1}),St=po(z,n=>{let e=n.logs;return n.filters.dateStart&&(e=e.filter(t=>t.timestamp>=n.filters.dateStart)),n.filters.dateEnd&&(e=e.filter(t=>t.timestamp<=n.filters.dateEnd)),n.filters.roomId&&n.filters.roomId.trim()!==""&&(e=e.filter(t=>t.room_id&&t.room_id.toLowerCase().includes(n.filters.roomId.toLowerCase()))),n.filters.uid&&n.filters.uid.trim()!==""&&(e=e.filter(t=>t.uid&&t.uid.toLowerCase().includes(n.filters.uid.toLowerCase()))),e});let zt=!1,Rt=null,Gt=new Map;async function Ku(){try{const n=await Is();Gt.clear(),n.forEach(e=>{Gt.set(e.uid,e.name)}),console.log(`Loaded ${n.length} professors into cache`)}catch(n){console.error("Error loading professor cache:",n)}}function uo(n){return Gt.has(n)?Gt.get(n):"Prof. "+n.substring(0,8)}function Ti(){if(zt)return;zt=!0,console.log("Initializing dashboard, subscribing to logs...");const n=setTimeout(()=>{z.get().loading&&(console.error("Firebase connection timeout"),z.update(t=>({...t,loading:!1,error:"Connection timeout. Please check your Firebase configuration and internet connection.",connected:!1,initialized:!0})),window.triggerDashboardRender&&window.triggerDashboardRender())},1e4);Rt=io((e,t)=>{clearTimeout(n),console.log("Firebase callback received:",{logsCount:e.length,error:t}),t?(console.error("Firebase error:",t),z.update(s=>({...s,loading:!1,error:"Unable to connect to Firebase. Please check your connection.",connected:!1,initialized:!0}))):(console.log("Firebase connected successfully with",e.length,"logs"),z.update(s=>({...s,logs:e,loading:!1,error:null,connected:!0,initialized:!0}))),window.triggerDashboardRender&&window.triggerDashboardRender()})}function Xu(){z.get().initialized||Ti(),bt(()=>{console.log("Dashboard mounted"),zt||Ti();function d(f){z.update(g=>({...g,filters:{...g.filters,...f}})),n()}window.handleDashboardFilterChange=d,window.showRoomDetails=f=>{const g=document.getElementById("room-details-modal"),w=document.getElementById("modal-room-title"),_=document.getElementById("modal-room-content");if(!g||!w||!_)return;w.textContent=f;const p=z.get().logs.filter(v=>v.status==="in_room"&&v.room_id===f).reduce((v,y)=>(v.find(T=>T.uid===y.uid)||v.push(y),v),[]).sort((v,y)=>y.timestamp-v.timestamp);if(p.length===0)_.innerHTML=`
          <div class="text-center py-8 text-gray-400">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            <p class="text-lg">No professors currently in this room</p>
          </div>
        `;else{const v=p.map((y,T)=>{const re=ho(y.timestamp),Ue=uo(y.uid);return`
            <div class="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P${T+1}
                </div>
                <div>
                  <div class="font-medium text-lg">${Ue}</div>
                  <div class="text-sm text-gray-400">${y.uid}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm text-emerald-400 font-medium">IN ROOM</div>
                <div class="text-xs text-gray-400">${re}</div>
              </div>
            </div>
          `}).join("");_.innerHTML=`
          <div class="mb-4">
            <div class="text-4xl font-bold text-center mb-2">${p.length}</div>
            <div class="text-center text-gray-400">${p.length===1?"Professor":"Professors"} in room</div>
          </div>
          <div class="space-y-3 mt-6">
            ${v}
          </div>
        `}g.classList.remove("hidden")},window.closeRoomDetails=()=>{const f=document.getElementById("room-details-modal");f&&f.classList.add("hidden")},document.addEventListener("keydown",f=>{f.key==="Escape"&&window.closeRoomDetails()}),Ku(),window.deleteLogEntry=async f=>{if(confirm("Are you sure you want to delete this log entry?"))try{await Eu(f),console.log(`Log ${f} deleted`)}catch(g){console.error("Error deleting log:",g),alert("Failed to delete log entry")}},window.clearAllLogs=async()=>{if(confirm("WARNING: This will delete ALL log entries. Are you sure?")&&confirm("This action cannot be undone. Confirm to clear all logs?"))try{await Cu(),console.log("All logs cleared"),alert("All logs have been cleared successfully")}catch(f){console.error("Error clearing logs:",f),alert("Failed to clear logs")}};const u=document.getElementById("export-csv-btn");u&&(u.onclick=()=>{const f=St.get();f.length===0?alert("No logs to export. Try adjusting your filters."):Si(f)}),z.subscribe(()=>{n()});const h=()=>{Rt&&(yu(Rt),Rt=null),zt=!1,z.update(f=>({...f,initialized:!1,loading:!0})),delete window.handleDashboardFilterChange,delete window.dashboardCleanup};return window.dashboardCleanup=h,h});function n(){const d=z.get(),u=St.get(),h=document.getElementById("statistics-container");h&&(h.innerHTML=qu(u));const f=document.getElementById("log-viewer-container");f&&(u.length===0&&(d.filters.dateStart||d.filters.dateEnd||d.filters.roomId||d.filters.uid)?f.innerHTML=`
          <div class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <p class="text-lg font-medium">No logs match the current filters</p>
            <p class="text-sm mt-2">Try adjusting your filter criteria</p>
          </div>
        `:f.innerHTML=Qu(u));const g=document.getElementById("room-status-container");g&&(g.innerHTML=Yu(d.logs));const w=document.getElementById("export-csv-btn");w&&!w.onclick&&(w.onclick=()=>{const _=St.get();_.length===0?alert("No logs to export. Try adjusting your filters."):Si(_)})}const e=z.get();if(e.loading)return`
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span class="ml-3 text-gray-300">Loading dashboard...</span>
          </div>
        </div>
      </div>
    `;if(e.error)return`
      <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-6">
        <div class="max-w-7xl mx-auto">
          <div class="bg-red-900/30 border border-red-500/50 rounded-lg p-6 text-red-200">
            <div class="flex items-center">
              <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <div>
                <strong>Error:</strong> ${e.error}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;const t=St.get(),s=new Date,i=s.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0}),r=s.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"}),o={},a={count:0,professors:[]};t.forEach(d=>{d.status==="in_room"&&(d.room_id==="Faculty Room"?(a.count++,a.professors.find(u=>u.uid===d.uid)||a.professors.push({uid:d.uid,name:d.name||d.uid,timestamp:d.timestamp})):(o[d.room_id]||(o[d.room_id]={count:0,professors:[]}),o[d.room_id].count++,o[d.room_id].professors.find(u=>u.uid===d.uid)||o[d.room_id].professors.push({uid:d.uid,name:d.name||d.uid,timestamp:d.timestamp})))});const c=["202","203 (1st Comlab)","204 (2nd Comlab)","205"].map(d=>{const u=o[d]||{count:0},h=u.count>0,f=h?"from-emerald-900/40 to-emerald-800/40 border-emerald-500/50":"from-slate-800/40 to-slate-700/40 border-slate-600/30",g=h?"bg-emerald-400":"bg-slate-500",w=h?"text-emerald-400":"text-slate-400";return`
      <div class="bg-gradient-to-br ${f} border rounded-lg p-3 hover:scale-105 transition-transform cursor-pointer room-card" 
           data-room-id="${d}"
           onclick="window.showRoomDetails('${d}')">
        <div class="flex justify-between items-start mb-2">
          <div class="text-${h?"emerald":"slate"}-400 text-xs font-medium">${d}</div>
          <div class="w-1.5 h-1.5 ${g} rounded-full ${h?"animate-pulse":""}"></div>
        </div>
        <div class="flex flex-col items-center justify-center py-2">
          <svg class="w-10 h-10 ${w} mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
          </svg>
          <div class="text-4xl font-bold ${w} mb-1">${u.count}</div>
          <div class="text-xs ${w}">
            ${u.count===1?"Prof.":"Profs"}
          </div>
        </div>
      </div>
    `}).join("");return`
    <div class="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white p-4">
      <div class="h-full flex flex-col max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <div>
                <h1 class="text-lg font-bold">IT Faculty Monitoring System</h1>
                <p class="text-xs text-gray-400">RFID-BASED REAL-TIME ROOM TRACKING</p>
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xl font-bold">${i}</div>
            <div class="text-xs text-gray-400">${r}</div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="flex-1 grid grid-cols-5 gap-3 min-h-0">
          <!-- Left Side: Faculty Room + Other Rooms -->
          <div class="col-span-2 flex flex-col gap-3">
            <!-- Faculty Room Card -->
            <div class="bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/50 rounded-lg p-4 hover:scale-[1.02] transition-transform cursor-pointer"
                 onclick="window.showRoomDetails('Faculty Room')">
              <div class="text-center">
                <div class="text-blue-400 text-xs font-medium mb-2">FACULTY ROOM</div>
                <svg class="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/>
                </svg>
                <div class="text-5xl font-bold text-blue-400 mb-1">${a.count}</div>
                <div class="text-sm text-blue-400">Teachers inside</div>
                <button class="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-medium transition-colors">
                  + ${a.count} INSIDE
                </button>
              </div>
            </div>

            <!-- Room Cards Grid -->
            <div class="grid grid-cols-2 gap-2 flex-1">
              ${c}
            </div>
          </div>

          <!-- Right Side: Faculty Location Table -->
          <div class="col-span-3 bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden flex flex-col">
            <div class="p-3 border-b border-slate-700/50">
              <h2 class="text-base font-bold">CURRENT FACULTY LOCATION</h2>
              <p class="text-xs text-gray-400 mt-1">Updated 5s ago</p>
            </div>
            <div class="flex-1 overflow-auto">
              <div class="flex justify-between items-center mb-3">
                <div></div>
                <button onclick="window.clearAllLogs()" class="px-3 py-1.5 bg-red-600/80 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  Clear All Logs
                </button>
              </div>
              <table class="w-full">
                <thead class="bg-slate-900/50 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">#</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Teacher</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Room</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Last Scanned</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50" id="faculty-location-tbody">
                  ${Ju(t)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Room Details Modal -->
    <div id="room-details-modal" class="hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div class="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 class="text-2xl font-bold" id="modal-room-title">Room Details</h2>
          <button onclick="window.closeRoomDetails()" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[60vh]" id="modal-room-content">
          <!-- Content will be populated by JavaScript -->
        </div>
      </div>
    </div>
  `}function Ju(n){if(n.length===0)return`
      <tr>
        <td colspan="6" class="px-6 py-8 text-center text-gray-400">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p>No faculty members currently tracked</p>
        </td>
      </tr>
    `;const e=new Map;return n.forEach(s=>{(!e.has(s.uid)||s.timestamp>e.get(s.uid).timestamp)&&e.set(s.uid,s)}),Array.from(e.values()).sort((s,i)=>i.timestamp-s.timestamp).slice(0,10).map((s,i)=>{const r=s.status==="in_room",o=r?'<span class="px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/50">+ IN ROOM</span>':'<span class="px-3 py-1 bg-blue-900/50 text-blue-400 text-xs font-medium rounded-full border border-blue-500/50">+ FACULTY ROOM</span>',a=r&&s.room_id!=="Faculty Room"?`<span class="flex items-center gap-2 text-emerald-400"><span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>${s.room_id}</span>`:'<span class="flex items-center gap-2 text-blue-400"><span class="w-2 h-2 bg-blue-400 rounded-full"></span>Faculty Room</span>',l=ho(s.timestamp),c=uo(s.uid);return`
      <tr class="hover:bg-slate-700/30 transition-colors">
        <td class="px-3 py-2 text-gray-400 text-sm">P${i+1}</td>
        <td class="px-3 py-2">
          <div class="font-medium text-sm">${c}</div>
          <div class="text-xs text-gray-400">${s.uid.substring(0,12)}...</div>
        </td>
        <td class="px-3 py-2">${a}</td>
        <td class="px-3 py-2">${o}</td>
        <td class="px-3 py-2 text-gray-400 text-sm">${l}</td>
        <td class="px-3 py-2">
          <button onclick="window.deleteLogEntry('${s.id}')" class="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors" title="Delete this log entry">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </td>
      </tr>
    `}).join("")}function ho(n){const t=Date.now()-n,s=Math.floor(t/1e3),i=Math.floor(s/60),r=Math.floor(i/60);return s<60?`${s}s ago`:i<60?`${i}m ago`:r<24?`${r}h ago`:new Date(n).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0})}const Z=ct({professors:[],pendingRegistrations:[],registrationMode:!1,loading:!0,error:null,successMessage:null});function Zu(){let n=null,e=null;bt(async()=>{await t();const p=document.getElementById("registration-form");return p&&(p.onsubmit=async v=>{v.preventDefault(),await s()}),n=Iu((v,y)=>{if(y){console.error("Error loading pending registrations:",y);return}Z.update(T=>({...T,pendingRegistrations:v})),l()}),e=Ru((v,y)=>{if(y){console.error("Error loading registration mode:",y);return}Z.update(T=>({...T,registrationMode:v})),o()}),Z.subscribe(()=>{r(),l(),o()}),()=>{n&&n(),e&&e()}});async function t(){try{const p=await Is();Z.update(v=>({...v,professors:p,loading:!1})),r()}catch(p){console.error("Error loading professors:",p),Z.update(v=>({...v,loading:!1,error:"Failed to load professors"}))}}async function s(){const p=document.getElementById("uid-input"),v=document.getElementById("name-input"),y=document.getElementById("department-input"),T=document.getElementById("registration-error"),re=document.getElementById("registration-success");T.classList.add("hidden"),re.classList.add("hidden");const Ue=p.value.trim(),Rs=v.value.trim(),As=y.value.trim();if(!Ue||!Rs||!As){T.textContent="All fields are required",T.classList.remove("hidden");return}if(!/^[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}:[A-Fa-f0-9]{2}$/.test(Ue)){T.textContent="Invalid UID format. Expected format: XX:XX:XX:XX",T.classList.remove("hidden");return}try{await bu(Ue,{name:Rs,department:As,status:"active"}),re.textContent="Professor registered successfully",re.classList.remove("hidden"),p.value="",v.value="",y.value="",await t()}catch(Ns){console.error("Error saving professor:",Ns),T.textContent="Failed to register professor: "+Ns.message,T.classList.remove("hidden")}}async function i(p,v){const y=v==="active"?"inactive":"active";try{await ro(p,{status:y}),await t()}catch(T){console.error("Error updating professor status:",T),alert("Failed to update whitelist status")}}function r(){const p=document.getElementById("professor-list");if(!p)return;const v=Z.get();if(v.loading){p.innerHTML=`
        <div class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-2 text-gray-600">Loading professors...</p>
        </div>
      `;return}if(v.professors.length===0){p.innerHTML=`
        <div class="text-center py-8 text-gray-500">
          <p>No professors registered yet</p>
        </div>
      `;return}p.innerHTML=`
      <div class="space-y-3">
        ${v.professors.map(y=>`
          <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="font-mono text-sm font-medium text-gray-900">${y.uid}</div>
                <div class="text-gray-900 font-medium mt-1">${y.name}</div>
                <div class="text-sm text-gray-600">${y.department}</div>
              </div>
              <div class="flex items-center space-x-2">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${y.status==="active"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
                  ${y.status==="active"?"Active":"Inactive"}
                </span>
                <button
                  onclick="window.toggleProfessorWhitelist('${y.uid}', '${y.status}')"
                  class="px-3 py-1 text-sm ${y.status==="active"?"bg-red-600 hover:bg-red-700":"bg-green-600 hover:bg-green-700"} text-white rounded transition-colors"
                >
                  ${y.status==="active"?"Remove from Whitelist":"Add to Whitelist"}
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `,window.toggleProfessorWhitelist=i}function o(){const p=document.getElementById("registration-mode-section");if(!p)return;const y=Z.get().registrationMode;p.innerHTML=`
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Registration Mode</h2>
          <p class="text-sm text-gray-600 mt-1">
            ${y?"✅ Receiver is in REGISTRATION MODE. New cards will appear in Pending Registrations below.":"❌ Registration Mode is OFF. Enable to register new professor cards via the receiver."}
          </p>
        </div>
        <button
          onclick="window.toggleRegistrationMode()"
          class="px-6 py-3 rounded-lg font-medium transition-colors ${y?"bg-red-600 hover:bg-red-700 text-white":"bg-emerald-600 hover:bg-emerald-700 text-white"}"
        >
          ${y?"⏹ Disable Registration Mode":"▶ Enable Registration Mode"}
        </button>
      </div>
    `}async function a(){const v=!Z.get().registrationMode;try{await Au(v)}catch(y){console.error("Error toggling registration mode:",y),alert("Failed to toggle registration mode. Please try again.")}}function l(){const p=document.getElementById("pending-registrations-section");if(!p)return;const y=Z.get().pendingRegistrations;if(y.length===0){p.innerHTML="";return}p.innerHTML=`
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-xl font-bold text-gray-900">⏳ Pending Registrations</h2>
          <p class="text-sm text-gray-600 mt-1">
            ${y.length} card${y.length>1?"s":""} scanned in Registration Mode. Approve to add to whitelist.
          </p>
        </div>
        <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          ${y.length} pending
        </span>
      </div>
      
      <div class="space-y-3">
        ${y.map(T=>`
          <div class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-mono text-lg font-bold text-gray-900">${T.uid}</div>
                <div class="text-sm text-gray-600 mt-1">
                  Scanned: ${new Date(T.scanned_at).toLocaleString()}
                </div>
              </div>
              <div class="flex gap-2">
                <button
                  onclick="window.approveRegistration('${T.uid}')"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  ✓ Approve
                </button>
                <button
                  onclick="window.rejectRegistration('${T.uid}')"
                  class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    `}let c=!1,d="",u="",h="";function f(p){c=!0,d=p,u="",h="",w()}function g(){c=!1,d="",u="",h="",w()}function w(){const p=document.getElementById("approve-modal-container");if(p){if(!c){p.innerHTML="";return}p.innerHTML=`
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Approve Registration</h3>
            <p class="text-sm text-gray-600 mt-1">Card UID: <span class="font-mono font-medium">${d}</span></p>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Professor Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="approve-name-input"
                oninput="window.updateApproveName(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Juan Dela Cruz"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="approve-dept-input"
                oninput="window.updateApproveDept(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Computer Science"
              />
            </div>
          </div>
          
          <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onclick="window.closeApproveModal()"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onclick="window.submitApproveRegistration()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Approve & Register
            </button>
          </div>
        </div>
      </div>
    `,setTimeout(()=>{const v=document.getElementById("approve-name-input");v&&v.focus()},100)}}window.updateApproveName=p=>{u=p},window.updateApproveDept=p=>{h=p},window.closeApproveModal=g,window.submitApproveRegistration=async()=>{const p=document.getElementById("approve-name-input"),v=document.getElementById("approve-dept-input"),y=p?p.value.trim():u,T=v?v.value.trim():h;if(!y||!T){alert("Please enter both name and department");return}try{await Su(d,{name:y,department:T}),await t(),g(),alert("Professor registered successfully!")}catch(re){console.error("Error approving registration:",re),alert("Failed to approve registration: "+re.message)}};async function _(p){f(p)}async function x(p){if(confirm(`Are you sure you want to reject registration for ${p}?`))try{await Tu(p),alert("Registration rejected")}catch(v){console.error("Error rejecting registration:",v),alert("Failed to reject registration")}}return window.toggleRegistrationMode=a,window.approveRegistration=_,window.rejectRegistration=x,`
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">RFID Registration</h1>

        <!-- Registration Form -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Register New Professor</h2>
          
          <div id="registration-error" class="hidden bg-red-50 border border-red-200 rounded p-4 text-red-800 text-sm mb-4"></div>
          <div id="registration-success" class="hidden bg-green-50 border border-green-200 rounded p-4 text-green-800 text-sm mb-4"></div>

          <form id="registration-form" class="space-y-4">
            <div>
              <label for="uid-input" class="block text-sm font-medium text-gray-700 mb-2">
                UID <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="uid-input"
                placeholder="XX:XX:XX:XX (e.g., D9:1B:2E:12)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Format: XX:XX:XX:XX (hexadecimal)</p>
            </div>

            <div>
              <label for="name-input" class="block text-sm font-medium text-gray-700 mb-2">
                Professor Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name-input"
                placeholder="Juan Dela Cruz"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label for="department-input" class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="department-input"
                placeholder="Computer Science"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Register Professor
            </button>
          </form>
        </div>

        <!-- Registration Mode Toggle -->
        <div id="registration-mode-section" class="bg-white rounded-lg shadow p-6 mb-6">
          <!-- Dynamically rendered -->
        </div>

        <!-- Pending Registrations -->
        <div id="pending-registrations-section" class="bg-white rounded-lg shadow p-6 mb-6">
          <!-- Dynamically rendered -->
        </div>

        <!-- Registered Professors List -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Registered Professors</h2>
          <div id="professor-list">
            <div class="text-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading professors...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Approve Modal Container -->
      <div id="approve-modal-container"></div>
    </div>
  `}const X=ct({professors:[],admins:[],logs:[],statistics:{totalProfessors:0,activeProfessors:0,inactiveProfessors:0,totalLogs7Days:0,uniqueUIDs7Days:0},loading:!0,error:null});function eh(){let n=null;bt(async()=>(await e(),n=io(_=>{X.update(x=>({...x,logs:_})),t()}),X.subscribe(()=>{g(),w(),f()}),()=>{n&&n()}));async function e(){try{const[_,x]=await Promise.all([Is(),Ss()]);X.update(p=>({...p,professors:_,admins:x,loading:!1})),t()}catch(_){console.error("Error loading data:",_),X.update(x=>({...x,loading:!1,error:"Failed to load data"}))}}function t(){const _=X.get(),x=_.professors,p=_.logs,v={totalProfessors:x.length,activeProfessors:x.filter(y=>y.status==="active").length,inactiveProfessors:x.filter(y=>y.status==="inactive").length,totalLogs7Days:zu(p),uniqueUIDs7Days:Gu(p)};X.update(y=>({...y,statistics:v}))}async function s(_){const p=X.get().professors.find(T=>T.uid===_);if(!p)return;const v=prompt("Enter new name:",p.name);if(!v||v.trim()==="")return;const y=prompt("Enter new department:",p.department);if(!(!y||y.trim()===""))try{await ro(_,{name:v.trim(),department:y.trim()}),await e(),alert("Professor updated successfully")}catch(T){console.error("Error updating professor:",T),alert("Failed to update professor")}}async function i(_,x){if(confirm(`Are you sure you want to delete professor "${x}"?`))try{await wu(_),await e(),alert("Professor deleted successfully")}catch(p){console.error("Error deleting professor:",p),alert("Failed to delete professor")}}let r=!1,o="",a="";function l(){r=!0,o="",a="",d()}function c(){r=!1,o="",a="",d()}function d(){const _=document.getElementById("add-admin-modal-container");if(_){if(!r){_.innerHTML="";return}_.innerHTML=`
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-bold text-gray-900">Add New Admin</h3>
          </div>
          
          <div class="p-6 space-y-4">
            <div>
              <label for="admin-email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="admin-email"
                oninput="window.updateAddAdminEmail(this.value)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            
            ${a?`
              <div class="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                ${a}
              </div>
            `:""}
          </div>
          
          <div class="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onclick="window.closeAddAdminModal()"
              class="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              onclick="window.submitAddAdmin()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Add Admin
            </button>
          </div>
        </div>
      </div>
    `,setTimeout(()=>{const x=document.getElementById("admin-email");x&&x.focus()},100)}}window.updateAddAdminEmail=_=>{o=_,a=""},window.closeAddAdminModal=c,window.submitAddAdmin=async()=>{const _=document.getElementById("admin-email"),x=_?_.value.trim():o;if(!x||x===""){a="Please enter an email address",d();return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x)){a="Please enter a valid email address",o=x,d();return}const v=x.replace(/[@.]/g,"_");try{await oo(v,{email:x,role:"admin"}),await e(),c(),alert("Admin added successfully")}catch(y){console.error("Error adding admin:",y),a="Failed to add admin. Please try again.",o=x,d()}};async function u(){l()}async function h(_,x){if(confirm(`Are you sure you want to delete admin "${x}"?`))try{await xu(_),await e(),alert("Admin deleted successfully")}catch(p){console.error("Error deleting admin:",p),alert("Failed to delete admin")}}function f(){const _=document.getElementById("admin-statistics");if(!_)return;const p=X.get().statistics;_.innerHTML=`
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Total Professors</div>
          <div class="text-2xl font-bold text-gray-900 mt-1">${p.totalProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Active</div>
          <div class="text-2xl font-bold text-green-600 mt-1">${p.activeProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Inactive</div>
          <div class="text-2xl font-bold text-gray-600 mt-1">${p.inactiveProfessors}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Logs (7 days)</div>
          <div class="text-2xl font-bold text-blue-600 mt-1">${p.totalLogs7Days}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-4">
          <div class="text-sm text-gray-600">Unique UIDs (7d)</div>
          <div class="text-2xl font-bold text-purple-600 mt-1">${p.uniqueUIDs7Days}</div>
        </div>
      </div>
    `}function g(){const _=document.getElementById("professors-table");if(!_)return;const x=X.get();if(x.professors.length===0){_.innerHTML='<div class="text-center py-8 text-gray-500">No professors registered</div>';return}_.innerHTML=`
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">UID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${x.professors.map(p=>`
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono">${p.uid}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">${p.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${p.department}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-semibold rounded-full ${p.status==="active"?"bg-green-100 text-green-800":"bg-gray-100 text-gray-800"}">
                  ${p.status}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">${lt(p.registered_at)}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <button
                  onclick="window.editProfessor('${p.uid}')"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onclick="window.deleteProfessor('${p.uid}', '${p.name}')"
                  class="text-red-600 hover:text-red-800 font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `,window.editProfessor=s,window.deleteProfessor=i}function w(){const _=document.getElementById("admins-table");if(!_)return;const x=X.get();_.innerHTML=`
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">Admin Accounts</h3>
        <button
          onclick="window.addAdmin()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
        >
          Add Admin
        </button>
      </div>
      ${x.admins.length===0?`
        <div class="text-center py-8 text-gray-500">No admin accounts</div>
      `:`
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${x.admins.map(p=>`
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm">${p.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    ${p.role}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onclick="window.deleteAdmin('${p.uid}', '${p.email}')"
                    class="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `}
    `,window.addAdmin=u,window.deleteAdmin=h,window.openAddAdminModal=l,window.closeAddAdminModal=c,window.submitAddAdmin=window.submitAddAdmin,window.updateAddAdminEmail=window.updateAddAdminEmail}return`
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

        <!-- System Statistics -->
        <div class="mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">System Statistics</h2>
          <div id="admin-statistics"></div>
        </div>

        <!-- Professor Management -->
        <div class="bg-white rounded-lg shadow p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">Professor Management</h2>
          <div id="professors-table" class="overflow-x-auto"></div>
        </div>

        <!-- Admin Account Management -->
        <div class="bg-white rounded-lg shadow p-6">
          <div id="admins-table"></div>
        </div>
      </div>
      
      <!-- Add Admin Modal Container -->
      <div id="add-admin-modal-container"></div>
    </div>
  `}const th={"/":Ou,"/dashboard":Xu,"/login":lo,"/registration":Zu,"/admin":eh},nh=["/registration","/admin"];function sh(){return`
    <div class="p-6 text-center">
      <h2 class="text-xl font-bold">404 - Page Not Found</h2>
      <p class="mt-2 text-gray-600">The page you're looking for doesn't exist.</p>
      <a href="#/" class="mt-4 inline-block text-blue-600 hover:underline">Go to Home</a>
    </div>
  `}function Ri(){let n=location.hash.slice(1)||"/";if(n.startsWith("/")||(n="/"+n),nh.includes(n)){const e=Ts();if(!e.isAuthenticated||!e.isAdmin)return location.hash="#/login",lo()}return(th[n]||sh)()}function ih(n){const e=()=>{(location.hash.slice(1)||"/").startsWith("/dashboard")?window.triggerDashboardRender=()=>{n(Ri())}:(window.dashboardCleanup&&(window.dashboardCleanup(),window.dashboardCleanup=null),window.triggerDashboardRender=null),n(Ri())};window.addEventListener("hashchange",e),e()}fo();Nu();function rh(n){const e=performance.now(),t=document.getElementById("app");t&&(t.innerHTML=Lu(n),Pu());const i=(performance.now()-e).toFixed(2),r=document.getElementById("render-time");r&&(r.textContent=i+" ms")}ih(rh);
