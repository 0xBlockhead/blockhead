import { expect, test } from '@playwright/test'

import {
	e2eOciManifest,
	e2eOciManifestIdentity,
} from '../../../../../tests/e2e/$e2eOciRegistryFixture.ts'


test('follows the Prometheus OCI manifest to a visible child descriptor', async ({ page }) => {
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
