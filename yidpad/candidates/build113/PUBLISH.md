# Publish build 113: restore the missing app collection

Use the exact production-signed yidpad-0.13.70.apk in this directory. Verify candidate.json, its SHA-256 and size, production certificate, and compiled channel settings. This APK passed 908 debug tests, 910 release tests, release lint, and a physical upgrade on the connected ONN tablet. The catalog now loads with enabled Add buttons. It retains the Bluetooth fix and automatic central-administrator FRP.

Fetch source commit 719e40895269369b35c629e3127cb5fb120994a8 from codex/auto-enrollment-frp in Chaimchernoff/YidPad. The managed-app channel intentionally changes from apps/stable/ to apps/starter-setup-20261027/ to match the bundled catalog. The launcher update channel, command key and remote portal remain the existing production values.

Sign with the existing offline metadata key matching config/catalog-signing-public.pem (SPKI SHA-256 df93c9f5fc0a07b6d68fa894d7791e50f125b74b994f016ace2257ffd3c4720d). Do not substitute the starter key or rotate trust. On this workstation import the transferred key with scripts/release-workstation.py import-update-key FILE, then run the existing release builder through scripts/release-workstation.py run.

Download and verify the latest signed manifest and release ledger from the ONN engineering channel. Continue that ledger using scripts/build-update-release.sh with version 113 / 0.13.70, target model 100135925, matching compiled settings, and a strictly newer serial (last verified 202610280004; use 202610280005 only if still newer than the live ledger). Preserve rollout cohort semantics. Do not rebuild the tested APK merely to sign metadata.

Publish all generated files, independently verify public HTTPS bytes and detached signatures, then request an update check for the intended paired tablet. Confirm through a new installation receipt. No wipe or re-enrollment is required. The USB-connected tablet is already on 113; other tablets and enrollment still need publication.
