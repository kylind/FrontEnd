var fs = require('fs');
var path = require('path');
var readline=require('readline');

var toDoFile = process.argv[2];
var rsFile = process.argv[3];


var regexs = []

//var regex1 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm');//<div>abc</div> google+
//var regex2 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //<div>abc {{ abc }} | <div>abc {% abc %}
//var regex3 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm'); //{{ abc }}abc</div> | {% abc %}abc</div>
//var regex4 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=\\n\\r]+\\w+)[\\s,\"&#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //{{ abc }}abc{{ abc }}
//var regex5 = new RegExp("placeholder[ ]*=[ ]*\"([^\\s><\\}\\{%]+[\\w ]{2,})\"", 'igm'); //placeholder

var regex1 = new RegExp("\\{\\{#(.)+#\\}\\}",'igm');

regexs.push(regex1);
//regexs.push(regex2);
//regexs.push(regex3);
//regexs.push(regex4);
//regexs.push(regex5);

var allVariableDeclaims="";

function generateResult(val) {

     var newFilename = path.dirname(val) + "/" + path.basename(val, path.extname(val)) + ".newpage";

    if (fs.existsSync(newFilename)) {
        fs.unlinkSync(newFilename);
    }



    var rl = readline.createInterface({
        input: fs.createReadStream(val),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line) {




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

                    variableDetails = variableDetails.concat("{% set " + variable + ' = "'+text.replace(/"/g,'\\"')+'" %}{# ' + text + ' #}\n\n');

                    variableDeclaim = "{% set " + variable + ' = "" %}{# ' + text + ' #}\n\n';
                    variableDeclaims=variableDeclaims.concat(variableDeclaim);
                    allVariableDeclaims=allVariableDeclaims.concat(variableDeclaim);


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


