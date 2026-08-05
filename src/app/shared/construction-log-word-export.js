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

  function compactDate(value){
    return String(value||"").replace(/\D/g,"").slice(0,8)||"unknown";
  }

  function downloadBlob(blob,fileName){
    const url=URL.createObjectURL(blob);
    const anchor=document.createElement("a");
    anchor.href=url;
    anchor.download=fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
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
    return new XMLSerializer().serializeToString(xml);
  }

  async function createConstructionLogWordBlob(payload){
    if(!global.JSZip)throw new Error("Word 导出组件未加载");
    const response=await fetch(TEMPLATE_URL,{cache:"no-store"});
    if(!response.ok)throw new Error(`Word 模板加载失败（${response.status}）`);
    const zip=await global.JSZip.loadAsync(await response.arrayBuffer());
    const documentPart=zip.file("word/document.xml");
    if(!documentPart)throw new Error("Word 模板正文缺失");
    const xmlText=await documentPart.async("string");
    zip.file("word/document.xml",buildDocumentXml(xmlText,payload));
    return zip.generateAsync({type:"blob",mimeType:WORD_MIME,compression:"DEFLATE",compressionOptions:{level:6}});
  }

  async function exportConstructionLogWord(payload){
    const blob=await createConstructionLogWordBlob(payload);
    downloadBlob(blob,`施工日志_${safeFileName(payload.projectName)}_${safeFileName(payload.row.date)}.docx`);
  }

  function getOnlineRecord(row){
    if(row?.onlineRecord)return row.onlineRecord;
    return row?.mode==="online"||row?.mode==="merged"?row:null;
  }

  function getFileRecord(row){
    if(row?.fileRecord)return row.fileRecord;
    return row?.mode==="file"||row?.mode==="merged"?row:null;
  }

  function collectAttachmentFiles(row){
    const fileRow=getFileRecord(row);
    if(!fileRow)return [];
    const entryFiles=Array.isArray(fileRow.fileEntries)
      ?fileRow.fileEntries.flatMap(entry=>Array.isArray(entry.files)?entry.files:[])
      :[];
    const directFiles=Array.isArray(fileRow.files)?fileRow.files:[];
    const source=entryFiles.length?entryFiles:directFiles.length?directFiles:(fileRow.fileName?[{name:fileRow.fileName,sizeText:fileRow.fileSize}]:[]);
    return source.map((file,index)=>({
      file,
      name:safeFileName(file?.name||`施工日志附件_${index+1}.dat`)
    }));
  }

  function getAttachmentBlob(file,date){
    if(file instanceof Blob)return file;
    if(file?.blob instanceof Blob)return file.blob;
    if(file?.content instanceof Blob)return file.content;
    if(typeof file?.content==="string")return new Blob([file.content],{type:file.type||"application/octet-stream"});
    return new Blob([
      `数智施工平台模拟附件\r\n`,
      `日志日期：${date}\r\n`,
      `文件名称：${file?.name||"施工日志附件"}\r\n`,
      `文件大小：${file?.sizeText||file?.size||"-"}\r\n`
    ],{type:file?.type||"application/octet-stream"});
  }

  function uniqueEntryName(name,usedNames){
    const normalized=safeFileName(name);
    const lower=normalized.toLowerCase();
    if(!usedNames.has(lower)){
      usedNames.add(lower);
      return normalized;
    }
    const dot=normalized.lastIndexOf(".");
    const base=dot>0?normalized.slice(0,dot):normalized;
    const extension=dot>0?normalized.slice(dot):"";
    let index=1;
    let candidate="";
    do{
      candidate=`${base}(${index++})${extension}`;
    }while(usedNames.has(candidate.toLowerCase()));
    usedNames.add(candidate.toLowerCase());
    return candidate;
  }

  async function buildDayExportFiles(row,options){
    const files=[];
    const onlineRow=getOnlineRecord(row);
    if(onlineRow){
      const payload={
        row:onlineRow,
        projectName:options.projectName||onlineRow.projectName||"施工项目",
        detail:options.detailBuilder(onlineRow),
        completedMilestones:options.completedMilestones||[]
      };
      files.push({
        name:`施工日志_${compactDate(row.date)}.docx`,
        blob:await createConstructionLogWordBlob(payload)
      });
    }
    collectAttachmentFiles(row).forEach(item=>files.push({
      name:item.name,
      blob:getAttachmentBlob(item.file,row.date)
    }));
    return files;
  }

  async function exportConstructionLogRecords(records,options={}){
    if(!global.JSZip)throw new Error("压缩导出组件未加载");
    if(typeof options.detailBuilder!=="function")throw new Error("施工日志详情转换器缺失");
    const rows=(Array.isArray(records)?records:[]).filter(row=>row?.date);
    if(!rows.length)return {count:0,type:"empty"};
    const groups=new Map();
    rows.forEach(row=>{
      if(!groups.has(row.date))groups.set(row.date,[]);
      groups.get(row.date).push(row);
    });
    const dates=[...groups.keys()].sort((a,b)=>b.localeCompare(a));
    const mergedRows=dates.map(date=>{
      const group=groups.get(date);
      if(group.length===1)return group[0];
      const onlineRecord=group.map(getOnlineRecord).find(Boolean)||null;
      const attachments=group.flatMap(row=>collectAttachmentFiles(row).map(item=>item.file));
      const sourceFileRecord=group.map(getFileRecord).find(Boolean)||null;
      const fileRecord=attachments.length?{...(sourceFileRecord||{}),mode:"file",fileEntries:[],files:attachments}:null;
      return {
        ...group[0],
        date,
        mode:onlineRecord&&fileRecord?"merged":onlineRecord?"online":"file",
        onlineRecord,
        fileRecord,
        files:attachments
      };
    });

    if(mergedRows.length===1){
      const row=mergedRows[0];
      const files=await buildDayExportFiles(row,options);
      if(!files.length)return {count:0,type:"empty"};
      if(files.length===1){
        downloadBlob(files[0].blob,files[0].name);
        return {count:1,type:"file",fileName:files[0].name};
      }
      const zip=new global.JSZip();
      const used=new Set();
      files.forEach(file=>zip.file(uniqueEntryName(file.name,used),file.blob));
      const fileName=`施工日志_${compactDate(row.date)}.zip`;
      downloadBlob(await zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}),fileName);
      return {count:files.length,type:"day-zip",fileName};
    }

    const zip=new global.JSZip();
    let fileCount=0;
    for(const row of mergedRows){
      const folder=zip.folder(`施工日志_${compactDate(row.date)}`);
      const used=new Set();
      const files=await buildDayExportFiles(row,options);
      files.forEach(file=>{
        folder.file(uniqueEntryName(file.name,used),file.blob);
        fileCount++;
      });
    }
    const fileName="施工日志.zip";
    downloadBlob(await zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}}),fileName);
    return {count:fileCount,type:"multi-day-zip",fileName,days:mergedRows.length};
  }

  global.createConstructionLogWordBlob=createConstructionLogWordBlob;
  global.exportConstructionLogWord=exportConstructionLogWord;
  global.exportConstructionLogRecords=exportConstructionLogRecords;
})(window);
