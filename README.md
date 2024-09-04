## About

Welcome to the repository for 3DVertebrates.org, the second platform of 3DExhibits4Learning. The beta version of the software is scheduled for release January 2025.

This is a [Next.js](https://nextjs.org/) project with a [MySQL](https://www.mysql.com/) database accessed via [Prisma ORM](https://www.prisma.io/). Authentication is through nextauth.js.

3D Modeling documentation will be added upon release of the software.

## Initialization

Before the program will run, you will need to create and host a database and initialize a [Prisma ORM](https://www.prisma.io/) client with .env file. The preconfigured Oauth2 providers are Google, Sketchfab and iNaturalist. A premium sketchfab account is also required for all model viewer initialization options.

## Database

We use and recommend a [MySQL](https://www.mysql.com/) database, but others can be used through Prisma ORM and the schema is included in the Prisma folder.

Simply create and host your database locally or online, then [configure](https://www.prisma.io/docs/orm/prisma-client) your Prisma client (if your schema differs at all) and .env file to access your database.

## 3D Models

Check back here for updates regarding 3D modeling documentation. [Sketchfab](https://sketchfab.com/developers/viewer) is our 3D model hosting provider; a premium account is required for many of the viewer api initialization options in the code (such as watermark removal)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
