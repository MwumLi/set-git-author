# set-git-author

set a suitable git author by some rules, such as remote repo.

## Usage

> Notice: you can use install it globally by npm/yarn, or use it directly by `npx set-git-author`

1. set remote repo rules `$HOME/.set-git-author.json`:  

   ```json
   {
     "author": {
       "git-(biz|open).xxx.cn": "LiLuo <liluo@xxx.com>",
       "(github|gitlab).com": "MwumLi <mwumli@outlook.com>"
     }
   }
   ```
   **Conf Explain**
   > * if git remote repo is git-biz.xxx.cn/git-open.xxx.cn, use `LiLuo <liluo@xxx.com>`
   > * if git remote repo is github.com/gitlab.com, use `MwumLi <mwumli@outlook.com>`
   > * else (no match or default), use your git config in your computer.


2. set alias fot `git` commnad in `$HOME/.bashrc`:  

   ```bash
   alias git=`set-git-author && git`
   ```
   `alias` can be placed in `~/.bashrc` or `~/.zshrc`, depending on your terminal environment.


3. just run `git` is okay ! (no need to worry about the committer's mistakes😜)  


   
