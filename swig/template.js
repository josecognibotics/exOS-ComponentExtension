const fs = require('fs')
const header = require('../exos_header');
const ar = require('../template/ar');
const template_lib = require('../c-static-lib-template/c_static_lib_template');
const template_linux_python = require('./template_linux_python');
const template_linux_nodejs = require('./template_linux_nodejs');
const template_ar = require('../c-static-lib-template/template_ar');
const template_swig = require('./swig_c_template')
const path = require('path');

function generatePythonTemplate(fileName, structName, outPath) {

    let libName = structName.substring(0, 7);

    if (fs.existsSync(`${outPath}/${structName}`)) {
        throw(`folder ${outPath}/${structName} already exists, choose another output folder`);
    }

    template_ar.checkVarNames(fileName,structName);

    //AS dirs
    fs.mkdirSync(`${outPath}/${structName}`);
    fs.mkdirSync(`${outPath}/${structName}/lib${libName}`);
    fs.mkdirSync(`${outPath}/${structName}/${libName}`);

    //Linux dir
    fs.mkdirSync(`${outPath}/${structName}/Linux`);
    
    //headers
    let out = header.generateHeader(fileName, structName, [`${path.basename(fileName).split(".")[0].toLowerCase()}TYP.h`]);
    //AS header
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/exos_${structName.toLowerCase()}.h`, out);
    //Linux header
    fs.writeFileSync(`${outPath}/${structName}/Linux/exos_${structName.toLowerCase()}.h`, out);


    // //AS files
    out = template_ar.generatePackage(structName,libName);
    fs.writeFileSync(`${outPath}/${structName}/Package.pkg`, out);

    out = ar.generateGitAttributes();
    fs.writeFileSync(`${outPath}/${structName}/.gitattributes`, out);

    out = ar.generateGitIgnore(["__pycache__/" , "*.pyc", `_lib${structName}.so`, `lib${structName}.py`]);
    fs.writeFileSync(`${outPath}/${structName}/.gitignore`, out);

    out = template_linux_python.generateExosPkg(structName,libName,path.basename(fileName));
    fs.writeFileSync(`${outPath}/${structName}/${structName}.exospkg`, out);

    out = template_ar.generateCLibrary(structName);
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/ANSIC.lby`, out);

    out = template_lib.genenerateLibHeader(fileName, structName, "SUB", "PUB");
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/lib${structName.toLowerCase()}.h`, out);

    out = template_lib.generateTemplate(fileName, structName, "SUB", "PUB", `${structName}_AR`);
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/lib${structName.toLowerCase()}.c`, out);

    out = template_ar.generateCProgram(path.basename(fileName), libName);
    fs.writeFileSync(`${outPath}/${structName}/${libName}/ANSIC.prg`, out);
    
    out = template_ar.generateCProgramVar(fileName, structName);
    fs.writeFileSync(`${outPath}/${structName}/${libName}/Variables.var`, out);

    fs.writeFileSync(`${outPath}/${structName}/${libName}/dynamic_heap.cpp`, "unsigned long bur_heap_size = 100000;\n");
    // copy the .typ file to the Program
    fs.copyFileSync(fileName, `${outPath}/${structName}/${libName}/${path.basename(fileName)}`);

    out = template_lib.generateMainAR(fileName, structName, libName, "SUB", "PUB");
    fs.writeFileSync(`${outPath}/${structName}/${libName}/main.c`, out);

    //Linux Files
    out = template_lib.genenerateLibHeader(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.h`, out);
    
    out = template_lib.generateTemplate(fileName, structName, "PUB", "SUB", `${structName}_Linux`, true);
    //out = template_swig.generateSwigStubs(fileName, structName, "PUB", "SUB", `${structName}_Linux`);
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.c`, out);


    //Swig Files
    out = template_swig.generateSwigInclude(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.i`, out);

    out = template_linux_python.generateLinuxPackage(structName);
    fs.writeFileSync(`${outPath}/${structName}/Linux/Package.pkg`, out);

    out = template_linux_python.generateShBuild();
    fs.writeFileSync(`${outPath}/${structName}/Linux/build.sh`, out);

    out = template_linux_python.generateCMakeLists(structName);
    fs.writeFileSync(`${outPath}/${structName}/Linux/CMakeLists.txt`, out);
        
    out = template_swig.generatePythonMain(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/${structName.toLowerCase()}.py`, out);

}

function generateNodeJSTemplate(fileName, structName, outPath) {

    let libName = structName.substring(0, 7);

    if (fs.existsSync(`${outPath}/${structName}`)) {
        throw (`folder ${outPath}/${structName} already exists, choose another output folder`);
    }

    template_ar.checkVarNames(fileName, structName);

    //AS dirs
    fs.mkdirSync(`${outPath}/${structName}`);
    fs.mkdirSync(`${outPath}/${structName}/lib${libName}`);
    fs.mkdirSync(`${outPath}/${structName}/${libName}`);

    //Linux dir
    fs.mkdirSync(`${outPath}/${structName}/Linux`);
    
    //headers
    let out = header.generateHeader(fileName, structName, [`${path.basename(fileName).split(".")[0].toLowerCase()}TYP.h`]);
    //AS header
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/exos_${structName.toLowerCase()}.h`, out);
    //Linux header
    fs.writeFileSync(`${outPath}/${structName}/Linux/exos_${structName.toLowerCase()}.h`, out);


    // //AS files
    out = template_ar.generatePackage(structName, libName);
    fs.writeFileSync(`${outPath}/${structName}/Package.pkg`, out);

    out = ar.generateGitAttributes();
    fs.writeFileSync(`${outPath}/${structName}/.gitattributes`, out);

    out = ar.generateGitIgnore(["l_*.node"]);
    fs.writeFileSync(`${outPath}/${structName}/.gitignore`, out);

    out = template_linux_nodejs.generateExosPkg(structName, libName, path.basename(fileName));
    fs.writeFileSync(`${outPath}/${structName}/${structName}.exospkg`, out);

    out = template_ar.generateCLibrary(structName);
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/ANSIC.lby`, out);

    out = template_lib.genenerateLibHeader(fileName, structName, "SUB", "PUB");
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/lib${structName.toLowerCase()}.h`, out);

    out = template_lib.generateTemplate(fileName, structName, "SUB", "PUB", `${structName}_AR`);
    fs.writeFileSync(`${outPath}/${structName}/lib${libName}/lib${structName.toLowerCase()}.c`, out);

    out = template_ar.generateCProgram(path.basename(fileName), libName);
    fs.writeFileSync(`${outPath}/${structName}/${libName}/ANSIC.prg`, out);
    
    out = template_ar.generateCProgramVar(fileName, structName);
    fs.writeFileSync(`${outPath}/${structName}/${libName}/Variables.var`, out);

    fs.writeFileSync(`${outPath}/${structName}/${libName}/dynamic_heap.cpp`, "unsigned long bur_heap_size = 100000;\n");
    // copy the .typ file to the Program
    fs.copyFileSync(fileName, `${outPath}/${structName}/${libName}/${path.basename(fileName)}`);

    out = template_lib.generateMainAR(fileName, structName, libName, "SUB", "PUB");
    fs.writeFileSync(`${outPath}/${structName}/${libName}/main.c`, out);

    //Linux Files
    out = template_lib.genenerateLibHeader(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.h`, out);
    
    out = template_lib.generateTemplate(fileName, structName, "PUB", "SUB", `${structName}_Linux`, true);
    //out = template_swig.generateSwigStubs(fileName, structName, "PUB", "SUB", `${structName}_Linux`);
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.c`, out);


    //Swig Files
    out = template_swig.generateSwigInclude(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/lib${structName.toLowerCase()}.i`, out);

    out = template_linux_nodejs.generateLinuxPackage(structName);
    fs.writeFileSync(`${outPath}/${structName}/Linux/Package.pkg`, out);

    out = template_linux_nodejs.generateShBuild(structName);
    fs.writeFileSync(`${outPath}/${structName}/Linux/build.sh`, out);

    out = template_linux_nodejs.generateGypFile(structName);
    fs.writeFileSync(`${outPath}/${structName}//Linux/binding.gyp`, out);
        
    out = template_swig.generateNodeJSMain(fileName, structName, "PUB", "SUB");
    fs.writeFileSync(`${outPath}/${structName}/Linux/${structName.toLowerCase()}.js`, out);

}

module.exports = {
    generatePythonTemplate,
    generateNodeJSTemplate
}