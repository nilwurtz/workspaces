// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { getConfig } from './lib/config';
import { formatDate } from './lib/formatter';
import { formatMessage, getSchedules, isTimePassed, Schedule } from './lib/schedule';

let statusBarClock: vscode.StatusBarItem;
let timer: NodeJS.Timeout;

// activate extension
export function activate({ subscriptions }: vscode.ExtensionContext) {
  statusBarClock = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  const app = new TimerApplication(statusBarClock);

  timer = setInterval(app.updateTime, 1000);
  subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(app.reloadConfig)
  );
}

class TimerApplication {
  now: Date;
  schedules: Schedule[];
  config: vscode.WorkspaceConfiguration;
  displayFormat: string | undefined;
  displayMessage: string | undefined;
  element: vscode.StatusBarItem;

  constructor(el: vscode.StatusBarItem) {
    this.now = new Date();
    this.config = getConfig();
    this.displayFormat = this.config.get<string>("formatString");
    this.displayMessage = this.config.get<string>("displayMessage");
    this.schedules = getSchedules(this.config);
    this.initializeSchedule();
    this.element = el;
  }

  // use allow func to bind 'this'
  updateTime = () => {
    this.now = new Date();
    this.checkSchedulesTime();
    this.element.text = formatDate(this.now, this.displayFormat);
    this.element.show();
  };

  reloadConfig = () => {
    this.config = getConfig();
    this.displayFormat = this.config.get<string>("formatString");
    this.schedules = getSchedules(this.config);
    this.initializeSchedule();
  };

  initializeSchedule = () => {
    this.schedules = this.schedules.map((item) => {
      if (isTimePassed(item, this.now)) {
        item.notified = true;
      }
      return item;
    });
  };

  checkSchedulesTime = () => {
    this.schedules = this.schedules.map((item) => {
      if (isTimePassed(item, this.now) && item.notified === false) {
        vscode.window.showInformationMessage(formatMessage(item));
        item.notified = true;
      }
      return item;
    });
  };
}

// this method is called when your extension is deactivated
export function deactivate() {
  clearInterval(timer);
}
