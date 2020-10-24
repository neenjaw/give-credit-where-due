# Give Credit Where Due

Code is rarely derived alone. Good code comes from interactions from friends, co-workers, acquaintances.

Git commit trailers indicating co-authorship is a great way to give credit where due. Finding the information to write that trailer is not always intuitive.

## Requirements

- nodejs (latest LTS (v14) was used to write command)
- libsecret `sudo apt-get install -y libsecret-1-0`
- libsecret-tools `sudo apt-get install -y libsecret-tools`

While it doesn't explicitly run only on Ubuntu, it has been developed and tested solely on Ubuntu 20.04

## Usage

### Global install

`npm install -g give-credit-where-due`

### Local install

`git clone https://github.com/neenjaw/give-credit-where-due.git`

Then it can be used:

```shell
> node give-credit-where-due/cli.js
```

### Command line usage

```text
> give-credit [github_user_names...]

The following flags may also be used instead:
  --set-token token\tset a new github personal access token
  --show-token\t\tshow the current github personal access token
  --unset-token\t\tunset github personal access token`
```

## How does it work

This command uses a github personal access token, stored in the libsecret "Secret Service". Then it uses the `Oktokit` rest api to do a user lookup, getting the user's _name_ and _email_ to build the commit trailer string.
