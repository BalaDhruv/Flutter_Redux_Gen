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
		nameField.onDidAccept(() => {
			console.log(nameField.value);
			nameField.hide();
			var name = nameField.value ? nameField.value : DEFAULT_NAME;
			createFile(focusedFilePath, name, STATE_EXTENSION);
		});
		nameField.show();

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from flutter-redux-gen!');
	});

	context.subscriptions.push(createState);
}

function getFilePath(path: string) {
	return path.split('/').filter((path: any) => !path.includes('.')).join('/');
}

function createFile(fPath: string, name: string, extention: string) {
	console.log("INSIDE CREATE FILE");
	const pathWithFileName = fPath + '/' + name.toLocaleLowerCase() + extention;
	fs.writeFile(pathWithFileName, getStateGenCode(name), err => {
		console.log(err);
	});
	vscode.window.showInformationMessage(pathWithFileName.toString());
}

function getStateGenCode(stateName: string) {
	return `
	class ${stateName}State {
	  
		${stateName}State();
	  
		factory ${stateName}State.initial() => ${stateName}State();
	  
		@override
		bool operator ==(other) =>
			identical(this, other) ||
			other is ${stateName}State &&
				runtimeType == other.runtimeType;
	  
		@override
		int get hashCode =>
			super.hashCode;
	  
		@override
		String toString() {
		  return "${stateName}State {  }";
		}
	}
	  `;
}

// this method is called when your extension is deactivated
export function deactivate() { }
