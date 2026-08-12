import { expect, test } from '@playwright/test'


test('renders the current repository commit from the server-owned sync read', async ({ page, request }, testInfo) => {
	testInfo.setTimeout(180_000)
	const repoDid = 'did:plc:ewvi7nxzyoun6zhxrhs64oiz'
	const latestResponse = await request.get(
		`https://bsky.network/xrpc/com.atproto.sync.getLatestCommit?did=${encodeURIComponent(repoDid)}`
	)
	expect(latestResponse.ok()).toBe(true)
	const latest = await latestResponse.json() as {
		cid: string
		rev: string
	}
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-atproto-commit-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto(
		`/atproto/repo/${encodeURIComponent(repoDid)}/commit/rev/${latest.rev}/${encodeURIComponent('AtprotoSync_Xrpc')}`
	)
	await expect(page.getByRole('heading', { name: latest.rev })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText(latest.cid, { exact: true }).first()).toBeVisible()
	await expect(page.getByText('bsky.network', { exact: true }).first()).toBeVisible()
})
