---

## 2026-03-09 SnapLinks3

### Lesson Learned: eslint-plugin-import was unused
**Discovery:** `eslint-plugin-import@2.32.0` was listed as a devDependency but never referenced in `eslint.config.js` or any custom rules files.
**Context:** Surfaced as a peer dependency conflict when upgrading `@babel/core` — it doesn't support ESLint 10.
**Application:** When a peer dep conflict arises during install, check whether the conflicting package is actually used before reaching for `--legacy-peer-deps`. Removing it was the cleaner fix.

### Lesson Learned: web-ext 9.x dropped .js config file support
**Discovery:** web-ext 9.0+ no longer accepts `.js` config files; must use `.cjs` (CommonJS) or `.mjs` (ES module).
**Context:** Upgrading web-ext 8.x → 9.4.0.
**Application:** Rename `.webext-*.js` → `.webext-*.cjs` and update any script references in `package.json`. Config content (module.exports) stays the same.

### Lesson Learned: Firefox manifest `applications` key is deprecated
**Discovery:** `applications` in the Firefox manifest must be replaced with `browser_specific_settings` for MV2+; web-ext lint will warn `APPLICATIONS_DEPRECATED`.
**Context:** Running `web-ext lint` after upgrading to web-ext 9.4.0.
**Application:** Always use `browser_specific_settings.gecko` in the manifest template.

### Lesson Learned: data_collection_permissions schema constraints
**Discovery:** `data_collection_permissions.required` has `minItems: 1` — empty arrays are invalid. For extensions that collect no data, use `"required": ["none"]`. The `optional` key can be omitted entirely.  Feature requires Firefox 142+ (Android); set `strict_min_version` to `142.0` to avoid version mismatch warnings.
**Context:** Fixing `MISSING_DATA_COLLECTION_PERMISSIONS` lint warning in web-ext 9.4.0.
**Application:** Add to gecko block in manifest.hbs:
```json
"data_collection_permissions": {
"required": ["none"]
}
```
and set `"strict_min_version": "142.0"`.

### Decision: Bump strict_min_version to 142.0
**Context:** Adding `data_collection_permissions` to the Firefox manifest. The field was introduced in Firefox 140 (desktop) and 142 (Android).
**Decision:** Set `strict_min_version` to `142.0` to satisfy both desktop and Android requirements.
**Reasoning:** Silences both `KEY_FIREFOX_UNSUPPORTED_BY_MIN_VERSION` warnings cleanly. Firefox 142 is recent but the extension targets modern browsers; the old floor of 63.0 was very stale.
**Alternatives Considered:** Keeping 63.0 and accepting the warnings — rejected as noise in CI lint output.
**Outcome:** Lint warnings reduced from 7 to 5 (only pre-existing code-quality warnings remain).
