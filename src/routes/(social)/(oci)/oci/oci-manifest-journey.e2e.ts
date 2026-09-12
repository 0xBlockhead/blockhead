import { expect, test, type Page, type Route } from '@playwright/test'
import { stringify } from 'devalue'

import {
	e2eOciManifest,
	e2eOciManifestIdentity,
} from '../../../../../tests/e2e/$e2eOciRegistryFixture.ts'


const remoteResult = async (
	route: Route,
	remoteId: string,
	payload: string | null,
	result: unknown,
) => route.fulfill({
	contentType: 'application/json',
	json: {
		type: 'result',
		data: stringify({
			_: result,
			q: {
				[`${remoteId}/${payload ?? ''}`]: {
					v: result,
				},
			},
		}),
	},
})

const installOciRemoteFixture = async (page: Page) => {
	await page.route('**/_app/remote/**', async (route) => {
		const url = new URL(route.request().url())
		const payload = url.searchParams.get('payload')
		const remoteId = url.pathname.split('/_app/remote/')[1] ?? ''

		if (remoteId.endsWith('/getManifestRemote')) {
			await remoteResult(route, remoteId, payload, e2eOciManifest)
			return
		}

		if (remoteId.endsWith('/getReferrersRemote')) {
			await remoteResult(route, remoteId, payload, [])
			return
		}

		await route.continue()
	})
}


test.beforeEach(async ({ page }, testInfo) => {
	testInfo.setTimeout(180_000)
	await page.addInitScript(({ name, schemaVersion }) => {
		window.__blockheadClientProbeEnabled = true
		window.__blockheadWaSqliteDatabaseNameOverride = name
		window.__blockheadWaSqliteVfsNameOverride = name.replace(/[^a-zA-Z0-9_-]/g, '_')
		window.__blockheadPersistedCollectionSchemaVersionOverride = schemaVersion
	}, {
		name: `bh-oci-manifest-${testInfo.workerIndex}-${testInfo.retry}-${Date.now()}.sqlite`,
		schemaVersion: Date.now(),
	})
})


test('follows the Prometheus OCI manifest to a visible child descriptor', async ({ page }) => {
	await installOciRemoteFixture(page)
	await page.goto(`/oci/registry/${e2eOciManifestIdentity.registry}/repository/${encodeURIComponent(e2eOciManifestIdentity.repository)}/manifest/${e2eOciManifestIdentity.reference}`, {
		waitUntil: 'domcontentloaded',
	})
	await expect(page.getByText(e2eOciManifestIdentity.repository, { exact: true })).toBeVisible()
	await expect(page.getByRole('definition').filter({ hasText: e2eOciManifestIdentity.reference })).toBeVisible()

	const descriptorLink = page.getByRole('link', { name: 'manifest', exact: true })
	await expect(descriptorLink).toBeVisible()
	await descriptorLink.click()

	await expect(page).toHaveURL(/\/descriptor\/manifest\/0$/)
	await expect(page.getByText(e2eOciManifest.manifests[0].mediaType, { exact: true })).toBeVisible()
	await expect(page.getByRole('definition').filter({ hasText: e2eOciManifest.manifests[0].digest })).toBeVisible()
	await expect(page.getByRole('definition').filter({ hasText: /^4,?242$/ })).toBeVisible()
})
