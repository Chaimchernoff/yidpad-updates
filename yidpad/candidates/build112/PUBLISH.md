# Publish the tested Bluetooth fix

The APK here is production-signed build 112, version 0.13.69. Its hash, signer, source commit, and checks are in candidate.json. It opens PIN-protected Bluetooth pairing and retains build 111 automatic central-administrator FRP.

On the original release-signing computer, fetch codex/auto-enrollment-frp from Chaimchernoff/YidPad. Download this exact APK over HTTPS and verify its SHA-256, size, production signer, and compiled update-channel configuration. Do not rebuild it just to publish metadata.

Use the existing offline update-metadata signing key matching config/catalog-signing-public.pem (SPKI SHA-256 df93c9f5fc0a07b6d68fa894d7791e50f125b74b994f016ace2257ffd3c4720d). Do not substitute the starter-app key or rotate tablet trust. Continue the latest publicly verified signed ledger for the existing ONN engineering channel through scripts/build-update-release.sh; use a strictly newer release serial and the same ONN model 100135925 targeting. Reuse the validated APK's update/app channel, portal origin, and command-key configuration.

Publish and independently verify every output file before requesting a fleet update check. Identify the intended currently enrolled tablet from its registration, last report, and installed version; do not send to an old registration by assumption. An update check is not an installation receipt. Confirm installation through a new tablet report; Android may require local approval. If the new tablet is not paired or online, finish pairing or connectivity first. No wipe or re-enrollment is needed.
