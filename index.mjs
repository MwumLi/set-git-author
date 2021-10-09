#!/usr/bin/env node
import { $, os, fs } from 'zx';

/**
 * set-got-author.json
 *  {
      "author": {
        "git-(biz|open).xxx.cn": "LiLuo <liluo@xxx.com>",
        "(github|gitlab).com": "MwumLi <mwumli@outlook.com>"
      }
    }
 * @returns 
 */
async function getConfig() {
  const confFile = os.homedir() + '/.set-git-author.json';
  const conf = await fs.readJson(confFile);
  return conf;
}

async function $$() {
  try {
    const data = await $.call(this, ...arguments);
    return [null, data];
  } catch(err) {
    return [err];
  }
}

async function isGitRepo(dir) {
  const { verbose, cwd }= $;
  $.verbose = false;
  $.cwd = dir || process.cwd();
  const [err, gitRepoRootPath ] = await $$`git rev-parse --git-dir`
  $.verbose = verbose;
  $.cwd = cwd;
  return err ? false : gitRepoRootPath;
}

async function getGitRemote(name, dir) {
  const { verbose, cwd }= $;
  $.verbose = false;
  $.cwd = dir || process.cwd();
  const [err, remoteConf ] = await $$`git remote get-url ${name}`
  $.verbose = verbose;
  $.cwd = cwd;
  if (err) return null;
  return `${remoteConf}`.trim();
}

function parseAuthor(author) {
  const reg = /(?<name>[^\<]+)\<(?<email>[^@]+@[^>]+)\>/;
  const {name = '', email = ''} = reg.exec(author)?.groups || {};
  if (!name) return null;
  return {
    name: name.trim(),
    email: email.trim()
  }
}
function matchAuthor(remote, authorConf) {
  const confEntries = Object.entries(authorConf)
  for (const [k, v] of confEntries) {
    const reg = new RegExp(k);
    if (reg.test(remote)) {
      return parseAuthor(v);
    }
  }
}

async function setAuthor({name, email}) {
  const { verbose } = $;
  $.verbose = false;
  await $$`git config user.name ${name} && git config user.email ${email}`;
  $.verbose = verbose;
}

process.on('unhandledRejection', (reason, p) => {
  const exitCode = reason.exitCode || 1;
  process.exit(exitCode);
});

(async () => {
  const workDir = process.cwd();
  const isGit = await isGitRepo(workDir)
  if (!isGit) return; 
  const remote = await getGitRemote('origin', workDir);
  if(!remote) return;
  const { author } = await getConfig();
  const matched = matchAuthor(remote, author);
  if (matched) {
    await setAuthor(matched);
  }
})();
