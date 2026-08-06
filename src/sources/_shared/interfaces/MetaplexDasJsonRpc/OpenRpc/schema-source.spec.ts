import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import type {
	DasAsset,
	GetAssetsByOwnerResult,
} from '$/sources/Helius/Das/types.ts'
import { schemaSource } from '$/sources/_shared/interfaces/MetaplexDasJsonRpc/OpenRpc/schema-source.ts'

const openRpcDir = dirname(fileURLToPath(import.meta.url))

describe('Metaplex DAS OpenRPC schema-source', () => {
	it('declares a checked-in OpenRPC document and generated typesFile', () => {
		expect(schemaSource.schemaUrl).toContain('digital-asset-standard-api')
		expect(schemaSource.schemaFile).toBe('./metaplex-das-api.json')
		expect(schemaSource.typesFile).toBe('./openrpc.d.ts')
		expect(readFileSync(resolve(openRpcDir, schemaSource.schemaFile), 'utf8')).toContain('"getAssetsByOwner"')
		expect(readFileSync(resolve(openRpcDir, schemaSource.typesFile), 'utf8')).toContain('AssetList:')
	})

	it('lets Helius DAS wire aliases satisfy generated Asset / AssetList', () => {
		const asset = {
			interface: 'V1_NFT',
			id: 'Asset111111111111111111111111111111111111111',
			content: {
				$schema: 'https://schema.metaplex.com/nft1.0.json',
				json_uri: 'ipfs://metadata',
				metadata: {
					name: 'Asset',
				},
			},
			mutable: true,
			burnt: false,
		} as const satisfies DasAsset

		const page = {
			total: 1,
			limit: 1,
			page: 1,
			items: [asset],
		} as const satisfies GetAssetsByOwnerResult

		expect(page.items[0]?.id).toBe(asset.id)
	})
})
