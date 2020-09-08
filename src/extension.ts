// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

const EXTENSION = '.dart';
const STATE_EXTENSION = '.state.dart';
const REDUCER_EXTENSION = '.state.dart';
const MIDDLEWARE_EXTENSION = '.state.dart';
const ACTION_EXTENSION = '.state.dart';
const DEFAULT_NAME = 'default';
const CREATE_STATE_PLACE_HOLDER = 'Enter State Name';
const NAME_ERROR_MESSAGE = 'Please use name without space. Consider using "_"';
const NAME_REG_EXP = new RegExp(/[`0-9 ~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-redux-gen" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let createState = vscode.commands.registerCommand('flutter-redux-gen.createState', (args) => {
		// The code you place here will be executed every time your command is executed

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		nameField.placeholder = CREATE_STATE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			console.log(NAME_REG_EXP.test(v));
			nameField.validationMessage = NAME_REG_EXP.test(v)? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameField.value.includes(' ')) {
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
		vscode.window.showInformationMessage('Please check your path. Otherwise file a issue in Git Repo. Let me help.');
	});
	vscode.window.showInformationMessage('State Created Successfully.');
}

function getStateGenCode(stateName: string) {
	const sName = formattedName(stateName);
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

function formattedName(name:string) {
	return  name.split('_').map(word=>word[0].toLocaleUpperCase()+word.substring(1)).join('');
}

// this method is called when your extension is deactivated
export function deactivate() { }
