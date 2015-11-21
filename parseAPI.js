var fs = require('fs');
var assert = require("assert");
srcPath = 'E:/Cocos/frameworks/cocos2d-x-3.9/cocos/scripting/lua-bindings/auto/api';
//var srcPath = 'D:/testSrc/apple'
var savePath = "D:/snippet";
var template = fs.readFileSync("D:/testSrc/template.sublime-snippet","utf8");
var ccuiClass = [];
var ccClass = [];
var g_FuncNamesMap = {};
function explorer(path){
  // var tmpPath = path.replace(srcPath,savePath)
  // if(fs.existsSync(tmpPath) == false){
  //   fs.mkdirSync(tmpPath)
  // }
  var files = fs.readdirSync(path);
  files.forEach(function(file){
      var stat = fs.statSync(path + '/' + file);
      if(stat.isDirectory()){              
      }else{
          parseFile(path,file);
      }                 
  });
  saveResultToFile()
}

function parseFile(path,file){
  var str = fs.readFileSync(path+ "/"+file,"utf8");
  var parentModelName = getModuleName(str,"@parent_module")
  var moduleName = getModuleName(str,"@module")
  var className = parentModelName + "." + moduleName;
  g_FuncNamesMap[className] = className;
  getFuncNamesAndContents(str,className);
}


function getModuleName(str,pattern){
  var beginIndex = str.search(pattern)+ pattern.length + 1;
  var length = 0;
  for(var i= beginIndex ;/^[a-zA-Z]$/.test(str[i]);i++){
    length ++;
  }
  return str.substr(beginIndex,length)
}


function getFuncNamesAndContents(str,className){
  // var funcNames =  str.match(/[^ ][_a-zA-Z]*(?=[ ]*\n[ ]*--[ ]*@param[ ]* self)/gm);
  var subStrs = str.match(/\n(--.{1,}\n)*/gm)
  var funcNames = [];
  for(var i in subStrs){
    var funcName = subStrs[i].match(/[^ ][_a-zA-Z]*(?=[ ]*\n[ ]*--[ ]*@param[ ]* self)/gm);
    if(funcName == null){
      continue;
    }
    else{
      funcName = funcName[0];
    }
    var triggerParamsStr = "";
    var contentParamsStr = "";
    var params = subStrs[i].match(/@param #[\S]*/gm)
    if(params!= null){
      for(var k in params){
        var tmp = params[k].match(/[^ #]\S{1,}$/gm)[0]
        var tmpK = parseInt(k) + 1;
        if(k!=0){
          triggerParamsStr +=",";
          contentParamsStr += ",";
        }
        contentParamsStr += "${" + tmpK + ":" + tmp +"}";
        triggerParamsStr += tmp;
      }
    }
    var triggerValue = funcName + "("+triggerParamsStr + ")";
    var contentValue = funcName + "("+contentParamsStr + ")";
    g_FuncNamesMap[className + ":" + triggerValue] = className + ":" + contentValue;
  }
}

function saveResultToFile(){
  var result = "";
  for (var i in g_FuncNamesMap){
    console.log(i);
    result = template.replace("$trigger",i);
    result = result.replace("$content",g_FuncNamesMap[i]);
    var fileName = i.replace(/:/g,"_");
    assert(true,result.length>0)
    fs.writeFileSync("D:/snippet/"+fileName + ".sublime-snippet",result);
  }
  console.log(result);
 // fs.writeFile(savePath,JSON.stringify(result));
}

explorer(srcPath)