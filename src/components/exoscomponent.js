const { ExosPackage } = require('../exospackage');
const { Datamodel } = require('../datamodel');

const path = require('path')

class Component {

    /**name of the `ExosPackage` 
     * @type {string}
    */
    _name;

    /**`ExosPackage` created with the name `{name}` 
     * @type {ExosPackage}
    */
    _exospackage;

    constructor(name) {
        this._name = name;
        this._exospackage = new ExosPackage(name);
    }

    makeComponent(location)
    {
        this._exospackage.makePackage(location);
    }
}

/**
 * Base class for (most) ExosComponent Templates
 * 
 */
class ExosComponent extends Component {

    /**name of the IEC datatype used to generate the datamodel, `name` is also set to this `typeName`
     * @type {string}
    */
    _typeName;

    /**name of the .typ source file for generating the datamodel 
     * @type {string}
    */
    _fileName;

    /**generated datamodel using `typeName` and `{typeName}.h` as SGInclude 
     * @type {Datamodel}
    */
    _datamodel;

    /**object returned from `exospkg.getNewWSLBuildCommand()` in order to add files as build dependencies
     * @type {Object}
    */
    _linuxBuild;

    /**`LinuxPackage` created in the folder "Linux". contains generated headerfiles
     * @type {LinuxPackage}
    */
    _linuxPackage;

    /**`CLibrary` for AR created in the folder `{typeName}`. contains generated headerfiles
     * @type {CLibrary}
    */
    _cLibrary;

    /**`IECProgram` for AR created in the folder `{typeName}_0`. does not contain any files
     * @type {IECProgram}
    */
    _iecProgram;

    /**
     * 
     * @param {string} fileName 
     * @param {string} typeName 
     * @param {string} buildScript 
     */
    constructor(fileName, typeName, buildScript) {

        super(typeName);

        this._typeName = typeName;
        this._fileName = fileName;

        this._datamodel = new Datamodel(fileName, typeName, [`${typeName}.h`])
        this._exospackage.exospkg.addGenerateDatamodel(`${typeName}/${typeName}.typ`, typeName, [`${typeName}.h`], [typeName, "Linux"]);
        this._linuxBuild = this._exospackage.exospkg.getNewWSLBuildCommand("Linux", buildScript);

        this._linuxPackage = this._exospackage.getNewLinuxPackage("Linux");
        this._linuxPackage.addNewFile(this._datamodel.headerFileName,this._datamodel.headerFileCode);
        this._linuxPackage.addNewFile(this._datamodel.sourceFileName, this._datamodel.sourceFileCode);

        this._cLibrary = this._exospackage.getNewCLibrary(typeName, ``);
        this._cLibrary.addNewFile(this._datamodel.headerFileName,this._datamodel.headerFileCode);
        this._cLibrary.addNewFile(this._datamodel.sourceFileName, this._datamodel.sourceFileCode);

        this._iecProgram = this._exospackage.getNewIECProgram(`${typeName}_0`,``);
    }

    makeComponent(location)
    {
        super.makeComponent(location);
    }
}


module.exports = {ExosComponent};