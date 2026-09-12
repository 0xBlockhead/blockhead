/**
 * Representative visual-quality owner for route screenshots. The route matrix owns
 * exhaustive discovery and runtime boundaries; this suite owns screenshot-only
 * content, height, and overflow invariants for the curated representative corpus.
 * Run with `pnpm run test:e2e:screenshot-quality`.
 */
import { expect, test } from '@playwright/test'
import { entityDefinitionByType } from '$/schema/index.ts'

import {
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	resetBoundaryProbe,
	waitForBoundarySettle,
} from '../_e2eBrowserHelpers.ts'
import {
	routeScreenshotArtifactName,
	routeScreenshotCorpusFailures,
	routeScreenshotQuality,
	routeSelectorValuesFromPathname,
} from '../_routeScreenshotQuality.ts'
import { measureRealLayout, captureInternalScrollEvidence } from '../../scripts/e2e/screenshot-matrix/realLayoutCapture.ts'
import { createRouteRunIdentity } from '../../scripts/e2e/routeRunIdentity.ts'

import { e2eDomQualityProbeOverlays } from './_routeParamFixtures.ts'
import { e2eSocialScreenshotOverlays } from './_routeScreenshotFixtures.ts'


const settleTimeoutMs = 120_000
const routeRunIdentity = createRouteRunIdentity({
	repositoryDirectory: process.cwd(),
	browserIdentity: process.env.E2E_BROWSER_IDENTITY?.trim() || 'playwright',
	buildIdentity: process.env.E2E_BUILD_IDENTITY?.trim() || 'screenshot-quality',
	captureContractVersion: process.env.E2E_CAPTURE_CONTRACT_VERSION?.trim() || 'screenshot-quality-v1',
	classifierVersion: process.env.E2E_CLASSIFIER_VERSION?.trim() || 'route-screenshot-quality-v1',
	corpusVersion: process.env.E2E_CORPUS_VERSION?.trim() || 'representative-provider-overlays-v1',
})

test.skip(
	process.env.E2E_SCREENSHOT_QUALITY !== '1',
	'screenshot-quality routes are an explicit representative-provider run'
)

test.describe('representative route screenshot quality', () => {
	const overlays = { ...e2eDomQualityProbeOverlays, ...e2eSocialScreenshotOverlays }
	const corpus = Object.entries(overlays).map(([pathname, overlay]) => ({ pathname, overlay }))
	const corpusFailures = routeScreenshotCorpusFailures(corpus)
	test.beforeAll(() => {
		expect(corpusFailures, corpusFailures.join('\n')).toEqual([])
	})

	for (const [pathname, overlay] of Object.entries(overlays)) {
		test(pathname, async ({ page }, testInfo) => {
			await testInfo.attach('route-screenshot-quality-run.json', {
				body: JSON.stringify({ runIdentity: await routeRunIdentity, pathname }, null, 2),
				contentType: 'application/json',
			})
			testInfo.setTimeout(settleTimeoutMs + 60_000)
			await installBoundaryProbe(page)
			await installChainlistRpcsJsonStub(page)
			await page.setViewportSize({ width: 1440, height: 1000 })
			await resetBoundaryProbe(page)
			await page.goto(pathname, { waitUntil: 'domcontentloaded' })
			await page.locator('#main').waitFor({ state: 'visible', timeout: settleTimeoutMs })

			const settled = await waitForBoundarySettle(page, {
				timeoutMs: settleTimeoutMs,
				quietMs: 2_000,
			})
			const main = page.locator('#main')
			const mainText = (await main.innerText()).trim()
			const { contentHeight, overflow } = await measureRealLayout(page)
			const quality = routeScreenshotQuality({
				boundaryEvents: await getBoundaryProbeEvents(page),
				contentHeight,
				mainText,
				selectorValues: routeSelectorValuesFromPathname(pathname),
				visibleFieldValues: await main.locator('dd, [data-list-item]').allInnerTexts(),
				overflow,
				settled,
			})

			const screenshotName = routeScreenshotArtifactName(pathname, 'quality.png')
			const screenshotPath = testInfo.outputPath('route-screenshots', screenshotName)
			await page.screenshot({ animations: 'disabled', fullPage: false, path: screenshotPath })
			await testInfo.attach(screenshotName, {
				path: screenshotPath,
				contentType: 'image/png',
			})
			for (const image of await captureInternalScrollEvidence(page, testInfo.outputPath('route-screenshots'), screenshotName))
				await testInfo.attach(image, { path: testInfo.outputPath('route-screenshots', image), contentType: 'image/png' })
			if (quality.warnings.length > 0)
				await testInfo.attach('route-screenshot-warnings.txt', {
					body: quality.warnings.join('\n'),
					contentType: 'text/plain',
				})
			expect(quality.failures, quality.failures.join('\n')).toEqual([])

			for (const required of overlay.required ?? [])
				await expect(main, `missing ${JSON.stringify(required)}`).toContainText(required)
			for (const forbidden of overlay.forbidden ?? [])
				await expect(main, `found ${JSON.stringify(forbidden)}`).not.toContainText(forbidden)
			for (const requiredDt of overlay.requiredDt ?? [])
				await expect(main.locator('dt', { hasText: requiredDt })).toBeAttached()
			if (overlay.routeTitle)
				await expect(main.getByRole('heading', { name: overlay.routeTitle }).first()).toBeAttached()
			if (overlay.entityType)
				await expect(main.getByText(entityDefinitionByType[overlay.entityType].labels.singular, { exact: true }).first()).toBeAttached()
			if (overlay.minDt != null)
				expect(await main.locator('dt').count()).toBeGreaterThanOrEqual(overlay.minDt)
			if (overlay.minLinks != null)
				expect(await main.locator('a[href]').count()).toBeGreaterThanOrEqual(overlay.minLinks)
			if (overlay.minEntityRows != null)
				expect(await main.locator('[data-list-item]').count()).toBeGreaterThanOrEqual(overlay.minEntityRows)
		})
	}
})
