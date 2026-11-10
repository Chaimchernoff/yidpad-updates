export const UPDATE_BASE = 'https://updates.yidpad.com/yidpad/onn-engineering-20261020/';
const SIGNER = 'e38f086a83aabf5ae0a4a61021967118fc83b7816af969f41479b5435b8eba65';
const PUBLIC_KEY = 'MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAniq+hdWHxs21bZKHvC4AoZ1LRWVRBxZFDVinu6g85LVSiKmYRH4/ipBhLrj7/QVKAPGr3I6XRBVIxVQpWi5yUNpPjEmjw4zlep+KrmZBOG7vArYqWOKfWgLzg4tsHMYvZL46hLkhabriSA1rRAPGvpBVExNsENNF2H1h2abv7fLB33s1ARLrewpa6pRtR63Wpp9MsB76QNm1XWZB8+uI0Xc2JPBzcTWsaTdZ/CsyaQ38zM+T8K06PDGAEz8/uNi+tjhkZfWSxrOHP6YwJvg5av//N8uZpk7A2BsQ1g/UwiTpWJ0df7gM/Sb50MH6TJTXxoZgh9RhZ/e0UaJVMGl4KQ+Ap6KzFI9eM47wZF0R4PV8MAwVkfgsTN7aXEVM4CagRytoNlukAr5T8diMJiLMIDn0PXfbGYRFuYk81QGYDGnAr96mhuDV2vtrb39JZa4ohkR48bvQHvOoY4vzedupB2vXrWJdACGW62l8kcLR1tEYedHJ2r2MaviyG0lau0TxAgMBAAE=';
const bytes = text => Uint8Array.from(atob(text), c => c.charCodeAt(0));
export async function verifiedEnrollment(raw, signature, now = Date.now() / 1000) {
  const key = await crypto.subtle.importKey('spki', bytes(PUBLIC_KEY),
    {name:'RSASSA-PKCS1-v1_5', hash:'SHA-256'}, false, ['verify']);
  if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, raw))
    throw Error('The release signature could not be verified.');
  const manifest = JSON.parse(new TextDecoder().decode(raw));
  const apk = manifest.apk;
  if (manifest.schemaVersion !== 1 || manifest.packageName !== 'com.yidpad.lockdown'
      || manifest.updateBaseUrl !== UPDATE_BASE
      || !Number.isSafeInteger(manifest.versionCode) || manifest.versionCode < 1
      || typeof manifest.versionName !== 'string' || !/^[0-9]+(?:\.[0-9]+)*$/.test(manifest.versionName)
      || !Number.isSafeInteger(manifest.releaseSerial) || manifest.releaseSerial < 1
      || !Number.isSafeInteger(manifest.issuedAtEpochSeconds)
      || !Number.isSafeInteger(manifest.expiresAtEpochSeconds)
      || manifest.issuedAtEpochSeconds > now + 300
      || manifest.expiresAtEpochSeconds <= now
      || manifest.expiresAtEpochSeconds <= manifest.issuedAtEpochSeconds
      || manifest.rollout?.percentage !== 100
      || !apk || apk.signerCertificateSha256 !== SIGNER
      || typeof apk.path !== 'string' || !/^yidpad-[0-9]+(?:\.[0-9]+)*\.apk$/.test(apk.path)
      || apk.path !== `yidpad-${manifest.versionName}.apk`
      || typeof apk.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(apk.sha256)
      || !Number.isSafeInteger(apk.sizeBytes) || apk.sizeBytes < 1)
    throw Error('A current, fully published YidPad release could not be confirmed.');
  const checksum = btoa(String.fromCharCode(...apk.sha256.match(/../g).map(h => parseInt(h,16))))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  const payload = {
    'android.app.extra.PROVISIONING_DEVICE_ADMIN_COMPONENT_NAME':
      'com.yidpad.lockdown/.admin.YidPadDeviceAdminReceiver',
    'android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_DOWNLOAD_LOCATION': UPDATE_BASE + apk.path,
    'android.app.extra.PROVISIONING_DEVICE_ADMIN_PACKAGE_CHECKSUM': checksum,
    'android.app.extra.PROVISIONING_SKIP_ENCRYPTION': false,
  };
  return {manifest, payload, text:JSON.stringify(payload)};
}
