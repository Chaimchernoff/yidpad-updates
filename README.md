# YidPad update channel

This public repository hosts signed update artifacts for managed YidPad devices.
It intentionally contains no application source code or private signing material.

The production channel is published under `yidpad/stable/` and consists of:

- `manifest.json`
- `manifest.sig`
- the APK named by the signed manifest

Publish the APK before replacing the signed manifest pair. Update authenticity is
enforced by the offline manifest signature and the Android application signer.
