import * as vscode from 'vscode';
import * as fs from 'fs';
import { CREATE_STATE_PLACE_HOLDER, NAME_ERROR_MESSAGE, NAME_REG_EXP, DEFAULT_NAME, STATE_EXTENSION } from './resources/constants';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Create State Command Registering
	let createState = vscode.commands.registerCommand('flutter-redux-gen.createState', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_STATE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v)? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, STATE_EXTENSION);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createState);

	// Create State Command Registering
	let createReducer = vscode.commands.registerCommand('flutter-redux-gen.createReducer', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_STATE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v)? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, STATE_EXTENSION);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createState);
}

function getFilePath(path: string) {
	return path.split('/').filter((path: any) => !path.includes('.')).join('/');
}

function createFile(fPath: string, name: string, extention: string) {
	const pathWithFileName = fPath + '/' + name.toLocaleLowerCase() + extention;
	fs.writeFile(pathWithFileName, getStateGenCode(name), err => {
		console.log(err);
		if(err){
			vscode.window.showInformationMessage('Please check your path. Otherwise file a issue in Git Repo. Let me help.');
		}else{
			vscode.window.showInformationMessage('State Created Successfully.');
		}
	});
}

function getStateGenCode(stateName: string) {
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

function getFormattedStateName(name:string) {
	return  name.split('_').map(word=>word[0].toLocaleUpperCase()+word.substring(1)).join('');
}

// this method is called when your extension is deactivated
export function deactivate() { }
