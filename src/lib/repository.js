import seed from '../data/framework.json';
import {validateFramework} from './model';
const KEY='mcit-architecture-workspace-v1';
// Repository boundary: replace this adapter with authenticated remote storage.
export const localRepository={
 async load(){const raw=localStorage.getItem(KEY);if(!raw)return structuredClone(seed);const d=JSON.parse(raw);const errors=validateFramework(d);if(errors.length)throw new Error(errors.join('\n'));return d;},
 async save(d){const errors=validateFramework(d);if(errors.length)throw new Error(errors.join('\n'));localStorage.setItem(KEY,JSON.stringify(d));},
 async reset(){localStorage.removeItem(KEY);return structuredClone(seed);}
};
export {seed};
