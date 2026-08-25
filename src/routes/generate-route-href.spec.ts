import { describe, expect, it } from 'vitest'

import { e2eRouteFixtureMetadataByNodeId } from '../../tests/e2e/_generatedRouteFixtureMetadata.ts'
import { publicRouteIdFromRouteId } from '../../tests/e2e/_routeDiscovery.ts'


describe('generated route href contracts', () => {
	it('strips compiler-only route groups and matchers from public paths', () => {
		const publicPaths = Object.values(e2eRouteFixtureMetadataByNodeId).map(({ routeId }) => (
			publicRouteIdFromRouteId(routeId)
		))

		expect(publicPaths).toContain('/network/[network]')
		expect(publicPaths.some((publicPath) => /=|[()]/.test(publicPath))).toBe(false)
	})

	it('preserves every selector mapping on shared block and transaction routes', () => {
		expect(e2eRouteFixtureMetadataByNodeId[
			'/(explore)/(networks)/network/[network]/(blocks)/block/[blockNumber]'
		].mappings.map(({ id }) => id)).toEqual(expect.arrayContaining([
			'EvmBlock.EvmNetworkBlockNumber',
			'SolanaBlock.Slot',
			'UtxoBlock.NetworkHeight',
			'PolkadotBlock.NetworkBlockNumber',
		]))
		expect(e2eRouteFixtureMetadataByNodeId[
			'/(explore)/(networks)/network/[network]/(transactions)/tx/[transactionId]'
		].mappings.map(({ id }) => id)).toEqual(expect.arrayContaining([
			'EvmTransaction.EvmNetworkTxHash',
			'SolanaTransaction.NetworkSignature',
			'UtxoTransaction.NetworkTxId',
		]))
	})
})
