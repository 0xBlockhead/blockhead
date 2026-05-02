import { test } from '@playwright/test'

import { publicJsonRpcHttpUrlForChainE2e } from '../_e2eBrowserHelpers.ts'

import { runNetworkViewLiveE2E, type NetworkViewLiveE2EChain } from './_networkViewLiveE2e.ts'

/**
 * High-traffic L2s + Ethereum + BSC: `publicJsonRpcHttpUrlForChainE2e` (app-aligned) + retried preflight, then shared live flow in {@link runNetworkViewLiveE2E}.
 */
const popularChains: readonly NetworkViewLiveE2EChain[] = [
	{ chainId: 1, label: 'Ethereum', enforceBasescanNotViaApiProxy: false },
	{ chainId: 8453, label: 'Base', enforceBasescanNotViaApiProxy: true },
	{ chainId: 42161, label: 'Arbitrum One', enforceBasescanNotViaApiProxy: false },
	{ chainId: 10, label: 'Optimism', enforceBasescanNotViaApiProxy: false },
	{ chainId: 137, label: 'Polygon', enforceBasescanNotViaApiProxy: false },
	{ chainId: 56, label: 'BNB Chain', enforceBasescanNotViaApiProxy: false },
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
