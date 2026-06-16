import type { Page, TestInfo } from '@playwright/test'


const envMs = (
	value: string | undefined,
	fallback: number
) => {
	const trimmed = value?.trim()
	if (!trimmed) return fallback
	const parsed = Number(trimmed)
	return Number.isFinite(parsed) ? parsed : fallback
}


/** Override via `E2E_*_MS` when cold SQLite/OPFS needs longer first paint than default smoke budgets. */
export const routeViewSmokeTimeoutsMs = {
	goto: envMs(process.env.E2E_GOTO_MS, 28_000),
	mainSelector: envMs(process.env.E2E_MAIN_MS, 72_000),
	test: envMs(process.env.E2E_TEST_MS, 92_000),
} as const


const RESOURCE_LOAD_SKIP_SUBSTRINGS = [
	'Failed to load resource',
	'net::ERR_',
] as const

const DEV_SERVER_TRANSIENT_SUBSTRINGS = [
	'[vite] Failed to reload',
	'Failed to fetch dynamically imported module',
] as const


const shouldIgnoreBrowserConsoleError = (text: string) => (
	RESOURCE_LOAD_SKIP_SUBSTRINGS.some((s) => (
		text.includes(s)
	))
	|| DEV_SERVER_TRANSIENT_SUBSTRINGS.some((s) => (
		text.includes(s)
	))
)


/**
 * Single `page.on('console')` / `page.on('pageerror')` wiring for route smoke tests:
 * append-only log for post-mortem attaches, plus fail-fast `step()` racing a gate on critical failures.
 */
export const setupRouteViewSmokePage = (page: Page) => {
	const lines: string[] = []
	let seq = 0
	let rejectErr: ((e: Error) => void) | undefined
	const gate = new Promise<never>((_, reject) => {
		rejectErr = reject
	})
	let gated = false
	const bump = (e: Error) => {
		if (gated) return
		gated = true
		rejectErr?.(e)
	}

	page.on('pageerror', (err) => {
		seq++
		lines.push(`${seq}\tpageerror\t${err.message}`)
		if (err.stack) lines.push(err.stack)
		if (!shouldIgnoreBrowserConsoleError(err.message))
			bump(new Error(`pageerror: ${err.message}`))
	})

	page.on('crash', () => {
		seq++
		lines.push(`${seq}\ttarget-crash\tBrowser tab crashed`)
		bump(new Error('Browser tab crashed'))
	})

	page.on('console', (msg) => {
		seq++
		const text = msg.text()
		lines.push(`${seq}\t${msg.type()}\t${text}`)
		if (
			msg.type() === 'error'
			&& !shouldIgnoreBrowserConsoleError(text)
		) {
			bump(new Error(`console.error: ${text}`))
		}
	})

	const step = async <T>(p: Promise<T>) => {
		return await Promise.race([p, gate])
	}

	const flushArtifacts = async (testInfo: TestInfo) => {
		await testInfo.attach('browser-console-tail.txt', {
			body: lines.slice(-250).join('\n'),
			contentType: 'text/plain',
		})
		let html = ''
		try {
			html = await page.content()
		}
		catch (e1) {
			html = `page.content failed: ${e1}`
			try {
				html += (
					`\n---\nouterHTML (evaluate):\n${await page.evaluate(() => (
						document.documentElement.outerHTML
					))}`
				)
			}
			catch (e2) {
				html += `\n---\nevaluate failed: ${e2}\npage.isClosed()=${page.isClosed()}`
			}
		}
		await testInfo.attach('page-snippet.html', {
			body: html.slice(0, 80_000),
			contentType: 'text/html',
		})
		let screenshotFilename = 'failure-screenshot.png'
		let screenshotContentType: 'image/png' | 'text/plain' = 'image/png'
		const screenshotBody = await page.screenshot({
			fullPage: true,
		}).catch((e) => {
			screenshotFilename = 'failure-screenshot-error.txt'
			screenshotContentType = 'text/plain'
			return Buffer.from(`screenshot failed: ${e}`, 'utf8')
		})
		await testInfo.attach(screenshotFilename, {
			body: screenshotBody,
			contentType: screenshotContentType,
		})
		const domHints = await page.evaluate(() => ({
			bodyChildren: document.body.childElementCount,
			hasLayout: !!document.querySelector('#layout'),
			hasMain: !!document.querySelector('#main'),
			readyState: document.readyState,
		})).catch((e) => ({
			bodyChildren: null,
			hasLayout: false,
			hasMain: false,
			readyState: `(evaluate failed: ${e})`,
		}))
		await testInfo.attach('failure-meta.txt', {
			body: (
				`url=${page.url()}\n`
				+ `viewport=${JSON.stringify(page.viewportSize())}\n`
				+ `dom=${JSON.stringify(domHints)}\n`
			),
			contentType: 'text/plain',
		})
	}

	return {
		step,
		flushArtifacts,
	}
}
