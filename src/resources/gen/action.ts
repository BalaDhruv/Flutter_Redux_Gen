import { getFormattedStateName } from "../utils/utils";

function _getActionGenCode(name: string) {
	const sName = getFormattedStateName(name);
	return `
import 'package:flutter/material.dart';

class ${sName}Action {

	@override
	String toString() {
	return '${sName}Action { }';
	}
}

class ${sName}SuccessAction {
	final int isSuccess;

	${sName}SuccessAction({required this.isSuccess});
	@override
	String toString() {
	return '${sName}SuccessAction { isSuccess: $isSuccess }';
	}
}

class ${sName}FailedAction {
	final String error;

	${sName}FailedAction({required this.error});

	@override
	String toString() {
	return '${sName}FailedAction { error: $error }';
	}
}
	`;
}

export var getActionGenCode = _getActionGenCode;