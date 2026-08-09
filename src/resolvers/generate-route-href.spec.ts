import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'
import { e2eRouteFixtureMetadataByNodeId } from '../../tests/e2e/_generatedRouteFixtureMetadata.ts'
import { publicRouteIdFromRouteId } from '../../tests/e2e/_routeDiscovery.ts'

const generatedRouteFixtureMetadata = readFileSync(join(process.cwd(), 'tests/e2e/_generatedRouteFixtureMetadata.ts'), 'utf8')
const networkSchema = readFileSync(join(process.cwd(), 'src/schema/Network.ts'), 'utf8')
const solanaInstructionView = readFileSync(join(process.cwd(), 'src/views/SolanaInstructionView.svelte'), 'utf8')
const assetsRoute = readFileSync(join(process.cwd(), 'src/routes/assets/+page.svelte'), 'utf8')
const sessionRoute = readFileSync(join(process.cwd(), 'src/routes/~/session/[sessionId=stringSegment]/+page.svelte'), 'utf8')

describe('generated route href contracts', () => {
	it('strips compiler-only route groups from public view hrefs', () => {
		const publicPaths = Object.values(e2eRouteFixtureMetadataByNodeId).map(({ routeId }) => publicRouteIdFromRouteId(routeId))
		const networkFacetSegments = new Set(
			[...networkSchema.matchAll(/^\t\t([A-Za-z0-9]+): facet\(/gm)]
				.flatMap((match) => [
					match[1].toLowerCase(),
					match[1]
						.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
						.toLowerCase(),
				])
		)
		expect(generatedRouteFixtureMetadata).toMatch(/'\/\(explore\)\/\(networks\)\/network\/\[network\]': \{/)
		expect(publicPaths).toContain('/network/[network]')
		expect(publicPaths.some((publicPath) => /=/.test(publicPath))).toBe(false)
		expect(publicPaths.some((publicPath) => /[()]/.test(publicPath))).toBe(false)
		expect([...networkFacetSegments]).toEqual(expect.arrayContaining([
			'evm',
			'cosmos',
			'polkadot',
			'solana',
			'utxo',
			'cashtokens',
			'cash-tokens',
			'zcash',
			'zerog',
			'zero-g',
		]))
		expect(publicPaths.some((publicPath) => {
			const segments = publicPath.split('/').filter(Boolean)
			const networkIndex = segments.indexOf('network')
			return (
				networkIndex !== -1
				&& segments.slice(networkIndex + 2).some((segment) => networkFacetSegments.has(segment))
			)
		})).toBe(false)
	})

	it('preserves every selector mapping on shared physical routes', () => {
		const sharedBlockRoute = generatedRouteFixtureMetadata.match(
			/'\/\(explore\)\/\(networks\)\/network\/\[network\]\/\(blocks\)\/block\/\[blockNumber\]': \{[\s\S]*?(?=\n\t'\/)/
		)?.[0]
		const sharedTransactionRoute = generatedRouteFixtureMetadata.match(
			/'\/\(explore\)\/\(networks\)\/network\/\[network\]\/\(transactions\)\/tx\/\[transactionId\]': \{[\s\S]*?(?=\n\t'\/)/
		)?.[0]
		expect(sharedBlockRoute).toBeDefined()
		expect(sharedBlockRoute).toMatch(/id: 'SolanaBlock\.Slot'/)
		expect(sharedBlockRoute).toMatch(/id: 'UtxoBlock\.NetworkHeight'/)
		expect(sharedBlockRoute).toMatch(/id: 'PolkadotBlock\.NetworkBlockNumber'/)
		expect(generatedRouteFixtureMetadata).not.toMatch(/(?:evmBlockNumber|cosmosBlockHeight|utxoBlockHeight|polkadotBlockNumber)/)
		expect(sharedTransactionRoute).toBeDefined()
		expect(sharedTransactionRoute).toMatch(/id: 'EvmTransaction\.EvmNetworkTxHash'[\s\S]*?id: 'SolanaTransaction\.NetworkSignature'[\s\S]*?id: 'UtxoTransaction\.NetworkTxId'/)
		expect(sharedTransactionRoute).not.toMatch(/\/(?:\[signature\]|\[txId\])/)
	})

	it('guards branch-specific route coordinates and falls back to no href', () => {
		expect(solanaInstructionView).toMatch(
			/selection\.entitySelector\.instructionKind === 'Instruction'[\s\S]*?resolve\([\s\S]*?'\/\(explore\)\/\(networks\)\/network\/\[network=networkCaip2OrNetworkSlug\]\/\(network\)\/\(transactions\)\/tx\/\[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment\]\/\(selection\)\/instruction\/\[instructionKind=stringSegment\]\/\[indexInTransaction=nonNegativeInteger\]'/
		)
		expect(solanaInstructionView).toMatch(
			/selection\.entitySelector\.instructionKind === 'InnerInstruction'[\s\S]*?'indexInInstruction' in selection\.entitySelector[\s\S]*?\/inner\/\[indexInInstruction=nonNegativeInteger\]'[\s\S]*?indexInInstruction: String\(selection\.entitySelector\.indexInInstruction\)/
		)
		expect(solanaInstructionView).toMatch(/indexInInstruction: String\(selection\.entitySelector\.indexInInstruction\)[\s\S]*?:\s*undefined/)
		expect(solanaInstructionView).not.toMatch(/resolve\(`/)
	})

	it('keeps generated page titles in the public format for collection and entity routes', () => {
		expect(assetsRoute).toMatch(/<title>Assets • Blockhead<\/title>/)
		expect(sessionRoute).not.toMatch(/\bpageEntity\b/)
		expect(sessionRoute).toMatch(/<title>\{pageSelection\.entity == null \?[\s\S]*?pageSelection\.entitySelector\.id[\s\S]*?pageSelection\.entity\.name[\s\S]*?\} • session • Blockhead<\/title>/)
	})

})
