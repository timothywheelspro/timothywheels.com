"""Temporary approved Preview-only update. Never logs credentials or env values."""
import copy
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

BASE = 'https://api.cloudflare.com/client/v4/accounts/4dab80f0065133f2c036f51f6fae1de3/pages/projects/timothywheels-com'

def call(method, body=None):
    token = os.environ.get('CLOUDFLARE_API_TOKEN')
    if not token:
        raise SystemExit('Existing Cloudflare credential is unavailable.')
    req = Request(BASE, method=method, headers={'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'},
                  data=None if body is None else json.dumps(body).encode())
    try:
        with urlopen(req, timeout=30) as r:
            data = json.load(r)
    except HTTPError as e:
        raise SystemExit('Cloudflare API HTTP ' + str(e.code) + '; response body suppressed.') from None
    except (URLError, TimeoutError):
        raise SystemExit('Cloudflare API connection failed; no automatic retry.') from None
    if not data.get('success') or not isinstance(data.get('result'), dict):
        raise SystemExit('Cloudflare API unsuccessful; response body suppressed.')
    return data['result']

def main():
    mode = os.environ['PREVIEW_HUGO_MODE']
    if mode not in ('inventory', 'apply'):
        raise SystemExit('Unsupported operation.')
    before = call('GET')['deployment_configs']
    variables = before['preview'].get('env_vars') or {}
    names = sorted(variables)
    print('PREVIEW_NAMES_BEFORE=' + json.dumps(names), flush=True)
    if mode == 'inventory':
        print('READ_ONLY_INVENTORY_COMPLETE', flush=True)
        return
    if names != json.loads(os.environ['EXPECTED_PREVIEW_NAMES']):
        raise SystemExit('Variable names changed since inventory; update stopped.')
    payload = json.loads(open('tools/preview-hugo-update.json', encoding='utf-8').read())
    approved = {'deployment_configs': {'preview': {'env_vars': {'HUGO_VERSION': {'type': 'plain_text', 'value': 'extended_0.158.0'}}}}}
    if payload != approved:
        raise SystemExit('Payload differs from the approved Preview-only update.')
    target = payload['deployment_configs']['preview']['env_vars']['HUGO_VERSION']
    if variables.get('HUGO_VERSION') == target:
        print('PREVIEW_NAMES_AFTER=' + json.dumps(names), flush=True)
        print('ALREADY_CORRECT_NO_PATCH_SENT', flush=True)
        return
    call('PATCH', payload)  # Exactly one approved PATCH; never retried automatically.
    after = call('GET')['deployment_configs']
    after_vars = after['preview'].get('env_vars') or {}
    print('PREVIEW_NAMES_AFTER=' + json.dumps(sorted(after_vars)), flush=True)
    changed = sorted(k for k in set(variables) | set(after_vars) if variables.get(k) != after_vars.get(k))
    print('CHANGED_PREVIEW_NAMES=' + json.dumps(changed), flush=True)
    expected = copy.deepcopy(before)
    expected['preview'].setdefault('env_vars', {})['HUGO_VERSION'] = target
    if after != expected or changed != ['HUGO_VERSION'] or sorted(after_vars) != names:
        raise SystemExit('Post-update comparison failed. Stop for inspection; do not retry PATCH.')
    print('VERIFIED_ONLY_HUGO_VERSION_CHANGED', flush=True)
    print('VERIFIED_PRODUCTION_CONFIG_UNCHANGED', flush=True)

if __name__ == '__main__':
    main()
