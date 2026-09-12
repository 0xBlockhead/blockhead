import assert from 'node:assert/strict'
import { mkdtemp, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { chromium } from 'playwright'
import { captureInternalScrollEvidence, measureRealLayout } from './realLayoutCapture.ts'

test('real DOM captures preserve layout and scroll state while detecting hidden overflow', async () => {
	const directory = await mkdtemp(join(tmpdir(), 'blockhead-scroll-proof-'))
	const browser = await chromium.launch()
	try {
		const page = await browser.newPage({ viewport: { width: 800, height: 500 }, reducedMotion: 'reduce' })
		await page.setContent(`
			<style>
				body { margin: 0 }
				#main { width: 760px; height: 460px; overflow: auto }
				#spacer { height: 600px }
				#pane, #hidden { width: 300px; height: 50px }
				#pane { overflow: auto }
				#hidden { overflow: hidden }
				#pane > div, #hidden > div { width: 900px; height: 100px; background: linear-gradient(to right, red, blue) }
			</style>
			<main id="main"><div id="spacer">Root scroll content</div><section id="pane" data-scroll-container><div>Reachable content</div></section><section id="hidden" data-scroll-container><div>Clipped content</div></section></main>
		`)
		const snapshot = () => page.evaluate(() => ({
			styles: [...document.querySelectorAll('style')].map(style => style.textContent),
			states: [...document.querySelectorAll('#main, #main [data-scroll-container]')].map(element => ({ top: element.scrollTop, left: element.scrollLeft })),
			viewport: [innerWidth, innerHeight],
		}))
		await page.locator('#main').evaluate(element => { element.scrollTop = 30 })
		await page.locator('#pane').evaluate(element => { element.scrollLeft = 40 })
		const before = await snapshot()
		const measured = await measureRealLayout(page)
		assert.equal(measured.overflow.clippedInternalX, 600)
		assert.equal(measured.overflow.clippedInternalY, 50)
		await page.locator('#hidden').evaluate(element => element.remove())
		assert.equal((await measureRealLayout(page)).overflow.clippedInternalX, 0)
		const preserved = await snapshot()
		const images = await captureInternalScrollEvidence(page, directory, 'route.png')
		assert.ok(images.length >= 5, 'root and intermediate horizontal viewports must be captured')
		for (const image of images)
			assert.equal((await readFile(join(directory, image))).subarray(1, 4).toString(), 'PNG')
		assert.deepEqual(await snapshot(), preserved)
		assert.deepEqual((await snapshot()).styles, before.styles)
		await assert.rejects(captureInternalScrollEvidence(page, '/dev/null', 'route.png'))
		assert.deepEqual(await snapshot(), preserved, 'failed screenshot must also restore original scroll positions')
	} finally {
		await browser.close()
	}
})
