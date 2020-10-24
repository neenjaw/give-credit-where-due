const { Octokit } = require('@octokit/rest')
const {
  getSecretToken,
  putSecretToken,
  unsetSecretToken,
} = require('./secrets')
const argv = require('yargs/yargs')(process.argv.slice(2))
  .nargs('show-token', 0)
  .nargs('unset-token', 0)
  .nargs('set-token', 1).argv

const usage = `
Usage:
> give-credit [github_user_names...]

The following flags may also be used instead:
  --set-token token\tset a new github personal access token
  --show-token\t\tshow the current github personal access token
  --unset-token\t\tunset github personal access token`

const run = async () => {
  if (
    argv._.length === 0 &&
    !argv.unsetToken &&
    !argv.showToken &&
    !argv.setToken
  ) {
    console.log(usage)
    process.exit(0)
  }

  if (argv.unsetToken) {
    await unsetSecretToken()
    process.exit(0)
  }

  if (argv.showToken) {
    try {
      console.log(await getSecretToken())
      process.exit(0)
    } catch {
      tokenNotSet()
    }
  }

  if (argv.setToken) {
    await putSecretToken(argv.setToken)
    console.log('Successfully set token')
    process.exit(0)
  }

  let token
  try {
    token = await getSecretToken()
  } catch (err) {
    tokenNotSet()
  }

  const oktokit = new Octokit({ auth: token })

  ;(await Promise.all(argv._.map((arg) => oktokit.request(`/users/${arg}`))))
    .map(toCommitTrailer)
    .forEach((committrailer) => console.log(committrailer))
}

const tokenNotSet = () => {
  console.log('Unable to find github personal access token.')
  console.log('Please re-run with --set-token flags')
  process.exit(1)
}

const toCommitTrailer = (response) => {
  const { name, email } = response.data
  return `Co-authored-by: ${name} <${email}>`
}

module.exports = {
  run,
}
