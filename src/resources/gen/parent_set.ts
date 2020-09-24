import { getFormattedReducerName, getFormattedStateName } from "../utils/utils";
import * as fs from 'fs';
import { STATE_EXTENSION } from "../utils/constants";

function _getParentSetStateCode(name: string) {
    const sName = getFormattedStateName(name);
    return `
class ${sName}State {

    ${sName}State();

    factory ${sName}State.initial() => ${sName}State();

    @override
    bool operator ==(other) =>
        identical(this, other) ||
        other is ${sName}State &&
            runtimeType == other.runtimeType;

    @override
    int get hashCode =>
        super.hashCode;

    @override
    String toString() {
    return "${sName}State { }";
    }
}
	`;
}

function _getParentSetReducerCode(name: string) {
    const sName = getFormattedStateName(name);
    const rName = getFormattedReducerName(name);
    return `
import './${name}.state.dart';
${sName}State ${rName}Reducer(${sName}State state, action) => ${sName}State();
	`;
}

function _getParentSetMiddlewareCode(name: string) {
    const rName = getFormattedReducerName(name);
    const sName = getFormattedStateName(name);
    return `
import 'package:redux/redux.dart';
import './${name}.state.dart';

List<Middleware<${sName}State>> ${rName}Middleware() {
//   final Middleware<${sName}State> _login = login(_repo);

return [
    // TypedMiddleware<${sName}State, LoginAction>(_login),
]; 
}
	`;
}

function _addSetToParent(name: string, path: string, parentName: string, parentPath: string) {
    // console.log(name);
    // console.log(path);
    _addVarToState(name, path, parentName, parentPath);
}

function _addVarToState(name: string, path: string, parentName: string, parentPath: string) {
    const sName = getFormattedStateName(name) + 'State';
    const sVarName = getFormattedReducerName(sName);

    const parentStateName= getFormattedStateName(parentName) + 'State';

    // Read State File
    const parentFileName = parentPath + '/' + parentName + STATE_EXTENSION;
    const parentStateCodeList = fs.readFileSync(parentFileName, 'utf8').split('\n');
    var updatedStateCodeList = parentStateCodeList;

    // Add Import Statement
    const currentStateFilePath = `${path}/${name}/${name}${STATE_EXTENSION}`;
    const importCurStatePath = '.' + currentStateFilePath.substr(parentPath.length);
    const stateImportText = `import '${importCurStatePath}';`;
    updatedStateCodeList = [stateImportText, ...updatedStateCodeList];

    // Add Varibale to state
    console.log(sName);
    console.log(sVarName);
    const initVarText = `final ${sName} ${sVarName}`;
    console.log(initVarText);
    console.log(parentStateName);
    console.log(updatedStateCodeList.findIndex(value=>value.includes(`class ${parentStateName}`)));
    console.log(updatedStateCodeList[1]);

    // Write Updated Code to Parent File
    // fs.writeFileSync(parentFileName,updatedStateCodeList.join('\n'));
}


export var getParentSetStateCode = _getParentSetStateCode;
export var getParentSetReducerCode = _getParentSetReducerCode;
export var getParentSetMiddlewareCode = _getParentSetMiddlewareCode;
export var addSetToParent = _addSetToParent;






