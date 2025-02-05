const core = require('@actions/core');
const github = require('@actions/github');

const run = async () => {
    // Get octokit
    const gitHubToken = core.getInput('repo-token', { required: true });
    const octokit = github.getOctokit(gitHubToken);

    // Get repo and issue info
    const { repository, issue } = github.context.payload;
    if (!issue) {
        throw new Error(`Couldn't find issue info in current context`);
    }
    const [owner, repo] = repository.full_name.split('/');

    // Get issue assignees
    const assigneesString = core.getInput('assignees', { required: true });
    const assignees = assigneesString
        .split(',')
        .map((assigneeName) => assigneeName.trim());

    const bakra = [assignees[Math.floor(Math.random()*assignees.length)]];
    // Assign issue
    console.log(
        `Assigning issue ${issue.number} to users ${JSON.stringify(assignees)} and Picked a random user ${JSON.stringify(bakra)}`
    );
    try {
        await octokit.rest.issues.addAssignees({
            owner,
            repo,
            issue_number: issue.number,
            bakra
        });
    } catch (error) {
        core.setFailed(error.message);
    }
};

try {
    run();
} catch (error) {
    core.setFailed(error.message);
}
