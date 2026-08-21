# Base Data Structure

This version separates application code from maintainable base data.

## Directory Roles

- `../EM_LOCAL_DATA/`
  - Long-lived local data directory on this workstation.
  - Future organization, user, and dictionary maintenance pages should save data here.
  - Do not overwrite this directory when copying or extracting a new app version.
- `data/demo/`
  - Demo data snapshot bundled inside the current app package.
  - Export `EM_LOCAL_DATA` here before sending the zip package to colleagues.
- `data/seed/`
  - Initial seed data.
  - Used when both local data and demo snapshot are unavailable.
- `data/schema/`
  - Field schema references for future backend table design.
- `server/local-data-server.js`
  - Lightweight local JSON read/write server.
  - Future maintenance pages can call `/api/base-data/*`.

## Read Priority

```text
EM_LOCAL_DATA
data/demo
data/seed
app.js fallback data
```

## Current Base Data Files

- `organization.json`
  - Prototype source for a future backend `organization` table.
  - Tree relation uses `parentId` and `parentCode`.
- `users.json`
  - Prototype source for future backend `user` or `employee` tables.
- `dictionaries.json`
  - Prototype source for future backend `dict_type` and `dict_item` tables.
- `data-version.json`
  - Base data version metadata.

## Start Local Data Server

```powershell
.\scripts\start-local.ps1 -Port 8193
```

Open:

```text
http://127.0.0.1:8193/index.html
```

## Export Demo Data Before Packaging

```powershell
.\scripts\export-demo-data.ps1
```

After export, current local base data is copied to `data/demo/`, so the zip package can carry the same data snapshot for preview.
