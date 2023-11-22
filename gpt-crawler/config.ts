import { Config } from "./src/config";

export const defaultConfig: Config = {
  url: "https://www.crowdcare.jp/",
  match: "https://www.crowdcare.jp/**",
  maxPagesToCrawl: 50,
  outputFileName: "output.json",
};
