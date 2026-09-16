const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'src/app/production/output-management.js'),'utf8');
const context=vm.createContext({window:{},tableColumnDefinitions:{},isOutputForecastWeakIndustry:()=>true});
vm.runInContext(source.slice(0,source.indexOf('const actualOutputReportState=')),context);
const run=code=>vm.runInContext(code,context);
const cents=value=>Math.round(value*100);
const sumMonths=(row,year)=>Object.entries(row.monthlyOutputs).reduce((sum,[period,value])=>sum+(period.startsWith(year+'-')?cents(value||0):0),0);
assert.equal(run('outputForecastState.outputYear'),String(Math.min(2026,Math.max(2024,new Date().getFullYear()))));
for(const year of [2024,2025,2026]){
  run(`outputForecastState.outputYear='${year}'`);
  const count=year===2024?0:run('getOutputForecastMonthCount()');
  const columns=run('getOutputForecastColumns()');
  const monthly=columns.filter(col=>col.key.startsWith('monthlyOutput_'));
  assert.deepEqual(Array.from(monthly,col=>col.title),Array.from({length:count},(_,i)=>`${count-i}月完成产值(万元)`));
  assert.ok(monthly.every(col=>col.width===140));
  assert.equal(columns.find(col=>col.key==='completedTo2025').title,`至${year-1}年末累计完成产值(万元)`);
  if(year===2024){
    const initial=columns.filter(col=>col.key==='initialOutput2024');
    assert.equal(initial.length,1);
    assert.equal(columns.at(-1).key,'initialOutput2024');
    assert.equal(initial[0].title,'期初值（万元）');
    assert.equal(initial[0].width,140);
    assert.equal(initial[0].render({}),'0.00');
    assert.equal(initial[0].render({annualCompletedOutput:1234.56}),'1,234.56');
    run("outputForecastState.activeTab='城市运营'; outputForecastState.reportScope='branch'");
    assert.equal(run('getOutputForecastColumns().at(-1).key'),'initialOutput2024');
    assert.equal(run('getOutputForecastColumns().filter(col=>col.key.startsWith("monthlyOutput_")).length'),0);
    for(const row of run('getOutputForecastFilteredRows()')){
      assert.equal(cents(row.annualCompletedOutput),sumMonths(row,2024));
    }
    run("outputForecastState.activeTab='施工类'; outputForecastState.reportScope='project'");
  }else{
    assert.equal(columns.some(col=>col.key==='initialOutput2024'),false);
    assert.equal(monthly[0].render({monthlyOutputs:{}}),'0.00');
  }
  for(const row of run('getOutputForecastSearchRows()')){
    assert.equal(cents(row.annualCompletedOutput),sumMonths(row,year));
    assert.equal(cents(row.accumulatedOutput),cents(row.completedTo2025)+cents(row.annualCompletedOutput));
    assert.equal(cents(row.remainingContractOutput)+cents(row.accumulatedOutput),cents(row.contractAmount));
    assert.ok(Number(row.bidDate.slice(0,4))<=year);
  }
}
run("outputForecastState.outputYear='2026'");
const originals=run('outputForecastConstructionRows');
for(let month=1;month<=8;month++){
  const period=`2026-${String(month).padStart(2,'0')}`;
  assert.ok(originals.every(row=>Object.hasOwn(row.monthlyOutputs,period)));
  assert.ok(originals.some(row=>row.monthlyOutputs[period]>0));
}
for(const row of originals){
  assert.equal(row.monthlyOutputs['2026-05'],row.mayOutput);
  assert.equal(sumMonths(row,2024)+sumMonths(row,2025),cents(row.completedTo2025));
  assert.equal(row.monthlyOutputs['2026-09'],0);
}
run("outputForecastState.activeTab='设计'; outputForecastState.reportScope='branch'");
const before=run('getOutputForecastFilteredRows()[0]');
run("outputForecastConstructionRows.push({...outputForecastConstructionRows[10],id:99,monthlyOutputs:{'2026-05':100,'2026-08':50}})");
const grouped=run('getOutputForecastFilteredRows()[0]');
assert.equal(cents(grouped.annualCompletedOutput),cents(before.annualCompletedOutput)+15000);
assert.equal(cents(grouped.annualCompletedOutput),sumMonths(grouped,2026));
assert.equal(grouped.monthlyOutputs['2026-05'],15178);
assert.equal(cents(grouped.monthlyOutputs['2026-08']),cents(before.monthlyOutputs['2026-08'])+5000);
assert.equal(originals[10].monthlyOutputs['2026-05'],15078);
const core=fs.readFileSync(path.join(root,'src/app/core/00-data-and-utils.js'),'utf8');
context.localStorage={getItem:()=>JSON.stringify(run('getOutputForecastColumns().filter(col=>!col.key.endsWith("2026-09")).map((col,index)=>({key:col.key,order:index+1}))'))};
context.getColumnStorageKey=()=> 'test';
run('tableColumnDefinitions.outputForecastConstruction=getOutputForecastColumns()');
vm.runInContext(core.slice(core.indexOf('function getDefaultColumnConfig('),core.indexOf('function getVisibleColumns(')),context);
const config=run('getColumnConfig("outputForecastConstruction").filter(col=>col.key.startsWith("monthlyOutput_"))');
assert.deepEqual(Array.from(config,col=>col.key),Array.from(run('getOutputForecastMonthColumns()'),col=>col.key));
assert.ok(config.every(col=>col.width===140));
console.log('PASS: year filtering, dynamic columns, 140px, Jan–Aug data, zero fallback, annual/monthly sums, cumulative balances, branch aggregation and column settings');
