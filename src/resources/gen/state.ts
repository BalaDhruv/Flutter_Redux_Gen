import { getFormattedStateName } from "../utils/utils";
import * as fs from 'fs';
const _ = require('lodash');

function _getStateGenCode(stateName: string) {
	const sName = getFormattedStateName(stateName);
	return `
class ${sName}State {
	final bool loading;
	final String error;

	${sName}State(this.loading, this.error);

	factory ${sName}State.initial() => ${sName}State(false, '');

	${sName}State copyWith({bool loading, String error}) =>
		${sName}State(loading ?? this.loading, error ?? this.error);

	@override
	bool operator ==(other) =>
		identical(this, other) ||
		other is ${sName}State &&
			runtimeType == other.runtimeType &&
			loading == other.loading &&
			error == other.error;

	@override
	int get hashCode =>
		super.hashCode ^ runtimeType.hashCode ^ loading.hashCode ^ error.hashCode;

	@override
	String toString() => "${sName}State { loading: $loading,  error: $error}";
}
	  `;
}


function _addVariableToState(path: string, varType: string, varName: string) {

	// Read State File
	let hasConstructor = false;
	varType = getVarType(varType);
	const parentStateCodeList = fs.readFileSync(path, 'utf8').split('\n');
	var updatedStateCodeList: string[] = parentStateCodeList;

	// Finding State Name
	var index = updatedStateCodeList.findIndex(value => value.includes(`class `));
	var sendenceList = updatedStateCodeList[index].split(" ");
	var stateNameIndex = sendenceList.findIndex(value => value.includes(`class`)) + 1;
	var stateName = sendenceList[stateNameIndex];

	// Add Varibale to state
	if (updatedStateCodeList.findIndex(value => value.includes(`class ${stateName}`)) > -1) {
		const initVarText = `final ${varType} ${varName};`;
		const classIndex = updatedStateCodeList.findIndex(value => value.includes(`class ${stateName}`)) + 1;
		updatedStateCodeList = [...updatedStateCodeList.slice(0, classIndex), initVarText, ...updatedStateCodeList.slice(classIndex)];
	}

	// Add Variable to constructor
	if (updatedStateCodeList.findIndex(value => value.includes(`${stateName}({`)) > -1 || updatedStateCodeList.findIndex(value => value.includes(`${stateName}(`))) {
		hasConstructor = true;
		let initConsVarText = `this.${varName},`;
		let consSearchString = `${stateName}(`;
		if (updatedStateCodeList.findIndex(value => value.includes(`${stateName}({`)) > -1) {
			initConsVarText = `this.${varName},`;
			consSearchString = `${stateName}({`;
		} else if (updatedStateCodeList.findIndex(value => value.includes(`${stateName}(`))) {
			initConsVarText = `this.${varName},`;
		}
		const indexOfLine = updatedStateCodeList.findIndex(value => value.includes(`${stateName}(`));
		const indexOfinsertPosition = updatedStateCodeList[indexOfLine].indexOf(consSearchString) + consSearchString.length;
		const consStr: string = updatedStateCodeList[indexOfLine];
		updatedStateCodeList[indexOfLine] = consStr.slice(0, indexOfinsertPosition) + initConsVarText + consStr.slice(indexOfinsertPosition);
	}

	// Add Variable to factory Method
	if (hasConstructor) {
		const initialVarText = `${getInItValueByType(varType)},`;
		const indexOfInitialMethodLine = updatedStateCodeList.findIndex(value => value.includes(`=> ${stateName}(`));
		const indexOfInitialInsert = updatedStateCodeList[indexOfInitialMethodLine].indexOf(`${stateName}(`) + stateName.length + 1;
		updatedStateCodeList[indexOfInitialMethodLine] = updatedStateCodeList[indexOfInitialMethodLine].slice(0, indexOfInitialInsert) + initialVarText + updatedStateCodeList[indexOfInitialMethodLine].slice(indexOfInitialInsert);
	}

	// Add Var CopyWith Method
	const copyWithText = `${varType}? ${varName},`;
	const indexOfCopyWithLine = updatedStateCodeList.findIndex(value => value.includes(`${stateName} copyWith({`));
	const indexOfInitialInsert = updatedStateCodeList[indexOfCopyWithLine].indexOf(`${stateName} copyWith({`) + `${stateName} copyWith({`.length;
	updatedStateCodeList[indexOfCopyWithLine] = updatedStateCodeList[indexOfCopyWithLine].slice(0, indexOfInitialInsert) + copyWithText + updatedStateCodeList[indexOfCopyWithLine].slice(indexOfInitialInsert);

	// Add Var CopyWith Res Method
	const copyWithResText = `${varName} ?? this.${varName},`;
	const indexOfCopyWithResLine = _.findLastIndex(updatedStateCodeList, function (value: any) { return value.includes(`${stateName}(`); });
	const indexOfCWResInitialInsert = updatedStateCodeList[indexOfCopyWithResLine].indexOf(`${stateName}(`) + `${stateName}(`.length;
	updatedStateCodeList[indexOfCopyWithResLine] = updatedStateCodeList[indexOfCopyWithResLine].slice(0, indexOfCWResInitialInsert) + copyWithResText + updatedStateCodeList[indexOfCopyWithResLine].slice(indexOfCWResInitialInsert);

	// Add Var to Operator Method
	const operatorText = ` && ${varName} == other.${varName} `;
	const operatorFinderText = 'other.runtimeType';
	if (updatedStateCodeList.findIndex(value => value.includes(operatorFinderText))) {
		const lineIndexOperator = updatedStateCodeList.findIndex(value => value.includes(operatorFinderText));
		const indexInsert = updatedStateCodeList[lineIndexOperator].indexOf(operatorFinderText) + operatorFinderText.length;
		updatedStateCodeList[lineIndexOperator] = updatedStateCodeList[lineIndexOperator].slice(0, indexInsert) + operatorText + updatedStateCodeList[lineIndexOperator].slice(indexInsert);
	}

	// Add Var to HashCode Methode
	const hascodeText = ` ^ ${varName}.hashCode `;
	const hascodeFinderText = 'super.hashCode';
	if (updatedStateCodeList.findIndex(value => value.includes(hascodeFinderText))) {
		const lineIndexHashcode = updatedStateCodeList.findIndex(value => value.includes(hascodeFinderText));
		const indexOfHashcodeStr = updatedStateCodeList[lineIndexHashcode].indexOf(hascodeFinderText) + hascodeFinderText.length;
		updatedStateCodeList[lineIndexHashcode] = updatedStateCodeList[lineIndexHashcode].slice(0, indexOfHashcodeStr) + hascodeText + updatedStateCodeList[lineIndexHashcode].slice(indexOfHashcodeStr);
	}

	// Add Var to TOSTRING Method
	const toStringText = ` ${varName}: $${varName},`;
	const toStringFinderText = `"${stateName} {`;
	if (updatedStateCodeList.findIndex(value => value.includes(toStringFinderText))) {
		const toStringLineIndex = updatedStateCodeList.findIndex(value => value.includes(toStringFinderText));
		const toStringInsertIndex = updatedStateCodeList[toStringLineIndex].indexOf(toStringFinderText) + toStringFinderText.length;
		updatedStateCodeList[toStringLineIndex] = updatedStateCodeList[toStringLineIndex].slice(0, toStringInsertIndex) + toStringText + updatedStateCodeList[toStringLineIndex].slice(toStringInsertIndex);
	}

	// Write Updated Code to Parent File
	fs.writeFileSync(path, updatedStateCodeList.join('\n'));
}

function getInItValueByType(type: string) {
	if (type.toLocaleLowerCase() === "number" || type.toLocaleLowerCase() === "int" || type.toLocaleLowerCase() === "double") {
		return 0;
	}
	if (type.toLocaleLowerCase() === "string" || type.toLocaleLowerCase() === "dynamic") {
		return "''";
	}
	if (type.toLocaleLowerCase() === "bool") {
		return false;
	}
	if (type.toLocaleLowerCase() === "list") {
		return "[]";
	}
	if (type.toLocaleLowerCase() === "set" || type.toLocaleLowerCase() === "map") {
		return "{}";
	}
}

function getVarType(type: string): string {
	if (type.toLocaleLowerCase() === "number") {
		return "num";
	}
	if (type.toLocaleLowerCase() === "int") {
		return "int";
	}
	if (type.toLocaleLowerCase() === "double") {
		return "double";
	}
	if (type.toLocaleLowerCase() === "string") {
		return type;
	}
	if (type.toLocaleLowerCase() === "list" || type.toLocaleLowerCase() === "set" || type.toLocaleLowerCase() === "map") {
		return type;
	}
	return type.toLocaleLowerCase();
}

export var getStateGenCode = _getStateGenCode;
export var addVariableToState = _addVariableToState;