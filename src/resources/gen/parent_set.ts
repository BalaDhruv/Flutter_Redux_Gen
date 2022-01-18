import { getFormattedReducerName, getFormattedStateName } from "../utils/utils";
import * as fs from 'fs';
import { REDUCER_EXTENSION, STATE_EXTENSION } from "../utils/constants";

function _getParentSetStateCode(name: string) {
    const sName = getFormattedStateName(name);
    return `
import 'package:flutter/material.dart';

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
    _addVarToState(name, path, parentName, parentPath);
    _addToReducer(name, path, parentName, parentPath);
}

function _addToReducer(name: string, path: string, parentName: string, parentPath: string) {
    const sName = getFormattedStateName(name) + 'State';
    const sVarName = getFormattedReducerName(sName);
    const rVarName = getFormattedReducerName(name) + 'Reducer';
    const parentStateName = getFormattedStateName(parentName) + 'State';

    // Read Reducer File
    const parentFileName = parentPath + '/' + parentName + REDUCER_EXTENSION;
    const parentStateCodeList = fs.readFileSync(parentFileName, 'utf8').split('\n');
    var updatedStateCodeList: string[] = parentStateCodeList;

    // Add Import Statement
    const currentStateFilePath = `${path}/${name}/${name}${REDUCER_EXTENSION}`;
    const importCurStatePath = '.' + currentStateFilePath.substr(parentPath.length);
    const stateImportText = `import '${importCurStatePath}';`;
    updatedStateCodeList = [stateImportText, ...updatedStateCodeList];

    // Add Reducer Code
    const reducerFindText = `${parentStateName}(`;
    if (updatedStateCodeList.findIndex(value => value.includes(reducerFindText)) > -1) {
        const initVarText = `${sVarName}: ${rVarName}(state.${sVarName}, action),`;
        const classIndex = updatedStateCodeList.findIndex(value => value.includes(reducerFindText));
        const textIndex = updatedStateCodeList[classIndex].indexOf(reducerFindText) + reducerFindText.length;
        updatedStateCodeList[classIndex] = updatedStateCodeList[classIndex].slice(0, textIndex) + initVarText + updatedStateCodeList[classIndex].slice(textIndex);
    }

    // Write Updated Code to Parent File
    fs.writeFileSync(parentFileName, updatedStateCodeList.join('\n'));
}

function _addVarToState(name: string, path: string, parentName: string, parentPath: string) {
    const sName = getFormattedStateName(name) + 'State';
    const sVarName = getFormattedReducerName(sName);

    const parentStateName = getFormattedStateName(parentName) + 'State';
    let hasConstructor = false;

    // Read State File
    const parentFileName = parentPath + '/' + parentName + STATE_EXTENSION;
    const parentStateCodeList = fs.readFileSync(parentFileName, 'utf8').split('\n');
    var updatedStateCodeList: string[] = parentStateCodeList;

    // Add Import Statement
    const currentStateFilePath = `${path}/${name}/${name}${STATE_EXTENSION}`;
    const importCurStatePath = '.' + currentStateFilePath.substr(parentPath.length);
    const stateImportText = `import '${importCurStatePath}';`;
    updatedStateCodeList = [stateImportText, ...updatedStateCodeList];

    // Add Varibale to state
    if (updatedStateCodeList.findIndex(value => value.includes(`class ${parentStateName}`)) > -1) {
        const initVarText = `final ${sName} ${sVarName};`;
        const classIndex = updatedStateCodeList.findIndex(value => value.includes(`class ${parentStateName}`)) + 1;
        updatedStateCodeList = [...updatedStateCodeList.slice(0, classIndex), initVarText, ...updatedStateCodeList.slice(classIndex)];
    }

    // Add Variable to constructor
    if (updatedStateCodeList.findIndex(value => value.includes(`${parentStateName}({`)) > -1 || updatedStateCodeList.findIndex(value => value.includes(`${parentStateName}(`))) {
        hasConstructor = true;
        let initConsVarText = `this.${sVarName},`;
        let consSearchString = `${parentStateName}(`;
        if (updatedStateCodeList.findIndex(value => value.includes(`${parentStateName}({`)) > -1) {
            initConsVarText = `required this.${sVarName},`;
            consSearchString = `${parentStateName}({`;
        } else if (updatedStateCodeList.findIndex(value => value.includes(`${parentStateName}(`))) {
            initConsVarText = `{ required this.${sVarName} }`;
        }
        const indexOfLine = updatedStateCodeList.findIndex(value => value.includes(`${parentStateName}(`));
        const indexOfinsertPosition = updatedStateCodeList[indexOfLine].indexOf(consSearchString) + consSearchString.length;
        const consStr: string = updatedStateCodeList[indexOfLine];
        updatedStateCodeList[indexOfLine] = consStr.slice(0, indexOfinsertPosition) + initConsVarText + consStr.slice(indexOfinsertPosition);
    }

    // Add Variable to factory Method
    if (hasConstructor) {
        const initialVarText = `${sVarName}: ${sName}.initial(),`;
        const indexOfInitialMethodLine = updatedStateCodeList.findIndex(value => value.includes(`=> ${parentStateName}(`));
        const indexOfInitialInsert = updatedStateCodeList[indexOfInitialMethodLine].indexOf(`${parentStateName}(`) + parentStateName.length + 1;
        updatedStateCodeList[indexOfInitialMethodLine] = updatedStateCodeList[indexOfInitialMethodLine].slice(0, indexOfInitialInsert) + initialVarText + updatedStateCodeList[indexOfInitialMethodLine].slice(indexOfInitialInsert);
    }

    // Add Var to Operator Method
    const operatorText = ` && ${sVarName} == other.${sVarName} `;
    const operatorFinderText = 'other.runtimeType';
    if (updatedStateCodeList.findIndex(value => value.includes(operatorFinderText))) {
        const lineIndexOperator = updatedStateCodeList.findIndex(value => value.includes(operatorFinderText));
        const indexInsert = updatedStateCodeList[lineIndexOperator].indexOf(operatorFinderText) + operatorFinderText.length;
        updatedStateCodeList[lineIndexOperator] = updatedStateCodeList[lineIndexOperator].slice(0, indexInsert) + operatorText + updatedStateCodeList[lineIndexOperator].slice(indexInsert);
    }

    // Add Var to HashCode Methode
    const hascodeText = ` ^ ${sVarName}.hashCode `;
    const hascodeFinderText = 'super.hashCode';
    if (updatedStateCodeList.findIndex(value => value.includes(hascodeFinderText))) {
        const lineIndexHashcode = updatedStateCodeList.findIndex(value => value.includes(hascodeFinderText));
        const indexOfHashcodeStr = updatedStateCodeList[lineIndexHashcode].indexOf(hascodeFinderText) + hascodeFinderText.length;
        updatedStateCodeList[lineIndexHashcode] = updatedStateCodeList[lineIndexHashcode].slice(0, indexOfHashcodeStr) + hascodeText + updatedStateCodeList[lineIndexHashcode].slice(indexOfHashcodeStr);
    }

    // Add Var to TOSTRING Method
    const toStringText = ` ${sVarName}: $${sVarName}`;
    const toStringFinderText = `"${parentStateName} {`;
    if (updatedStateCodeList.findIndex(value => value.includes(toStringFinderText))) {
        const toStringLineIndex = updatedStateCodeList.findIndex(value => value.includes(toStringFinderText));
        const toStringInsertIndex = updatedStateCodeList[toStringLineIndex].indexOf(toStringFinderText) + toStringFinderText.length;
        updatedStateCodeList[toStringLineIndex] = updatedStateCodeList[toStringLineIndex].slice(0, toStringInsertIndex) + toStringText + updatedStateCodeList[toStringLineIndex].slice(toStringInsertIndex);
    }

    // Write Updated Code to Parent File
    fs.writeFileSync(parentFileName, updatedStateCodeList.join('\n'));
}


export var getParentSetStateCode = _getParentSetStateCode;
export var getParentSetReducerCode = _getParentSetReducerCode;
export var getParentSetMiddlewareCode = _getParentSetMiddlewareCode;
export var addSetToParent = _addSetToParent;






