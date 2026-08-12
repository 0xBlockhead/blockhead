import { expect, test } from '@playwright/test'


test('renders a public ACP registry program through the server-owned registry query', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-acp-registry-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto('/agents/acp/program/registry/codex-acp')
	await expect(page.getByRole('heading', { name: 'Codex' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('codex-acp', { exact: true })).toBeVisible()
	await expect(page.getByRole('link', { name: 'https://github.com/agentclientprotocol/codex-acp' })).toHaveAttribute(
		'href',
		'https://github.com/agentclientprotocol/codex-acp'
	)
	await expect(page.getByText('@agentclientprotocol/codex-acp@1.1.14', { exact: true })).toBeVisible()
})
