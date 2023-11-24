# HOWTO

## Description

The project uses [NestJS](https://github.com/nestjs/nest) framework and [Typescript](https://www.typescriptlang.org/).

## Installation

```
nvm exec npm ci
```

## Running the app

> [!IMPORTANT]
> It's necessary to create .env file and provide environments values

### Option 1 - applications aren't in containers

Run databases:
```
docker-compose -f docker-compose.local.yml -p poi-challenge up
```

Run applications:
```
nvm exec npm run start:api
nvm exec npm run start:worker
nvm exec npm run start:scheduler
```

### Option 2 - applications are in containers

Run databases and applications in containers:
```
docker-compose --env-file ./.env -f docker-compose.full-local.yml -p poi-challenge up
```

## Running the tests

// TODO: add commands for tests
