import * as vscode from 'vscode';
import { CREATE_STATE_PLACE_HOLDER, NAME_ERROR_MESSAGE, CREATE_ACTION_PLACE_HOLDER, CREATE_MIDDLEWARE_PLACE_HOLDER, CREATE_REDUCER_PLACE_HOLDER, NAME_REG_EXP, DEFAULT_NAME, STATE_EXTENSION, REDUCER_EXTENSION, MIDDLEWARE_EXTENSION, ACTION_EXTENSION, ADD_VARIABLE_TO_STATE_PLACEHOLDER, VARIABLE_NAME_ERROR_MESSAGE, SELECT_PARENT_SET, NOT_FOUND_ANY_SET_FILE, NO_FOLDER_IN_WORKSPACE_FOUND, STATE_FILE_RELATIVE_PATTERN, CURRENT_PARENT, SUCCESFULLY_SET_PARENT } from './resources/utils/constants';
import { getStateGenCode, addVariableToState ,addVariableToFreezedClass } from './resources/gen/state';
import { getFilePath } from './resources/utils/utils';
import { getReducerGenCode } from './resources/gen/reducer';
import { getMiddlewareGenCode } from './resources/gen/middleware';
import { getActionGenCode } from './resources/gen/action';
import { checkAndSelectParentSetIfAlreadyExist, createFile, createFolder, isParentSetExist } from './resources/utils/file-utils';
import { getParentName, getParentPath, saveParentSet } from './resources/utils/storage';
import { addSetToParent, getParentSetMiddlewareCode, getParentSetReducerCode, getParentSetStateCode } from './resources/gen/parent_set';
import * as path from 'path';
import { fstat, fsyncSync, readdirSync, statSync } from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext): void {
//add variable to state
	let createVariableInState = vscode.commands.registerCommand('flutter-redux-gen.createVariableInState', async (args) => {
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		var varType = await vscode.window.showQuickPick(["Number", "Int", "Double", "String", "Bool", "List", "Set", "Map", "Dynamic"],
			{ title: "Select Variable Type", canPickMany: false });
		if (varType === undefined) {
			return "No data";
		}
		let varName = await vscode.window.showInputBox({
			title: "Enter Variable Name",
			validateInput: (val) => nameFieldValidator.test(val) ? NAME_ERROR_MESSAGE : '',
		});
		if (varName === undefined) {
			return "No data";
		}
		const activeEditor = vscode.window.activeTextEditor;

		if (activeEditor) {
			const documentText = activeEditor.document.getText();
	
			if (documentText.includes('@freezed')) {
				addVariableToFreezedClass(args.path, varType, varName);
			} else {
				addVariableToState(args.path, varType, varName);
			}
		} else {
			vscode.window.showWarningMessage('No active text editor is open.');
		}
		
	});

	context.subscriptions.push(createVariableInState);

	// //add variable to freezed class
	// let createVariableInFreezedClass = vscode.commands.registerCommand('flutter-redux-gen.createVariableInFreezedClass', async (args) => {
	// 	let nameFieldValidator = new RegExp(NAME_REG_EXP);
	// 	var varType = await vscode.window.showQuickPick(["Number", "Int", "Double", "String", "Bool", "List", "Set", "Map", "Dynamic"],
	// 		{ title: "Select Variable Type", canPickMany: false });
	// 	if (varType === undefined) {
	// 		return "No data";
	// 	}
	// 	let varName = await vscode.window.showInputBox({
	// 		title: "Enter Variable Name",
	// 		validateInput: (val) => nameFieldValidator.test(val) ? NAME_ERROR_MESSAGE : '',
	// 	});
	// 	if (varName === undefined) {
	// 		return "No data";
	// 	}
	// 	addVariableToFreezedClass(args.path, varType, varName);
	// });

	// context.subscriptions.push(createVariableInFreezedClass);
	// Create State Command Registering
	let createState = vscode.commands.registerCommand('flutter-redux-gen.createState', (args) => {

		let focusedFilePath = getFilePath(args.fsPath);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		let addFreezed: boolean;
		if (isParentSetExist(context)) {
			nameField.prompt = "🥳👍 Parent Set Found.";
		} else {
			nameField.prompt = "🚫 Parent Set Found.";
		}
		nameField.placeholder = CREATE_STATE_PLACE_HOLDER;
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(async () => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				addFreezed = (await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'do you have feezed class' }) === 'Yes');
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				createFile(focusedFilePath, name, STATE_EXTENSION, getStateGenCode, true, addFreezed);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createState);

	// Create State Command Registering
	let createReducer = vscode.commands.registerCommand('flutter-redux-gen.createReducer', (args) => {

		let focusedFilePath = getFilePath(args.fsPath);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		if (isParentSetExist(context)) {
			nameField.prompt = "🥳👍 Parent Set Found.";
		} else {
			nameField.prompt = "🚫 Parent Set Found.";
		}
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
				createFile(focusedFilePath, name, REDUCER_EXTENSION, getReducerGenCode, true, false);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createReducer);

	// Create State Command Registering
	let createMiddleware = vscode.commands.registerCommand('flutter-redux-gen.createMiddleware', (args) => {

		let focusedFilePath = getFilePath(args.fsPath);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		if (isParentSetExist(context)) {
			nameField.prompt = "🥳👍 Parent Set Found.";
		} else {
			nameField.prompt = "🚫 Parent Set Found.";
		}
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
				createFile(focusedFilePath, name, MIDDLEWARE_EXTENSION, getMiddlewareGenCode, true, false);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createMiddleware);

	// Create State Command Registering
	let createAction = vscode.commands.registerCommand('flutter-redux-gen.createAction', (args) => {

		let focusedFilePath = getFilePath(args.fsPath);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		if (isParentSetExist(context)) {
			nameField.prompt = "🥳👍 Parent Set Found.";
		} else {
			nameField.prompt = "🚫 Parent Set Found.";
		}
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
				createFile(focusedFilePath, name, ACTION_EXTENSION, getActionGenCode, true, false);
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createAction);

	// Create Redux Set Command Registering
	let createReduxSet = vscode.commands.registerCommand('flutter-redux-gen.createReduxSet', async (args) => {
		let focusedFilePath = getFilePath(args.fsPath);
		let nameField = vscode.window.createInputBox();
		let nameFieldValidator = new RegExp(NAME_REG_EXP);
		nameField.placeholder = CREATE_ACTION_PLACE_HOLDER;
		let addFreezed: boolean;
		if (isParentSetExist(context)) {
			nameField.prompt = "🥳👍 Parent Set Found.";
		} else {
			nameField.prompt = "🚫 Parent Set Found.";
		}
		nameField.onDidChangeValue((v) => {
			nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
		});
		nameField.onDidAccept(async () => {
			if (nameFieldValidator.test(nameField.value)) {
				nameField.validationMessage = NAME_ERROR_MESSAGE;
			} else {
				nameField.hide();
				var name = nameField.value ? nameField.value : DEFAULT_NAME;
				addFreezed = (await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'do you have feezed class' }) === 'Yes');
				var isCreated = createFolder(focusedFilePath, name);
				if (isCreated) {
					createFile(focusedFilePath + "/" + name, name, ACTION_EXTENSION, getActionGenCode, false, false);
					createFile(focusedFilePath + "/" + name, name, REDUCER_EXTENSION, getReducerGenCode, false, false);
					createFile(focusedFilePath + "/" + name, name, MIDDLEWARE_EXTENSION, getMiddlewareGenCode, false, false);
					createFile(focusedFilePath + "/" + name, name, STATE_EXTENSION, getStateGenCode, false, addFreezed);
					addSetToParent(name, focusedFilePath, getParentName(context), getParentPath(context));
					vscode.window.showInformationMessage(name + ' Set Created.');
				}
				nameField.validationMessage = '';
			}
		});
		nameField.show();
	});

	context.subscriptions.push(createReduxSet);

	// Create Redux Parent Set Command Registering
	let createParentSet = vscode.commands.registerCommand('flutter-redux-gen.createParentSet', (args) => {
		if (isParentSetExist(context)) {
			vscode.window.showErrorMessage('Parent Set Already Exist');
		} else {
			let focusedFilePath = getFilePath(args.fsPath);
			let nameField = vscode.window.createInputBox();
			let nameFieldValidator = new RegExp(NAME_REG_EXP);
			nameField.placeholder = CREATE_ACTION_PLACE_HOLDER;
			let addFreezed: boolean;
			nameField.onDidChangeValue((v) => {
				nameField.validationMessage = nameFieldValidator.test(v) ? NAME_ERROR_MESSAGE : '';
			});
			nameField.onDidAccept(async () => {
				if (nameFieldValidator.test(nameField.value)) {
					nameField.validationMessage = NAME_ERROR_MESSAGE;
				} else {
					nameField.hide();
					var name = nameField.value ? nameField.value : DEFAULT_NAME;
					addFreezed = (await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: 'do you have feezed class' }) === 'Yes');

					var isCreated = createFolder(focusedFilePath, 'store');
					if (isCreated) {
						createFile(path.join(focusedFilePath, 'store'), name, REDUCER_EXTENSION, getParentSetReducerCode, false, false);
						createFile(path.join(focusedFilePath, 'store'), name, MIDDLEWARE_EXTENSION, getParentSetMiddlewareCode, false, false);
						createFile(path.join(focusedFilePath, 'store'), name, STATE_EXTENSION, getParentSetStateCode, false, addFreezed);
						saveParentSet(path.join(focusedFilePath, 'store'), name, context);
						vscode.window.showInformationMessage(name + ' Parent Set Created.');
					}
					nameField.validationMessage = '';
				}
			});
			nameField.show();
		}
	});

	vscode.commands.registerCommand('flutter-redux-gen.selectParentSet', async (args) => {
		const folders = vscode.workspace.workspaceFolders;
		if (!folders) {
			return vscode.window.showErrorMessage(NO_FOLDER_IN_WORKSPACE_FOUND);
		}

		const sets: vscode.Uri[] = [];
		const fillSetsArray = folders.map(folder =>
			vscode.workspace.findFiles(
				new vscode.RelativePattern(folder, STATE_FILE_RELATIVE_PATTERN),
			).then(files => sets.push(...files))
		);

		await Promise.all(fillSetsArray);

		if (!sets.length) {
			return vscode.window.showErrorMessage(NOT_FOUND_ANY_SET_FILE);
		}

		const parent = getParentName(context);
		const placeHolder = parent ? CURRENT_PARENT.replace('<FILE>', parent) : '';

		var set = await vscode.window.showQuickPick(sets.map(set => set.path), { title: SELECT_PARENT_SET, placeHolder });
		if (set) {
			saveParentSet(path.dirname(set), path.basename(set, STATE_EXTENSION), context);
			vscode.window.showInformationMessage(SUCCESFULLY_SET_PARENT.replace('<FILE>', path.basename(set)));
		}
	});

	context.subscriptions.push(createParentSet);

}

// this method is called when your extension is deactivated
export function deactivate() {
}
