/**
 * Representative visual-quality owner for route screenshots. The route matrix owns
 * exhaustive discovery and runtime boundaries; this suite owns screenshot-only
 * content, height, and overflow invariants for the curated representative corpus.
 * Run with `pnpm run test:e2e:screenshot-quality`.
 */
import { expect, test } from '@playwright/test'

import {
	getBoundaryProbeEvents,
	installBoundaryProbe,
	installChainlistRpcsJsonStub,
	resetBoundaryProbe,
	waitForBoundarySettle,
} from '../_e2eBrowserHelpers.ts'
import { routeScreenshotQuality } from '../_routeScreenshotQuality.ts'

import { e2eDomQualityProbeOverlays } from './_routeParamFixtures.ts'


const settleTimeoutMs = 120_000

test.skip(
	process.env.E2E_SCREENSHOT_QUALITY !== '1',
	'screenshot-quality routes are an explicit representative-provider run'
)

test.describe('representative route screenshot quality', () => {
	for (const [pathname, overlay] of Object.entries(e2eDomQualityProbeOverlays)) {
		test(pathname, async ({ page }, testInfo) => {
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
			await page.addStyleTag({ content: `
				html, body, #layout, #main, #main > .layout-main {
					block-size: max-content !important;
					max-block-size: none !important;
					overflow: visible !important;
				}
				#layout { grid-template-columns: minmax(0, 1fr) !important; }
				#layout > .layout-nav, #layout > .skip-link { display: none !important; }
				#main [data-scroll-container] {
					max-block-size: none !important;
					max-inline-size: none !important;
					overflow: visible !important;
				}
				#main [data-scroll-container~='layout-carousel'],
				#main [data-scroll-container~='layout-carousel']:not(:has(> [data-carousel-panes])),
				#main [data-carousel-panes] {
					inline-size: 100% !important;
					grid-auto-flow: row !important;
					grid-auto-columns: auto !important;
					grid-template-columns: repeat(auto-fit, minmax(min(var(--carousel-basis), 100%), 1fr)) !important;
				}
			` })
			await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
			const contentHeight = await page.evaluate(() => Math.ceil(Math.max(
				1,
				...Array.from(document.querySelectorAll<HTMLElement>('#main, #main *'))
					.map((element) => element.getBoundingClientRect().bottom + scrollY)
			)))
			expect(contentHeight, 'content bounds exceed capture limit').toBeLessThanOrEqual(32_767)
			await page.setViewportSize({ width: 1440, height: contentHeight })
			await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
			const overflow = await page.evaluate(() => {
				const documentElement = document.documentElement
				const body = document.body
				const carouselX = Math.max(0, ...Array.from(
					document.querySelectorAll<HTMLElement>("#main [data-scroll-container~='layout-carousel']")
				).map((element) => element.scrollWidth - element.clientWidth))
				return {
					carouselX,
					pageX: Math.max(documentElement.scrollWidth, body.scrollWidth) - innerWidth,
					pageY: Math.max(documentElement.scrollHeight, body.scrollHeight) - innerHeight,
				}
			})
			const quality = routeScreenshotQuality({
				boundaryEvents: await getBoundaryProbeEvents(page),
				contentHeight,
				mainText,
				overflow,
				settled,
			})

			if (quality.failures.length > 0)
				await testInfo.attach('route-screenshot.png', {
					body: await page.screenshot({ animations: 'disabled', fullPage: true }),
					contentType: 'image/png',
				})
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
				await expect(main.getByText(overlay.entityType, { exact: true }).first()).toBeAttached()
			if (overlay.minDt != null)
				expect(await main.locator('dt').count()).toBeGreaterThanOrEqual(overlay.minDt)
			if (overlay.minLinks != null)
				expect(await main.locator('a[href]').count()).toBeGreaterThanOrEqual(overlay.minLinks)
			if (overlay.minEntityRows != null)
				expect(await main.locator('[data-list-item]').count()).toBeGreaterThanOrEqual(overlay.minEntityRows)
		})
	}
})
