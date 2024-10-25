# Leaderboards.gg Admin Panel

This is the repo for the Vue web app for Admins of the site.

## Initial Reqs

- [nf] Admins can log out directly from the portal view, which should clear their session cookie and redirect them back to LBGG.

- [nf] Admins can see a list of all leaderboards. A filter can be used to view only deleted boards, only non-deleted boards, or both.

- [nf] Admins can search for a specific board by name. This will be a very limited search functionality that's basically a glorified ctrl+f.

- [nf] Admins can click on a specific leaderboard to see all of its details, including Name, Slug, Info, time created, time last updated, and time deleted (if deleted).

- [nf] While in the leaderboard detail view, an admin can edit the name, slug, and/or info of the leaderboard and press a button to save the changes. If the slug is already taken, this action will fail, in which case an error needs to be displayed.

- [nf] While in the leaderboard detail view, an admin can press a button to delete the board if it is not already deleted.

- [nf] While in the leaderboard detail view, an admin can press a button to restore the board if it is currently deleted. This action may fail so the admin view needs to display the error returned by the backend in that case.

## Dev setup

- install [node 23.0.0 or higher](https://nodejs.org/en/)

- install pnpm 9.0.0 (Performant NPM)\
  $ `npm install -g pnpm`

- install dependencies\
  $ `pnpm install`

- serve with hot reload at `localhost:5173`\
  $ `pnpm serve`
