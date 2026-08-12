import {
	expect,
	test,
} from '@playwright/test'

test('renders passive magnet metadata and its native torrent identity', async ({ page }) => {
	await page.goto(`/magnet/${encodeURIComponent(
		'magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=Release&xl=42&tr=https://tracker.example/announce'
	)}`)

	await expect(page.getByRole('main')).toBeAttached()
	await expect(page.getByText('Release', { exact: true }).first()).toBeVisible({
		timeout: 30_000,
	})
	await expect(page.getByText('0123456789abcdef0123456789abcdef01234567').first()).toBeAttached()
	await expect(page.getByText('https://tracker.example/announce').first()).toBeAttached()
})
