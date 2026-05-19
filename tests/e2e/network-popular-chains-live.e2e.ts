import { test } from '@playwright/test'

import { publicJsonRpcHttpUrlForChainE2e } from '../_e2eBrowserHelpers.ts'

import { runNetworkViewLiveE2E, type NetworkViewLiveE2EChain } from './_networkViewLiveE2e.ts'

/**
 * Live network page: Ethereum only in CI — several default “public” L2 HTTPS RPCs reject browser `fetch`/JSON-RPC (415) while Playwright-driven runs still converge on them.
 * Re-expand (Base / Arbitrum / Optimism / …) with pinned URLs or stubs when reliably green.
 */
const popularChains: readonly NetworkViewLiveE2EChain[] = [
	{ chainId: 1, label: 'Ethereum', enforceBasescanNotViaApiProxy: false },
] as const

test.describe('Popular chains: network view live (head + block stream + carousels)', () => {
	for (const chain of popularChains) {
		test(`(browser) /network/${String(chain.chainId)} ${chain.label}: live view`, async ({
			page,
		}, testInfo) => {
			test.setTimeout(400_000)
			const rpc = await publicJsonRpcHttpUrlForChainE2e(chain.chainId)
			testInfo.annotations.push({
				type: 'chain',
				description: `${chain.label} (${String(chain.chainId)}) — ${rpc ?? 'no-rpc'}`,
			})
			await runNetworkViewLiveE2E(page, chain)
		})
	}
})
