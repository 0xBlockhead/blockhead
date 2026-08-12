import { expect, test } from '@playwright/test'


test('renders a current EAS attestation through the server-owned GraphQL query', async ({ page, request }, testInfo) => {
	testInfo.setTimeout(180_000)
	const latestResponse = await request.post('https://easscan.org/graphql', {
		data: {
			query: 'query { attestations(where: {}, skip: 0, take: 1, orderBy: { time: desc }) { id } }',
		},
	})
	expect(latestResponse.ok()).toBe(true)
	const latest = await latestResponse.json() as {
		data: {
			attestations: [{
				id: string
			}]
		}
	}
	expect(latest.data.attestations).toHaveLength(1)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-eas-attestation-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})

	await page.goto(`/network/eip155:1/eas/attestation/${latest.data.attestations[0].id}`)
	await expect(page.getByRole('heading', { name: latest.data.attestations[0].id })).toBeVisible({ timeout: 120_000 })
	await expect(page.getByText('EasScan_Graphql', { exact: true }).first()).toBeAttached()
	await expect(page.getByRole('heading', {
		level: 4,
		name: /^\d{13}$/,
	})).toBeAttached()
})
