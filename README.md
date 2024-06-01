# Test Platform Backend

### 1. Install dependencies

```
npm install
```

### 2. Setup env variables.

Setup .env following .env.example structure.


### 3. Install PostgreSQL Database

**Download the PostgreSQL Docker Image**
Prerequisite: Docker installed and running on your local dev machine.

```

docker pull postgres

```

**Run the Docker Container by itself**

```console
docker run --name localNestDb -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=12345678x@X -e POSTGRES_DB=localNestDb -d postgres
```

### 4. Add Database URL to Prisma configuration

```
echo DATABASE_URL=postgresql://postgres:12345678x@X@0.0.0.0:5466/localTfDB > ./env
```

### 5. Create the Database Schema

```
npx prisma db push
```

### 6. View the Database Records

```
npx prisma studio
```

### 7. Connecting DBeaver (or other SQL Client) to your docker postgresDB

TODO: Add instructions about using a proxy to connect to the DB (not implemented yet in AWS)

Create a new connection with the following inputs:

- **Host** = localhost
- **Port** = 5432 (or the same as the port you used in the docker run command)
- **Database** = localTfDB (or the same as the database name you used in the docker run command)
- **Username** = postgres
- **Password** = 12345678x@X

Test the connection, then finish.

### 8. Start the API locally

Start the server with nodemon so you have hot reload.

```

npm run dev

```

_Be default the server starts on port 3000. You can override this in your local `.env.example` file._

### 9. Pull Requests that contain a Database Migration

Try to only have 1 extra migration folder per PR. If you have to refactor your schema multiple times you can end up with a migration for each refactor.

Additional Resources
- Prisma Seed Documentation: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding

### 10. Swagger

```

http://localhost:${port}/api

```

## Troubleshooting
