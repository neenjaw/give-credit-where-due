const { exec } = require('child_process')

const getSecretValue = (value) => {
  return new Promise((resolve, reject) => {
    exec(
      `secret-tool lookup give-credit-where-due ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error)
        }
        if (stderr) {
          return reject(stderr)
        }
        resolve(stdout.trim())
      }
    )
  })
}

const getSecretToken = () => {
  return getSecretValue('token')
}

const putSecretValue = (value, secret) => {
  value = `${value}`
  return new Promise((resolve, reject) => {
    if (value.length === 0) {
      return reject('value must be a non-empty string')
    }

    exec(
      `echo "${secret}" | secret-tool store --label=${Date.now()} give-credit-where-due ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error)
        }
        if (stderr) {
          return reject(stderr)
        }
        resolve(true)
      }
    )
  })
}

const putSecretToken = (secret) => {
  return putSecretValue('token', secret)
}

const unsetSecretValue = (value) => {
  return new Promise((resolve, reject) => {
    exec(
      `secret-tool clear give-credit-where-due ${value}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error)
        }
        if (stderr) {
          return reject(stderr)
        }
        resolve(true)
      }
    )
  })
}

const unsetSecretToken = () => {
  return unsetSecretValue('token')
}

module.exports = {
  getSecretToken,
  putSecretToken,
  unsetSecretToken,
}
