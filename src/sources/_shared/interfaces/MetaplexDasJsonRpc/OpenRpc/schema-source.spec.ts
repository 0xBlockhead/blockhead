import { describe, expect, it } from 'vitest'

import type {
	DasAsset,
	DasAssetProof,
	GetAssetsByOwnerResult,
} from '$/sources/Helius/Das/types.ts'

describe('Metaplex DAS OpenRPC schema-source', () => {
	it('lets Helius DAS wire aliases satisfy generated Asset / AssetList / AssetProof', () => {
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

		const proof = {
			leaf: 'Leaf111111111111111111111111111111111111111',
			node_index: 1,
			proof: ['Proof11111111111111111111111111111111111111'],
			root: 'Root111111111111111111111111111111111111111',
			tree_id: 'Tree111111111111111111111111111111111111111',
		} as const satisfies DasAssetProof

		expect(page.items[0].id).toBe(asset.id)
		expect(proof.tree_id).toContain('Tree')
	})
})
