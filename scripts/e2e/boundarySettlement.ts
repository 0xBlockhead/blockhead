export type BoundarySettlementSnapshot = {
	loading: number
	failed: number
	empty: boolean
	reason: string
}

export type BoundaryProbePage = {
	addInitScript: (script: () => void) => Promise<void>
	evaluate: <T>(script: () => T) => Promise<T>
}

export const installBoundaryProbe = (page: BoundaryProbePage) => page.addInitScript(() => {
	const events: unknown[] = []
	const active = new Map<Element, { id: string }>()
	let nextId = 0
	const sync = (element: Element) => {
		const loading = element.matches('.loading, [aria-busy="true"]')
		const failed = element.matches('[data-error], [role="alert"], [data-tag].inline-placeholder:not([aria-busy="true"])')
		if (loading && !active.has(element)) {
			const row = { id: String(++nextId) }
			active.set(element, row)
			events.push({ kind: 'dom-loading', id: row.id, at: Date.now() })
		}
		else if (!loading && active.has(element)) {
			events.push({ kind: 'dom-resolved', id: active.get(element)?.id ?? null, at: Date.now() })
			active.delete(element)
		}
		if (failed) events.push({ kind: 'dom-failed', id: null, at: Date.now() })
		window.__blockheadBoundaryProbeActive = [...active.values()]
	}
	window.__blockheadBoundaryProbe = events as never[]
	window.__blockheadBoundaryProbeActive = []
	const attach = () => {
		const main = document.querySelector('#main')
		if (main == null) return false
		const observer = new MutationObserver((records) => {
			for (const record of records) {
				if (record.target instanceof Element) sync(record.target)
				for (const node of record.addedNodes)
					if (node instanceof Element) sync(node)
			}
		})
		observer.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-error', 'aria-busy', 'class'] })
		for (const element of main.querySelectorAll('[data-error], [role="alert"], [data-tag].inline-placeholder, .loading, [aria-busy="true"]')) sync(element)
		return true
	}
	if (!attach()) {
		const observer = new MutationObserver(() => { if (attach()) observer.disconnect() })
		observer.observe(document, { childList: true, subtree: true })
	}
})

export const snapshotBoundary = (page: { evaluate: BoundaryProbePage['evaluate'] }) => page.evaluate(() => {
	const main = document.querySelector('#main')
	const failed = main == null ? 0 : main.querySelectorAll('[data-error], [role="alert"], [data-tag].inline-placeholder:not([aria-busy="true"])').length
	const loading = main == null ? 0 : main.querySelectorAll('.loading, [aria-busy="true"]').length
	const active = globalThis.__blockheadBoundaryProbeActive?.length ?? 0
	const text = main?.textContent?.replace(/\s+/g, ' ').trim() ?? ''
	return { loading: Math.max(loading, active), failed, empty: main == null || text.length === 0, reason: main == null ? 'no-#main' : text.length === 0 ? '#main-empty' : failed > 0 ? '#main-boundary-error' : loading > 0 || active > 0 ? '#main-still-loading' : '#main-ready' }
})

export type BoundarySettlementProbe = {
	snapshot: () => Promise<BoundarySettlementSnapshot & Record<string, unknown>>
	events: () => Promise<number>
	semantic?: () => Promise<{ ready: boolean, signature: string, unmet?: string[] }>
	wait: (milliseconds: number) => Promise<void>
	isClosed?: () => boolean
	probeTimeoutMs?: number
}

export const waitForBoundarySettlement = async (
	probe: BoundarySettlementProbe,
	{
		timeoutMs,
		quietMs,
	}: { timeoutMs: number, quietMs: number }
) => {
	const deadline = Date.now() + timeoutMs
	let lastSignature = ''
	let quietSince = Date.now()
	let last: BoundarySettlementSnapshot & Record<string, unknown> = { loading: 0, failed: 0, empty: true, reason: 'bootstrap-shell' }
	let lastSemantic = { ready: true, signature: '' } as { ready: boolean, signature: string, unmet?: string[] }

	while (Date.now() < deadline) {
		const timeout = probe.probeTimeoutMs ?? 20_000
		const withTimeout = <T>(promise: Promise<T>) => Promise.race([promise, new Promise<never>((_, reject) => setTimeout(() => reject(new Error('probe timed out')), timeout))])
		try { last = await withTimeout(probe.snapshot()) }
		catch { last = { ...last, empty: true, reason: probe.isClosed?.() ? 'page-closed' : 'probe-evaluate-timeout' } }
		const events = await withTimeout(probe.events()).catch(() => -1)
		const semantic = await (probe.semantic == null ? Promise.resolve({ ready: true, signature: '' }) : withTimeout(probe.semantic())).catch(() => ({ ready: false, signature: 'semantic-probe-timeout', unmet: ['semantic-probe-timeout'] }))
		lastSemantic = semantic
		const signature = JSON.stringify({ loading: last.loading, failed: last.failed, events, semantics: semantic.signature })
		if (signature === lastSignature && last.loading === 0 && semantic.ready) {
			if (Date.now() - quietSince >= quietMs)
				return { ...last, settled: true, semantic }
		}
		else {
			lastSignature = signature
			quietSince = Date.now()
		}
		await probe.wait(250)
	}
	return { ...last, settled: false, semantic: lastSemantic }
}
