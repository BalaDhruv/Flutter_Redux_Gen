import * as vscode from 'vscode';
import { CREATE_STATE_PLACE_HOLDER, NAME_ERROR_MESSAGE, CREATE_ACTION_PLACE_HOLDER, CREATE_MIDDLEWARE_PLACE_HOLDER, CREATE_REDUCER_PLACE_HOLDER, NAME_REG_EXP, DEFAULT_NAME, STATE_EXTENSION, REDUCER_EXTENSION, MIDDLEWARE_EXTENSION, ACTION_EXTENSION } from './resources/utils/constants';
import { getStateGenCode } from './resources/gen/state';
import { getFilePath } from './resources/utils/utils';
import { getReducerGenCode } from './resources/gen/reducer';
import { getMiddlewareGenCode } from './resources/gen/middleware';
import { getActionGenCode } from './resources/gen/action';
import { createFile, createFolder,isParentSetExist } from './resources/utils/file-utils';
import { saveParentSet } from './resources/utils/storage';
import { getParentSetMiddlewareCode, getParentSetReducerCode, getParentSetStateCode } from './resources/gen/parent_set';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Create State Command Registering
	let createState = vscode.commands.registerCommand('flutter-redux-gen.createState', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		if(isParentSetExist(context)){
			nameField.prompt = "🥳👍 Parent Set Found.";
		}else{
			nameField.prompt = "🚫 Parent Set Found.";
		}
		nameField.placeholder = CREATE_STATE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, STATE_EXTENSION, getStateGenCode);
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
		nameField.placeholder = CREATE_REDUCER_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, REDUCER_EXTENSION, getReducerGenCode);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createReducer);

	// Create State Command Registering
	let createMiddleware = vscode.commands.registerCommand('flutter-redux-gen.createMiddleware', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_MIDDLEWARE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, MIDDLEWARE_EXTENSION, getMiddlewareGenCode);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createMiddleware);

	// Create State Command Registering
	let createAction = vscode.commands.registerCommand('flutter-redux-gen.createAction', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_ACTION_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, ACTION_EXTENSION, getActionGenCode);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createAction);

	// Create Redux Set Command Registering
	let createReduxSet = vscode.commands.registerCommand('flutter-redux-gen.createReduxSet', (args) => {

		let focusedFilePath = getFilePath(args.path);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_ACTION_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(() => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				var isCreated = createFolder(focusedFilePath, name);
				if (isCreated) {
					createFile(focusedFilePath + "/" + name, name, ACTION_EXTENSION, getActionGenCode);
					createFile(focusedFilePath + "/" + name, name, REDUCER_EXTENSION, getReducerGenCode);
					createFile(focusedFilePath + "/" + name, name, MIDDLEWARE_EXTENSION, getMiddlewareGenCode);
					createFile(focusedFilePath + "/" + name, name, STATE_EXTENSION, getStateGenCode);
				}
				// createFile(focusedFilePath, name, ACTION_EXTENSION, getActionGenCode);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createReduxSet);

	// Create Redux Set Command Registering
	let createParentSet = vscode.commands.registerCommand('flutter-redux-gen.createParentSet', (args) => {
		
		if(context.workspaceState.get("PARENT_PATH") && fs.existsSync(context.workspaceState.get("PARENT_PATH") as string)){
			vscode.window.showErrorMessage('Parent Set Already Exist');
		}else{
			let focusedFilePath = getFilePath(args.path);
			let nameField = vscode.window.createInputBox();
			let nameFieldValidator = new RegExp(NAME_REG_EXP);
			nameField.placeholder = CREATE_ACTION_PLACE_HOLDER;
			nameField.onDidChangeValue((v) => {
				nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
			});
			nameField.onDidAccept(() => {
				if (nameFieldValidator.test(nameField.value)) {
					nameField.validationMessage = NAME_ERROR_MESSAGE;
				} else {
					nameField.hide();
					var name = nameField.value ? nameField.value : DEFAULT_NAME;
					console.log(name);
	
					var isCreated = createFolder(focusedFilePath, 'store');
					if (isCreated) {
						createFile(focusedFilePath + "/store", name, REDUCER_EXTENSION, getParentSetReducerCode);
						createFile(focusedFilePath + "/store", name, MIDDLEWARE_EXTENSION, getParentSetMiddlewareCode);
						createFile(focusedFilePath + "/store", name, STATE_EXTENSION, getParentSetStateCode);
						saveParentSet(focusedFilePath + "/store", name, context);
					}
					nameField.validationMessage = '';
				}
			});
			nameField.show();
		}
	});

	context.subscriptions.push(createParentSet);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
