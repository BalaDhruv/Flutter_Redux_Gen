import * as fs from 'fs';
import * as path from 'path';

function _getFormattedStateName(name: string) {
	return name.split('_').map(word => word[0].toLocaleUpperCase() + word.substring(1)).join('');
}

function _getFormattedReducerName(name: string) {
	return name.split('_').map(word => word[0].toLocaleLowerCase() + word.substring(1)).join('');
}

function _getFilePath(fPath: string) {
	const syncPath = fs.statSync(fPath);
	if (syncPath.isFile()) {
		return path.dirname(fPath);
	}
	return fPath;
}

export var getFormattedStateName = _getFormattedStateName;
export var getFormattedReducerName = _getFormattedReducerName;
export var getFilePath = _getFilePath;