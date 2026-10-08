export const collections=['stages','programs','gates','criteria','interventions','milestones','outcomes','kpis','services','routes','decisions','risks','assumptions','glossary','ambiguities','marketPositions','evidenceModels'];
export const byId=(list,id)=>list.find(x=>x.id===id);
export const resolve=(list,ids=[])=>ids.map(id=>byId(list,id)).filter(Boolean);
export const kindOf=c=>c.type.toLowerCase().includes('mandatory')?'mandatory':c.type.toLowerCase().includes('weighted')?'weighted':c.type.toLowerCase().includes('contextual')?'contextual':'directional';
const refs={startStageId:'stages',endStageId:'stages',entryGateIds:'gates',exitGateIds:'gates',criterionIds:'criteria',interventionIds:'interventions',milestoneIds:'milestones',outcomeIds:'outcomes',kpiIds:'kpis',serviceIds:'services',routeIds:'routes',programId:'programs',programIds:'programs',gateId:'gates',marketPositionId:'marketPositions'};
export function validateFramework(d){
 const errors=[];
 if(!d||d.schemaVersion!==1)return ['Unsupported framework schema. Expected schemaVersion 1.'];
 if(!d.meta||typeof d.meta.title!=='string')errors.push('Missing metadata/title.');
 for(const key of [...collections,'sections']){
  if(!Array.isArray(d[key])){errors.push(`${key} must be an array.`);continue;}
  const seen=new Set();
  for(const x of d[key]){if(!x||typeof x.id!=='string'||!x.id)errors.push(`${key}: missing ID.`);else if(seen.has(x.id))errors.push(`${key}: duplicate ID ${x.id}.`);else seen.add(x.id);
   if(key!=='sections'&&typeof x.name!=='string')errors.push(`${key}: name must be text.`);
  }
 }
 if(errors.length)return errors;
 for(const key of collections)for(const x of d[key])for(const [field,target] of Object.entries(refs))if(field in x){
  const vals=Array.isArray(x[field])?x[field]:[x[field]];
  for(const id of vals)if(id!=='Any'&&!d[target].some(y=>y.id===id))errors.push(`${key}/${x.id}: ${field} references missing ${id}.`);
 }
 for(const p of d.programs){if(!/^#[0-9a-f]{6}$/i.test(p.color||''))errors.push(`${p.id}: color must be a six-digit hex value.`);
  if(!['explore','incubation','acceleration','soft-landing','internationalization','relationship'].includes(p.type))errors.push(`${p.id}: unsupported program type.`);
  const start=byId(d.stages,p.startStageId),end=byId(d.stages,p.endStageId);if(start&&end&&start.order>end.order)errors.push(`${p.id}: maturity band ends before it starts.`);
  for(const field of ['entryGateIds','exitGateIds','interventionIds','milestoneIds','outcomeIds','kpiIds','routeIds','serviceIds'])if(!Array.isArray(p[field]))errors.push(`${p.id}: ${field} must be an array.`);
 }
 for(const g of d.gates){if(!['entry','exit'].includes(g.kind))errors.push(`${g.id}: gate kind must be entry or exit.`);if(!Array.isArray(g.criterionIds))errors.push(`${g.id}: criterionIds must be an array.`);else for(const c of resolve(d.criteria,g.criterionIds))if(c.gateId!==g.id)errors.push(`${g.id}: criterion ${c.id} belongs to another gate.`);}
 for(const c of d.criteria)for(const f of ['type','evidence','threshold','method'])if(typeof c[f]!=='string')errors.push(`${c.id}: ${f} must be text.`);
 for(const s of d.stages)if(!Number.isFinite(s.order))errors.push(`${s.id}: order must be numeric.`);
 const nodes=new Set([...d.programs,...d.services].map(x=>x.id).concat(['Any','independent','responsible-exit']));
 for(const r of d.routes)if(!nodes.has(r.fromId)||!nodes.has(r.toId))errors.push(`${r.id}: routing endpoint does not exist.`);
 for(const s of d.sections)if(typeof s.title!=='string'||!Array.isArray(s.blocks))errors.push(`${s.id}: invalid source archive section.`);
 return errors;
}
export function evaluateGate(gate,criteria,answers={}){
 const items=criteria.map(c=>({criterion:c,answer:answers[c.id]||{state:'unassessed',evidence:'unverified'}}));
 const mandatory=items.filter(x=>kindOf(x.criterion)==='mandatory'&&!x.criterion.type.toLowerCase().includes('completion'));
 const passed=items.filter(x=>x.answer.state==='meets'&&x.answer.evidence==='verified');
 const failures=mandatory.filter(x=>x.answer.state==='does-not-meet');
 const pending=mandatory.filter(x=>!passed.includes(x)&&!failures.includes(x));
 const contextual=items.filter(x=>kindOf(x.criterion)==='contextual'||x.answer.state==='not-applicable');
 const attention=items.filter(x=>!passed.includes(x));
 const conflicts=failures.filter(x=>/graduate at/i.test(x.criterion.ifNotAchieved||''));
 let status='Assessment incomplete',recommendation='Gather and verify evidence before a decision.';
 if(failures.length){status=gate.kind==='exit'?'Mandatory exit requirements not met':'Not yet eligible';recommendation=gate.kind==='exit'?'Completion is not graduation. Review the specified fallback routes.':'Hold and strengthen, refer, or route to the appropriate maturity band.';}
 else if(pending.length){status='Evidence / exception review required';recommendation='Partial, unverified or not-applicable mandatory criteria do not automatically pass.';}
 else if(!mandatory.length){status='Panel review required';recommendation='This gate has no mandatory criteria. No automated eligibility rule is defined.';}
 else if(gate.kind==='entry'){status='Mandatory conditions met';recommendation='Eligible for panel consideration, not an admission decision. Weighted score bands are not defined in the source.';}
 else{status='Graduation requirements met';recommendation='Candidate for graduation after panel verification. Next-program qualification requires a separate entry-gate assessment.';}
 return {status,recommendation,passed,failures,pending,attention,contextual,conflicts,items};
}
export function getIncomingReferences(d,collection,id){
 const result=[];for(const key of collections)for(const x of d[key])for(const [field,target]of Object.entries(refs))if(target===collection&&(x[field]===id||Array.isArray(x[field])&&x[field].includes(id)))result.push(`${key}/${x.id}/${field}`);
 if(['programs','services'].includes(collection))for(const r of d.routes)if(r.fromId===id||r.toId===id)result.push(`routes/${r.id}`);
 return result;
}
export function downloadJSON(data,name='framework.json'){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
