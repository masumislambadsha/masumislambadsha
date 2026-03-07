import { Octokit } from "@octokit/rest";
import { align_username, align } from "./utils";

const token = process.env.GHT;

const octokit = new Octokit({
  auth: token,
  log: {
    debug: () => {},
    info: () => {},
    warn: console.warn,
    error: console.error,
  },
});

function dateDiffInDays(date: string): number {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  const utc1 = Date.now();
  const b = new Date(date);
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}

export class GithubUser {
  userName: string;
  userContent?: any;
  repoContent?: any[];
  name?: string;
  repo?: string;
  gists?: string;
  followers?: string;
  createdAt?: number;
  starsCount?: number;
  forkCount?: number;
  commitsCount?: number;
  issueCount?: number;
  prCount?: number;
  stars?: string;
  forks?: string;
  commits?: string;
  issues?: string;
  pr?: string;
  uptime?: number;
  username?: string;

  constructor(username: string) {
    this.userName = username;
  }

  async getCommits(): Promise<number> {
    const res = await octokit.search.commits({
      q: `author:${this.userName}`,
    });
    return res.data.total_count;
  }

  async getIssueAndPr(type: string): Promise<number> {
    const res = await octokit.search.issuesAndPullRequests({
      q: `type:${type} author:${this.userName}`,
    });

    return res.data.total_count;
  }

  async fetchContent(): Promise<void> {
    this.userContent = await octokit.request("GET /users/{username}", {
      username: this.userName,
    });
    this.repoContent = await octokit.paginate("GET /users/{owner}/repos", {
      owner: this.userName,
    });
    this.name = this.userContent.data.name;
    this.repo = align(this.userContent.data.public_repos);
    this.gists = align(this.userContent.data.public_gists);
    this.followers = align(this.userContent.data.followers);
    this.createdAt = dateDiffInDays(this.userContent.data.created_at);
    this.starsCount = 0;
    this.forkCount = 0;
    this.repoContent.forEach((repo: any) => {
      this.starsCount! += repo.stargazers_count;
      this.forkCount! += repo.forks;
    });
    this.commitsCount = await this.getCommits();
    this.issueCount = await this.getIssueAndPr("issue");
    this.prCount = await this.getIssueAndPr("pr");
    this.stars = align(this.starsCount);
    this.forks = align(this.forkCount);
    this.commits = align(this.commitsCount);
    this.issues = align(this.issueCount);
    this.pr = align(this.prCount);
    this.uptime = this.createdAt;
    this.username = align_username(this.userName);
  }
}
