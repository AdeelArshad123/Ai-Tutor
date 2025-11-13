import { GeneratedCode } from '../types';

interface GitHubPushOptions {
    token: string;
    repoUrl: string;
    files: GeneratedCode[];
    commitMessage: string;
    branch: string;
}

const GITHUB_API_BASE = 'https://api.github.com';

const parseRepoUrl = (url: string): { owner: string; repo: string } => {
    try {
        const match = url.match(/github\.com[/:]([^/]+)\/([^/.]+)(\.git)?/);
        if (!match) throw new Error();
        return { owner: match[1], repo: match[2] };
    } catch (e) {
        throw new Error('Invalid GitHub repository URL.');
    }
};

const githubApiRequest = async (endpoint: string, token: string, options: RequestInit = {}) => {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error (${response.status}): ${errorData.message || 'Unknown error'}`);
    }
    return response.json();
};


export const pushToGitHub = async ({ token, repoUrl, files, commitMessage, branch }: GitHubPushOptions): Promise<void> => {
    const { owner, repo } = parseRepoUrl(repoUrl);
    const branchName = branch;

    // 1. Get the latest commit SHA of the branch
    const refData = await githubApiRequest(`/repos/${owner}/${repo}/git/refs/heads/${branchName}`, token);
    const latestCommitSha = refData.object.sha;

    // 2. Get the tree SHA of the latest commit
    const commitData = await githubApiRequest(`/repos/${owner}/${repo}/git/commits/${latestCommitSha}`, token);
    const baseTreeSha = commitData.tree.sha;

    // 3. Create a blob for each file
    const blobPromises = files.map(file => 
        githubApiRequest(`/repos/${owner}/${repo}/git/blobs`, token, {
            method: 'POST',
            body: JSON.stringify({
                content: file.code,
                encoding: 'utf-8'
            }),
        }).then(blobData => ({
            path: file.filePath,
            mode: '100644', // file mode
            type: 'blob',
            sha: blobData.sha
        }))
    );
    const treeItems = await Promise.all(blobPromises);
    
    // 4. Create a new tree with the new file blobs
    const newTreeData = await githubApiRequest(`/repos/${owner}/${repo}/git/trees`, token, {
        method: 'POST',
        body: JSON.stringify({
            base_tree: baseTreeSha,
            tree: treeItems
        })
    });
    const newTreeSha = newTreeData.sha;

    // 5. Create a new commit
    const newCommitData = await githubApiRequest(`/repos/${owner}/${repo}/git/commits`, token, {
        method: 'POST',
        body: JSON.stringify({
            message: commitMessage,
            tree: newTreeSha,
            parents: [latestCommitSha]
        })
    });
    const newCommitSha = newCommitData.sha;

    // 6. Update the branch reference to point to the new commit
    await githubApiRequest(`/repos/${owner}/${repo}/git/refs/heads/${branchName}`, token, {
        method: 'PATCH',
        body: JSON.stringify({
            sha: newCommitSha
        })
    });
};