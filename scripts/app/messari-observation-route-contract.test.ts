import assert from 'node:assert/strict'
import test from 'node:test'

import { app } from '../../APP.ts'
import { compileApp } from './generate.ts'
import { renderGeneratedFile } from './render.ts'

const generated = new Map(
	compileApp(app).generatedFiles.map((file) => [file.path, renderGeneratedFile(file)])
)

const observationViews = [
	'src/views/FinancialProtocol_Amm_EvmBlockView.svelte',
	'src/views/FinancialProtocol_Amm_EvmBlocksView.svelte',
	'src/views/LiquidityPool_Amm_EvmBlockView.svelte',
	'src/views/LiquidityPool_Amm_EvmBlocksView.svelte',
	'src/views/LiquidityPool_Amm_EvmBlock_InputAssetView.svelte',
	'src/views/LiquidityPool_Amm_EvmBlock_InputAssetsView.svelte',
]

test('Messari observation links delegate parameter encoding to SvelteKit resolve exactly once', () => {
	for (const path of observationViews) {
		const source = generated.get(path)
		assert.ok(source, `Missing generated observation view ${path}`)
		assert.doesNotMatch(source, /sourceRevision:\s*encodeURIComponent\(/)
		assert.match(source, /sourceRevision:\s*[\w.]+sourceRevision/)
	}
})

test('Messari observation block projections retain their source authority in nested rendering', () => {
	for (const path of [observationViews[0], observationViews[2]]) {
		const source = generated.get(path)
		assert.ok(source, `Missing generated observation view ${path}`)
		const selections = source.match(/Source\.TheGraph_Graphql/g) ?? []
		assert.equal(selections.length, path === observationViews[2] ? 6 : 5, `${path} must pin the observation, relationships, and nested block view`)
		assert.match(source, /\.\$block\(\{[\s\S]*?sources:\s*\[[\s\S]*?Source\.TheGraph_Graphql/)
		assert.match(source, /select\(EntityType\.EvmBlock, evmBlockSelector, \{[\s\S]*?Source\.TheGraph_Graphql/)
	}
})

test('Messari relationship lists enroll their native Graph producer', () => {
	const protocol = generated.get('src/views/FinancialProtocolView.svelte')
	const pool = generated.get('src/views/LiquidityPool_Amm_EvmBlockView.svelte')
	assert.ok(protocol)
	assert.ok(pool)
	assert.match(protocol, /ammBlocksResource = selection\s*\.\$\$ammBlocks\(\{[\s\S]*?Source\.TheGraph_Graphql/)
	assert.match(protocol, /liquidityPoolsResource = selection\s*\.\$\$liquidityPools\(\{[\s\S]*?Source\.TheGraph_Graphql/)
	assert.match(pool, /inputAssetsResource = selection\s*\.\$\$inputAssets\(\{[\s\S]*?Source\.TheGraph_Graphql/)
})
