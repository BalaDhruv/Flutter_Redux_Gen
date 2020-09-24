import * as vscode from 'vscode';

function _saveParentSet(fPath: string, name: string,context: vscode.ExtensionContext) {
    context.workspaceState.update("PARENT_PATH",fPath);
    context.workspaceState.update("PARENT_NAME",name);
}

function _clearParentSet(context: vscode.ExtensionContext) {
    context.workspaceState.update("PARENT_PATH",undefined);
    context.workspaceState.update("PARENT_NAME",undefined);
}

export var saveParentSet = _saveParentSet;
export var clearParentSet = _clearParentSet;