var fs = require('fs');
var path = require('path');
var etree = require("elementtree");

exports.execute = function(relativeTypeScriptFilename) {
    var content = '';
    
    // Setup relativeTypeScriptFilename      
    relativeTypeScriptFilename = relativeTypeScriptFilename.replace(/\//g, '\\');
    if (relativeTypeScriptFilename.charAt(0) === '\\')
    {
        relativeTypeScriptFilename = relativeTypeScriptFilename.substr(1);
    }
    
    addToProjectFile(relativeTypeScriptFilename);
    
    function addToProjectFile(relativeTypeScriptFilename) {
        var relativeRootFolder = path.resolve(__dirname).split('\\node_modules')[0];
        
        fs.readdir(relativeRootFolder, function (err, files) {
            if (err) {
                throw err;
            }
            
            var projectFile = '';
            
            files.map(function (file) {
                return path.join(relativeRootFolder, file);
            }).filter(function (file) {
                return fs.statSync(file).isFile();
            }).forEach(function (file) {
                var fileExtension = path.extname(file);
                
                if (projectFile === '' && (fileExtension === '.csproj' || fileExtension === '.vbproj'))
                {
                    projectFile = file;
                }
            });
            
            if (projectFile !== '') {
                addToProjectFileUpsertTypeScriptFile(projectFile, relativeTypeScriptFilename)
            }
        });    
    }   
    
    function addToProjectFileUpsertTypeScriptFile(projectFile, relativeTypeScriptFilename)
    {
        var data = fs.readFileSync(projectFile).toString();
        var xml = etree.parse(data.toString().replace(/\ufeff/g, ""));
        var projectElement = xml.findall('./Project')[0];
        var typeScriptFileExists = xml.findall('./ItemGroup/TypeScriptCompile[@Include=\'' + relativeTypeScriptFilename + '\']').length === 1;
        var subElement = etree.SubElement;
        var newItemGroup = subElement(xml.getroot(), 'ItemGroup');
        var itemCompile = subElement(newItemGroup, 'TypeScriptCompile');
        
        itemCompile.set('Include', relativeTypeScriptFilename);
        
        var formattor = require("formattor");
        var formattedXml = formattor(xml.write(), {method: 'xml'});
        
        if (!typeScriptFileExists) {
           fs.writeFileSync(projectFile, formattedXml, null);         
        }
    }
     
    function getRelativeRootFolder() {
        var rootFolder = path.resolve(__dirname).split('\\node_modules')[0];
        var relativeNpmFolder = __dirname.replace(rootFolder, "");
        var relativeRootFolder = '/';
        var index = 0;
        
        var virtualFoldersCount = (relativeNpmFolder.match(/\\/g) || []).length;
        for (var i = 0; i < virtualFoldersCount; i++)
        {
            relativeRootFolder = relativeRootFolder + '../';                
        }
        
        return relativeRootFolder;
    }
}


