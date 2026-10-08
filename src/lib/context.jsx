import React,{createContext,useContext,useEffect,useState} from 'react';
import {localRepository,seed} from './repository';
import {validateFramework} from './model';
const Context=createContext(null);
export const useFramework=()=>useContext(Context);
export function FrameworkProvider({children}){
 const [data,setData]=useState(structuredClone(seed)),[edit,setEdit]=useState(false),[status,setStatus]=useState('Loading workspace'),[history,setHistory]=useState([]);
 useEffect(()=>{localRepository.load().then(d=>{setData(d);setStatus('Local workspace ready');}).catch(e=>setStatus(`Saved workspace could not load: ${e.message}. Original source loaded; export before resetting.`));},[]);
 async function commit(next){const errors=validateFramework(next);if(errors.length)throw new Error(errors.join('\n'));next.meta={...next.meta,revision:(data.meta.revision||1)+1};await localRepository.save(next);setHistory(h=>[...h.slice(-19),data]);setData(next);setStatus('Saved in this browser');}
 async function undo(){if(!history.length)return;const prev=history.at(-1);await localRepository.save(prev);setData(prev);setHistory(h=>h.slice(0,-1));setStatus('Previous revision restored');}
 async function reset(){const d=await localRepository.reset();setHistory(h=>[...h,data]);setData(d);setStatus('Original source restored');}
 return <Context.Provider value={{data,edit,setEdit,status,commit,undo,reset,canUndo:history.length>0}}>{children}</Context.Provider>;
}
