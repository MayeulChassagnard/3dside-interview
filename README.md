# OSS 117 Quotes CLI

## Setup & Install

```bash
git clone https://github.com/MayeulChassagnard/3dside-interview.git
cd 3dside-interview
npm install
```

## Run

### Get a random quote
```bash
npm start
```
### Get a specific number of random quote
```bash
npm start -- --number=3
```
### Filter quotes by character
```bash
npm start -- --character=hubert
```
### Filter quotes by keyword
```bash
npm start -- --keyword="j'aime"
```
### Help
```bash
npm start -- --help
```
### Cumulative arguments: filter by keyword from character and display a specific random number quote
```bash
npm start -- --keyword="b**ch" --number=2 --character=bill
```

## Run Tests
```bash
npm test
```

