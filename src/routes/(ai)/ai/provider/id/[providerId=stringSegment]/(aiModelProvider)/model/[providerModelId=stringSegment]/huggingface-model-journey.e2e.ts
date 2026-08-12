import { expect, test } from '@playwright/test'


test('renders a public Hugging Face model and immutable revision through server-owned reads', async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-huggingface-model-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto('/ai/provider/id/huggingface/model/bert-base-uncased')
	await expect(page.getByRole('heading', { name: 'bert-base-uncased' })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('fill-mask', { exact: true }).first()).toBeVisible()
	await expect(page.getByText('google-bert', { exact: true }).first()).toBeVisible()

	await page.goto('/ai/model-version/huggingface/bert-base-uncased/86b5e0934494bd15c9632b12f734a8a67f723594')
	await expect(page.getByRole('heading', {
		name: '86b5e0934494bd15c9632b12f734a8a67f723594',
	})).toBeVisible({ timeout: 120_000 })
})
