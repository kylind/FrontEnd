var fs = require('fs');
var path = require('path');

var toDoFolder = process.argv[2];
var rsFile = toDoFolder + '_result/lang.page'; //process.argv[3];
var detailFile = toDoFolder + '_result/detail.page';//process.argv[4];



var fileList = fetchPageFiles(toDoFolder);
var regexs = []


var regex1 = { regex:/(>|\}\}|%\})[\s]*([^><\}\{%=\/]*[\w,]{2,}\s*(<br>)?\s*[^><\}\{%=\/]*[\w;\.!,#:\*\|\?])[\s]*(<|<\/|\{\{|\{%)(?!script)/igm, index: 2};//<div>abc</div> google+
var regex2 = { regex: /placeholder[ ]*=[ ]*['"]([\w ]{2,})['"]/igm, index:1}; //placeholder

var test=/\w/igm;

regexs.push(regex1);
regexs.push(regex2);


var allVariableDeclaims="";

fileList.forEach(function(val) {

     //var newFilename = path.dirname(val) + "" + path.basename(val, path.extname(val)) + ".newpage";
    var newFilename = val.replace(toDoFolder, toDoFolder + '_result');

    if(!fs.existsSync(path.dirname(newFilename))){
       fs.mkdirSync(path.dirname(newFilename));
    }


    var data = fs.readFileSync(val, {
        encoding: 'utf8'
    });

    if (data.trim() == "") {
        return;
    }

    var rs = parseData(data,allVariableDeclaims);
    allVariableDeclaims = rs.allVariableDeclaims;

    if (rs.variableDeclaims != "") {

        fs.appendFileSync(rsFile, "{# ------------ " + path.basename(val) + " ------------ #}\n" + rs.variableDeclaims);
    }

    if (rs.variableDetails != "") {
        fs.appendFileSync(detailFile, "{# ------------ " + path.basename(val) + " ------------ #}\n" + rs.variableDetails);
    }

    if (rs.newData != "") {

        fs.writeFileSync(newFilename, rs.newData);

    }

});


function parseData(data,allVariableDeclaims) {

    var text = "";
    var variable = "";
    var variableDeclaim = "";
    var variableDeclaims = "";
    var variableDetails = "";
    var variableOutput = "";

    var newData = data;
    regexs.forEach(function(regObj) {

        do {
            var matched = regObj.regex.exec(data);
            if (matched) {

                text = matched[regObj.index].trim();

                variable = text.substring(0, 50).replace(/[^0-9a-zA-Z]/g, '_');

                if(/^\d\w/.test(variable)){
                    variable="_"+variable;
                }
                if(variable=="in"||variable=="or"){
                    variable=variable+"_";
                }

                var variableVal=text.replace(/"/g,'\\"').replace(/[\n\r]/g,' ');

                if (allVariableDeclaims.indexOf("{# " + variableVal + " #}")==-1) {



                    variableDetails = variableDetails.concat("{% set " + variable + ' = "'+variableVal+'" %}{# ' + variableVal + ' #}\n\n');

                    variableDeclaim = "{% set " + variable + ' = "" %}{# ' + variableVal + ' #}\n\n';
                    variableDeclaims=variableDeclaims.concat(variableDeclaim);
                    allVariableDeclaims=allVariableDeclaims.concat(variableDeclaim);
                }

                var needRaw=/<br>|(&\w{2,5};)/im.test(variableVal)

                var rawSuffix=needRaw ? '|raw' :''

                variableOutput = matched[0].replace(matched[regObj.index], "{{ " + variable + rawSuffix +" }}")
                newData = newData.replace(matched[0], variableOutput);
            }

        } while (matched != null)

    });

    return {
        newData: newData,
        variableDeclaims: variableDeclaims,
        variableDetails:variableDetails,
        allVariableDeclaims: allVariableDeclaims

    };

}


function fetchPageFiles(dir) {
    dir = path.resolve(dir);
    var fileList = [];
    var files = fs.readdirSync(dir);
    files.forEach(function(val) {
        var filePath = dir + "/" + val;

        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {


            var filesInDir = fetchPageFiles(filePath);
            fileList = fileList.concat(filesInDir);

        } else {
            var extname = path.extname(filePath);
            var basename=path.basename(filePath, path.extname(filePath))
            if (extname == ".page" || extname == ".nopage" || (extname == ".tpt" && basename !="debugBar" && basename!="socialShare")) {
                fileList.push(filePath);
            }
        }

    })
    return fileList
}
