var fs = require('fs');
var path = require('path');

var toDoFolder = process.argv[2];
var rsFile = process.argv[3];
var detailFile = process.argv[4];


var fileList = fetchPageFiles(toDoFolder);
var regexs = []

var regex1 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm');//<div>abc</div> google+
var regex2 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //<div>abc {{ abc }} | <div>abc {% abc %}
var regex3 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm'); //{{ abc }}abc</div> | {% abc %}abc</div>
var regex4 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=\\n\\r]+\\w+)[\\s,\"&#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //{{ abc }}abc{{ abc }}
var regex5 = new RegExp("placeholder[ ]*=[ ]*\"([^\\s><\\}\\{%]+[\\w ]{2,})\"", 'igm'); //placeholder

regexs.push(regex1);
regexs.push(regex2);
regexs.push(regex3);
regexs.push(regex4);
regexs.push(regex5);

var allVariableDeclaims="";

fileList.forEach(function(val) {

    var newFilename = val;

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
    regexs.forEach(function(regex) {

        do {
            var matched = regex.exec(data);
            if (matched) {

                text = matched[1].trim();
                variable = text.substring(0, 50).replace(/[^0-9a-zA-Z]/g, '_');

                if(/^\d\w/.test(variable)){
                    variable="_"+variable;
                }
                if(variable=="in"||variable=="or"){
                    variable=variable+"_";
                }

                if (allVariableDeclaims.indexOf("{# " + text + " #}")==-1) {

                    variableDetails = variableDetails.concat("{% set " + variable + ' = "'+text.replace(/"/g,'\\"')+'" %}{# ' + text + ' #}\n\n');

                    variableDeclaim = "{% set " + variable + ' = "" %}{# ' + text + ' #}\n\n';
                    variableDeclaims=variableDeclaims.concat(variableDeclaim);
                    allVariableDeclaims=allVariableDeclaims.concat(variableDeclaim);
                }

                variableOutput = matched[0].replace(matched[1], "{{ " + variable + " }}")
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
