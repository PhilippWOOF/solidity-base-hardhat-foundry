const { execSync } = require('child_process');
const fetch = require('node-fetch');

const branch = 'main';
const token = process.env.GITHUB_TOKEN;

async function suggestBranchProtection() {
  const question = [
          {
              type: "confirm",
              name: "protection",
              message: `Do you need Branch Protection?`,
              default: true
          }
      ];
      const prompt = createPromptModule();
      const answer = await prompt(question);
  
      if (answer.protection) await setBranchProtection();
}

async function setBranchProtection() {
    if (!token) {
    console.error('❌ GITHUB_TOKEN environment variable is not set.');
    process.exit(1);
  }

  // Auto-detect owner and repo from git remote URL
  let remoteUrl;
  try {
    remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
  } catch (e) {
    console.error('❌ Failed to get git remote URL:', e.message);
    process.exit(1);
  }

  const match = remoteUrl.match(/github\.com[:/](.+?)\/(.+?)(\.git)?$/);
  if (!match) {
    console.error('❌ Could not parse owner and repo from remote URL:', remoteUrl);
    process.exit(1);
  }

  const [, owner, repo] = match;

  const url = `https://api.github.com/repos/${owner}/${repo}/branches/${branch}/protection`;

  console.log(`🔧 Applying branch protection to ${owner}/${repo}@${branch}...`);

  fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      required_status_checks: {
        strict: true,
        contexts: ['PR Title Check']
      },
      enforce_admins: true,
      required_pull_request_reviews: {
        dismiss_stale_reviews: true,
        required_approving_review_count: 1
      },
      restrictions: null
    })
  })
    .then(res => {
      if (!res.ok) {
        return res.text().then(text => {
          throw new Error(`GitHub API Error: ${res.status} ${res.statusText}\n${text}`);
        });
      }
      return res.json();
    })
    .then(() => {
      console.log('✅ Branch protection applied successfully!');
    })
    .catch(err => {
      console.error('❌ Failed to apply branch protection:', err.message);
      process.exit(1);
    });
}

module.exports = { suggestBranchProtection };