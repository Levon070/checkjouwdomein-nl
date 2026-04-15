/**
 * IndexNow — notificeert Bing/Yandex/Naver van nieuwe of gewijzigde URLs.
 * Gebruik: await submitToIndexNow(['https://checkjouwdomein.nl/blog/nieuwe-post']);
 */

const INDEXNOW_KEY = 'a2f3b4c5d6e7f8a9b0c1d2e3f4a5b6c7';
const INDEXNOW_HOST = 'checkjouwdomein.nl';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export async function submitToIndexNow(urls: string[]): Promise<void> {
  if (!urls.length) return;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: INDEXNOW_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok) {
      console.log(`[IndexNow] ${urls.length} URL(s) submitted successfully`);
    } else {
      console.warn(`[IndexNow] Submission failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('[IndexNow] Submission error:', error);
  }
}

/**
 * Submit alle statische pagina's in één keer (gebruik bij eerste deploy).
 */
export async function submitAllPages(): Promise<void> {
  const base = `https://${INDEXNOW_HOST}`;
  const urls = [
    base,
    `${base}/naam-generator`,
    `${base}/merk-check`,
    `${base}/bulk-check`,
    `${base}/tld-gids`,
    `${base}/tips-domeinnaam`,
    `${base}/registrars`,
    `${base}/blog`,
    `${base}/over-ons`,
  ];
  await submitToIndexNow(urls);
}
