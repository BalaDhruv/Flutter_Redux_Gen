import { getFormattedStateName } from "../utils/utils";

function _getMiddlewareGenCode(name: string) {
	const sName = getFormattedStateName(name);
	return `
import 'package:redux/redux.dart';

Middleware<AppState> get${sName}(Repository _repo) {
	return (Store<AppState> store, action, NextDispatcher dispatch) async {
	dispatch(action);
	try {
		// TODO: Write here your middleware logic and api calls
	} catch (error) {
		// TODO: API Error handling
		print(error);
	}
	};
}
	`;
}

export var getMiddlewareGenCode = _getMiddlewareGenCode;