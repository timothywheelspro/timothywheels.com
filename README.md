# timothywheels.com

Hugo publishing site using the PaperMod submodule. Cloudflare Pages builds and serves the site; GitHub hosts the source and validation workflows.

## Setup

Install Hugo Extended 0.158.0, then:

```bash
git submodule update --init --recursive
python3 tools/build-preflight.py --environment local
hugo server -D
```

Content is under `content/`, data under `data/`, and static assets under `static/`.

## Operating records

- [Deployment, environment preflight, and recovery](tools/README-deploy-safety.md)
- [Motion scenes and exports](tools/motion/README.md)

`netlify.toml` remains the monitor's redirect source and version record. It does not identify the active hosting provider. Migrate and test the redirect consumer before retiring it.
