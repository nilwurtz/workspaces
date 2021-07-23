import * as vscode from 'vscode';

export const getConfig = () => {
  let config = vscode.workspace.getConfiguration("scheduleTimer");
  return config;
};
