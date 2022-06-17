# Slack Status
[![SetStatus](https://github.com/ddok2/slack-status/actions/workflows/test.yml/badge.svg)](https://github.com/ddok2/slack-status/actions/workflows/test.yml)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ddok2/slack-status.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/ddok2/slack-status/context:javascript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Change User's status on Slack workspace using `puppeteer`.

## Setup
### Prep work
You need to save 3 envs in the repository secrets. Be sure to save those as the following.
* `TARGET_URL=https://workspace.slack.example`
* `USER_EMAIL=sung@sungyub.com`
* `USER_PASSWORD=pass`

### Setting Repository Workflow
```yaml
name: SetStatus

on:
  workflow_dispatch:
  schedule:
    - cron: '0 16 * * *' # runs every day at 1 am. on KST

jobs:
  set-status:
    name: Set User's status at slack
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 14.x ]
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
        env:
          TARGET_URL: ${{secrets.TARGET_URL}}
          USER_EMAIL: ${{secrets.USER_EMAIL}}
          USER_PASSWORD: ${{secrets.USER_PASSWORD}}
```

## Work
1. Go to `TARGET_URL`
2. Logging, `USER_EMAIL` and using `USER_PASSWORD`
3. If user status exists, remove it.
4. Set custom user status. Custom User Status like this:
   ![](https://user-images.githubusercontent.com/7994231/174257962-bd78c394-a43a-4e1e-a291-c1b14bfa1e66.png)

## License
These source code files are made available under th MIT License, located in the [LICENSE](LICENSE) file.
