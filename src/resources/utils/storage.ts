import * as vscode from 'vscode';

function _saveParentSet(fPath: string, name: string, context: vscode.ExtensionContext) {
    context.workspaceState.update("PARENT_PATH", fPath);
    context.workspaceState.update("PARENT_NAME", name);
}

function _clearParentSet(context: vscode.ExtensionContext) {
    context.workspaceState.update("PARENT_PATH", undefined);
    context.workspaceState.update("PARENT_NAME", undefined);
}

function _getParentPath(context: vscode.ExtensionContext): string {
    return context.workspaceState.get("PARENT_PATH") as string;
}

function _getParentName(context: vscode.ExtensionContext): string {
    return context.workspaceState.get("PARENT_NAME") as string;
}

export var saveParentSet = _saveParentSet;
export var clearParentSet = _clearParentSet;
export var getParentPath = _getParentPath;
export var getParentName = _getParentName;