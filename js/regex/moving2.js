var fs = require('fs');
var path = require('path');

var toDoFile = process.argv[2];

var fileList = [ toDoFile ];
var regexs = [];

/*var regex1 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm');//<div>abc</div> google+
var regex2 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //<div>abc {{ abc }} | <div>abc {% abc %}
var regex3 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+\\*]*<[/]?(?!script)", 'igm'); //{{ abc }}abc</div> | {% abc %}abc</div>
var regex4 = new RegExp("[%\\}]\\}[\\s,\"#.]*([^><\\}\\{%/\\=\\n\\r]+\\w+)[\\s,\"&#:.!\\?\\+\\*]*\\{[\\{%]", 'igm'); //{{ abc }}abc{{ abc }}
var regex5 = new RegExp("placeholder[ ]*=[ ]*\"([^\\s><\\}\\{%]+[\\w ]{2,})\"", 'igm'); //placeholder*/

var regex1 = new RegExp("= (\"\\s*\") %\\}\\{# (.+) #\\}",'igm');// =\\s\"(\\s)*\"\\s%\\}
regexs.push(regex1);


var allVariableDeclaims="";

fileList.forEach(function(val) {

     var newFilename = path.dirname(val) + "/" + path.basename(val, path.extname(val)) + ".newpage";
    if (fs.existsSync(newFilename)) {
        fs.unlinkSync(newFilename);
    }

    var data = fs.readFileSync(val, {
        encoding: 'utf8'
    });

    if (data.trim() == "") {
        return;
    }

    var rs = parseData(data);

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

                text = matched[2].trim();

                variableOutput = matched[0].replace(matched[1], '"' + text + '"');
                newData = newData.replace(matched[0], variableOutput);
            }

        } while (matched != null)

    });

    return {
        newData: newData,
    };

}

