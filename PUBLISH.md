# Publishing this repo

The repository already exists and is empty:
<https://github.com/richhemsley3/clearway-prototype>

The cloud session this was built in cannot push to it. Its git traffic goes through a proxy that
only attaches credentials for repositories in the session's authorized set, and the GitHub API
refuses writes through that proxy outright. So the push runs from your machine, where your own
credentials live.

Everything is committed — several commits on `main`. Nothing to stage.

## Push

The remote already has an older push plus a few clean-up commits made through the GitHub website
(the landing page and the reference builds were deleted there). This folder's history is the one to
keep, so replace the remote's `main` with it:

```sh
git remote add origin https://github.com/richhemsley3/clearway-prototype.git   # skip if already set
git push --force -u origin main
```

Pages redeploys from `docs/` on the next push, a minute or two later.

## Turn on Pages

**Settings → Pages → Source: Deploy from a branch → Branch `main`, folder `/docs` → Save.**

Or, with the GitHub CLI:

```sh
gh api -X POST repos/richhemsley3/clearway-prototype/pages \
  -f 'source[branch]=main' -f 'source[path]=/docs'
```

The site appears at <https://richhemsley3.github.io/clearway-prototype/> a minute or two later.
`docs/index.html` is the prototype. There is nothing else to serve.

## Rebuilding

After editing anything in `src/`:

```sh
python3 build.py src/app-body.html docs/index.html
```
