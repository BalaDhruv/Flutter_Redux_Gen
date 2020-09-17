import * as vscode from 'vscode';

function _saveParentSet(fPath: string, name: string,context: vscode.ExtensionContext) {
    console.log(fPath);
    console.log(name);
    context.workspaceState.update("PARENT_PATH",fPath);
    context.workspaceState.update("PARENT_NAME",name);
}

export var saveParentSet = _saveParentSet;