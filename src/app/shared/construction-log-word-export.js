(function(global){
  "use strict";

  const TEMPLATE_URL="./docs/施工日志在线填报导出模板.docx";
  const WORD_MIME="application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  function text(value,fallback="-"){
    const result=String(value??"").trim();
    return result||fallback;
  }

  function safeFileName(value){
    return text(value,"施工日志").replace(/[\\/:*?"<>|]/g,"_");
  }

  function setNodeText(node,value){
    const nodes=[...node.getElementsByTagName("w:t")];
    if(!nodes.length)return;
    nodes[0].textContent=text(value);
    nodes.slice(1).forEach(item=>item.textContent="");
  }

  function cellText(cell){
    return [...cell.getElementsByTagName("w:t")].map(item=>item.textContent||"").join("");
  }

  function setCellText(cell,value){
    setNodeText(cell,value);
  }

  function getTables(xml){
    return [...xml.getElementsByTagName("w:tbl")];
  }

  function getRows(table){
    return [...table.childNodes].filter(node=>node.nodeName==="w:tr");
  }

  function getCells(row){
    return [...row.childNodes].filter(node=>node.nodeName==="w:tc");
  }

  function fillLabelValueTable(table,values){
    getRows(table).forEach(row=>{
      const cells=getCells(row);
      for(let index=0;index<cells.length-1;index+=2){
        const label=cellText(cells[index]).trim();
        if(Object.prototype.hasOwnProperty.call(values,label))setCellText(cells[index+1],values[label]);
      }
    });
  }

  function fillWorkTable(table,rows,includeProgress){
    const sourceRows=getRows(table);
    const header=sourceRows[0];
    const sample=sourceRows[1]||sourceRows[0];
    sourceRows.slice(1).forEach(row=>row.remove());
    const values=rows.length?rows:[{}];
    values.forEach((item,index)=>{
      const row=sample.cloneNode(true);
      const imageLabel=item.imageName||(item.imageUrl?"施工图片":"-");
      const cells=getCells(row);
      const rowValues=includeProgress
        ?[index+1,item.area,item.subitem,item.position,item.content,item.progress,imageLabel,item.reporter,item.remark]
        :[index+1,item.area,item.subitem,item.position,item.content,imageLabel,item.reporter,item.remark];
      cells.forEach((cell,cellIndex)=>setCellText(cell,rowValues[cellIndex]));
      table.appendChild(row);
    });
    if(!header.parentNode)table.insertBefore(header,table.firstChild);
  }

  function riskValues(risk){
    if(!Array.isArray(risk))return {};
    const result={};
    for(let index=0;index<risk.length-1;index+=2)result[text(risk[index],"")]=risk[index+1];
    return result;
  }

  function normalizeMilestone(item,completed){
    return {
      "里程碑节点名称":item?.nodeName,
      "计划完成日期（最新）":item?.planLatestDate,
      "节点状态":item?.nodeStatus,
      "管控等级":item?.controlLevel,
      "是否重点进度节点":item?.keyNode,
      "实际完成日期":item?.actualDate,
      "里程碑情况":completed?"-":item?.milestoneStatus,
      "里程碑进展情况":completed?"-":item?.milestoneProgress
    };
  }

  function replaceParagraph(xml,prefix,value){
    const paragraphs=[...xml.getElementsByTagName("w:p")];
    const paragraph=paragraphs.find(item=>[...item.getElementsByTagName("w:t")].map(node=>node.textContent||"").join("").startsWith(prefix));
    if(paragraph)setNodeText(paragraph,value);
  }

  function buildDocumentXml(xmlText,payload){
    const parser=new DOMParser();
    const xml=parser.parseFromString(xmlText,"application/xml");
    if(xml.getElementsByTagName("parsererror").length)throw new Error("Word 模板 XML 解析失败");
    const {row,projectName,detail}=payload;
    const tables=getTables(xml);
    fillLabelValueTable(tables[0],{
      "项目名称":projectName,
      "施工工区":row.workArea,
      "日期":row.date,
      "星期":typeof getProjectLogReadonlyWeekday==="function"?getProjectLogReadonlyWeekday(row.date):"-",
      "温度":detail.temperature,
      "天气是否影响工作":detail.weatherImpact,
      "记录人":row.uploader,
      "上报时间":row.uploadTime
    });
    fillLabelValueTable(tables[1],Object.fromEntries((detail.personnel||[]).map(item=>[item[0],`${text(item[1],"0")} 人`])));
    fillWorkTable(tables[2],detail.today||[],true);
    fillWorkTable(tables[3],detail.tomorrow||[],false);

    const allMilestones=[...(detail.milestones||[]),...(payload.completedMilestones||[])];
    const ongoing=allMilestones.find(item=>!item.actualDate)||{};
    const completed=allMilestones.find(item=>item.actualDate)||{};
    fillLabelValueTable(tables[4],normalizeMilestone(ongoing,false));
    fillLabelValueTable(tables[5],normalizeMilestone(completed,true));
    fillLabelValueTable(tables[6],riskValues((detail.risks||[])[0]));
    fillLabelValueTable(tables[7],riskValues((detail.risks||[])[1]));
    setCellText(getCells(getRows(tables[8])[0])[0],detail.stop);

    replaceParagraph(xml,"今日主要工作",`今日主要工作  ${row.date}`);
    const tomorrowDate=typeof getProjectLogNextDateValue==="function"?getProjectLogNextDateValue(row.date):row.date;
    replaceParagraph(xml,"明日主要工作",`明日主要工作  ${tomorrowDate}`);
    replaceParagraph(xml,"说明：","说明：本文件由数智施工平台根据在线填报内容自动生成。");
    return new XMLSerializer().serializeToString(xml);
  }

  async function exportConstructionLogWord(payload){
    if(!global.JSZip)throw new Error("Word 导出组件未加载");
    const response=await fetch(TEMPLATE_URL,{cache:"no-store"});
    if(!response.ok)throw new Error(`Word 模板加载失败（${response.status}）`);
    const zip=await global.JSZip.loadAsync(await response.arrayBuffer());
    const documentPart=zip.file("word/document.xml");
    if(!documentPart)throw new Error("Word 模板正文缺失");
    const xmlText=await documentPart.async("string");
    zip.file("word/document.xml",buildDocumentXml(xmlText,payload));
    const blob=await zip.generateAsync({type:"blob",mimeType:WORD_MIME,compression:"DEFLATE",compressionOptions:{level:6}});
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement("a");
    anchor.href=url;
    anchor.download=`施工日志_${safeFileName(payload.projectName)}_${safeFileName(payload.row.date)}.docx`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  global.exportConstructionLogWord=exportConstructionLogWord;
})(window);
