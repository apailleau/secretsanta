# Secret Santa Generator

This project is a simple Secret Santa generator. It allows you to input participants and couples, and then generates a Secret Santa list.

## How to Use

1. Enter the names of the participants in the 'Participant' input fields.
2. If there are couples participating, enter their names in the 'Couple' input fields. The generator will ensure that people in the same couple do not draw each other's names.
3. Click the 'Generate Secret Santa' button to create the Secret Santa list.

## Project Structure

The main logic of the Secret Santa generator is contained in the `secretsanta.js` file. This file contains functions for adding participants and couples, as well as the `generateSecretSanta` function which creates the Secret Santa list.

## Development

To start developing on this project, follow these steps:

1. Clone the repository
2. Open the project in your favorite editor
3. Start a local server to serve the files

## Run the tests
```bash
npm install --save-dev jsdom jest
npm test
```
