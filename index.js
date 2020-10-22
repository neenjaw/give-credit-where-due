const { Octokit } = require('@octokit/rest')
const {
  getSecretToken,
  putSecretToken,
  unsetSecretToken,
} = require('./lib/secrets')
const argv = require('yargs/yargs')(process.argv.slice(2))
  .nargs('show-token', 0)
  .nargs('unset-token', 0)
  .nargs('set-token', 1).argv

const run = async () => {
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

run()
