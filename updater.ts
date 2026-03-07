import * as fs from "fs";
import * as nunjucks from "nunjucks";
import { GithubUser } from "./src/github";
import { getTheme } from "./src/theme";

nunjucks.configure({ autoescape: true });

const templateString = fs.readFileSync("template.svg", "utf-8");

const username = process.argv[2];
const req_theme = process.argv[3] || "random";

const user = new GithubUser(username);
user.fetchContent().then(() => {
  const outString = nunjucks.renderString(templateString, {
    data: user,
    theme: getTheme(req_theme),
  });

  fs.writeFileSync("./github_stats.svg", outString);
});
