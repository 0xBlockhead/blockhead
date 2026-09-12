import type { Page } from 'playwright'
import { join } from 'node:path'

export const measureRealLayout = async (page: Page) => page.evaluate(() => {
	const internal = [...document.querySelectorAll<HTMLElement>('#main, #main [data-scroll-container]')].map(element => {
		const style = getComputedStyle(element)
		const horizontal = Math.max(0, element.scrollWidth - element.clientWidth)
		const vertical = Math.max(0, element.scrollHeight - element.clientHeight)
		return {
			horizontal,
			clippedX: ['hidden', 'clip'].includes(style.overflowX) ? horizontal : 0,
			clippedY: ['hidden', 'clip'].includes(style.overflowY) ? vertical : 0,
		}
	})
	return {
		contentHeight: Math.ceil(document.querySelector('#main')?.getBoundingClientRect().height ?? 0),
		overflow: {
			pageX: Math.max(0, document.documentElement.scrollWidth - innerWidth, document.body.scrollWidth - innerWidth),
			pageY: Math.max(0, document.documentElement.scrollHeight - innerHeight, document.body.scrollHeight - innerHeight),
			carouselX: Math.max(0, ...internal.map(item => item.horizontal)),
			clippedInternalX: Math.max(0, ...internal.map(item => item.clippedX)),
			clippedInternalY: Math.max(0, ...internal.map(item => item.clippedY)),
		},
	}
})

/** Capture actual scroll viewports without changing styles, dimensions, or data. */
export const captureInternalScrollEvidence = async (page: Page, outputDirectory: string, image: string) => {
	const containers = await page.locator('#main, #main [data-scroll-container]').elementHandles()
	const states = await Promise.all(containers.map(container => container.evaluate(element => ({ top: element.scrollTop, left: element.scrollLeft }))))
	const windowState = await page.evaluate(() => ({ x: scrollX, y: scrollY }))
	const evidence: string[] = []
	try {
		for (const [index, container] of containers.entries()) {
			const size = await container.evaluate(element => ({
				x: Math.max(0, element.scrollWidth - element.clientWidth),
				y: Math.max(0, element.scrollHeight - element.clientHeight),
				width: element.clientWidth,
				height: element.clientHeight,
			}))
			if ((!size.x && !size.y) || !size.width || !size.height)
				continue
			await container.scrollIntoViewIfNeeded()
			const positions = (maximum: number, step: number) => [...new Set([
				...Array.from({ length: Math.ceil(maximum / step) }, (_, position) => position * step), maximum,
			])]
			const xs = positions(size.x, size.width)
			const ys = positions(size.y, size.height)
			if (xs.length * ys.length > 100)
				throw new Error(`scroll evidence exceeds 100 viewports for container ${index}; coverage is incomplete`)
			for (const [row, y] of ys.entries())
				for (const [column, x] of xs.entries()) {
					await container.evaluate((element, position) => element.scrollTo({ left: position.x, top: position.y, behavior: 'instant' }), { x, y })
					await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
					const evidenceImage = image.replace(/\.png$/u, `-scroll-${index}-${row}-${column}.png`)
					await page.screenshot({ path: join(outputDirectory, evidenceImage), fullPage: false, animations: 'disabled' })
					evidence.push(evidenceImage)
				}
		}
	} finally {
		for (let index = containers.length - 1; index >= 0; index--)
			await containers[index].evaluate((element, state) => element.scrollTo({ left: state.left, top: state.top, behavior: 'instant' }), states[index])
		await page.evaluate(state => scrollTo({ left: state.x, top: state.y, behavior: 'instant' }), windowState)
	}
	return evidence
}
