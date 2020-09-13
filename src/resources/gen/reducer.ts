import { getFormattedReducerName } from "../utils/utils";

function _getReducerGenCode(name: string) {
	const sName = getFormattedReducerName(name);
	return `
import 'package:redux/redux.dart';

final ${sName}Reducer = combineReducers<AppState>([
]);
	`;
}

export var getReducerGenCode = _getReducerGenCode;