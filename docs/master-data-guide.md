# Local Master Data

This demo uses browser localStorage as its local master-data store. It is compatible with static hosting, including GitHub Pages.

## Maintained entities

- organizations: organization tree
- users: enterprise users
- projects: construction projects
- workers: labor worker roster
- dictionaries: data dictionary types and values

## How it works

1. The first visit creates browser-local data from the demo seed data.
2. Changes made through the UI are saved immediately.
3. Data is retained after page refreshes on the same browser and site address.
4. Use Base > Organization Management to export, import, or restore the full master-data package.

## Deployment note

Browser localStorage is per browser and per origin. When a colleague opens the demo from another computer or domain, use the exported JSON file to import the maintained data.

The entity structure in `data/master-data-schema.json` is also suitable as a reference for later backend tables and APIs. The static demo does not write to project files or a server database.
