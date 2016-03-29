# node-add-typescript-file-to-project

Source code for node module: add-typescript-file-to-project

This node module will add a reference to a given TypeScript file to your Visual Studio project file. (.csproj / .vbproj)

The project file will only be changed if the file is not already referenced, if changed Visual Studio will prompt you to reload your project file.

To use this node module at a reference to your project package.json dependencies.

{
    "dependencies": {
        "add-typescript-file-to-project": "1.0.0"
    }
}

The script requires one parameter, the virtual path to the TypeScript file you want to add.

So, to use the module in for instance a gulp task:

var addTypeScript = require('add-typescript-file-to-project');
    
addTypeScript.execute('/app/resources/some-file.ts');

Voilá, a reference to '/app/resources/some-file.ts' is added to your Visual Studio project.



