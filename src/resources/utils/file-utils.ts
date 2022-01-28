import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { clearParentSet, saveParentSet } from './storage';
import { SELECT_PARENT_SET, STATE_EXTENSION } from './constants';

function _createFile(fPath: string, name: string, extention: string, getGenCode: Function, showInfo: boolean) {
    const pathWithFileName = path.join(fPath, name.toLocaleLowerCase() + extention);
    fs.writeFile(pathWithFileName, getGenCode(name), err => {
        if (err) {
            vscode.window.showInformationMessage('Please check your path. Otherwise file a issue in Git Repo. Let me help.');
        } else if (showInfo) {
            vscode.window.showInformationMessage(`${name}${extention} Created Successfully.`);
        }
    });
}

function _createFolder(fPath: string, name: string): boolean {
    if (!fs.existsSync(path.join(fPath, name))) {
        fs.mkdirSync(path.join(fPath, name));
        return true;
    } else {
        vscode.window.showErrorMessage('Folder Already Exist');
        return false;
    }
}

function _isParentSetExist(context: vscode.ExtensionContext) {
    if (context.workspaceState.get("PARENT_PATH") && fs.existsSync(context.workspaceState.get("PARENT_PATH") as string)) {
        return true;
    } else {
        clearParentSet(context);
        return false;
    }
}

async function _checkAndSelectParentSetIfAlreadyExist(args: any, context: vscode.ExtensionContext) {
    const isFile = fs.statSync(args.path).isFile();
    const dir = isFile ? path.dirname(args.path) : args.path;
    const sets = fs.readdirSync(dir).filter(file => file.endsWith(STATE_EXTENSION));
    if (sets.length === 0) {
        return;
    }

    var selectedSet = await vscode.window.showQuickPick(sets, { title: SELECT_PARENT_SET });

    if (!selectedSet) {
        return;
    }
    saveParentSet(dir, path.basename(selectedSet, STATE_EXTENSION), context);
};

// function _getFlutterVersion(context: vscode.ExtensionContext) {
//     console.log("INSIDE FLUTTER VERSION");
//     console.log(context.logPath);
//     console.log(context.workspaceState.get("PARENT_PATH"));
// }

export var createFile = _createFile;
export var createFolder = _createFolder;
export var isParentSetExist = _isParentSetExist;
export var checkAndSelectParentSetIfAlreadyExist = _checkAndSelectParentSetIfAlreadyExist;
// export var getFlutterVersion = _getFlutterVersion;