#!/usr/bin/env node
/**
 * Temporary em02 ledger classifier — inventory APP.ts entities and propose outcomes.
 */
import fs from 'node:fs'

const text = fs.readFileSync('APP.ts', 'utf8')

const entitiesStart = text.indexOf('\t\tentities: [')
if (entitiesStart < 0) throw new Error('entities array not found')
const routesStart = text.indexOf('\n\troutes: {', entitiesStart)
const entitiesBlock = text.slice(entitiesStart, routesStart > 0 ? routesStart : undefined)

const entityStarts = [...entitiesBlock.matchAll(/\{\s*\n\t\t\t\tentityType: EntityType\.([A-Za-z_][A-Za-z0-9_]*),\s*\n\t\t\t\tlabels:/g)]

const entities = []
for (let i = 0; i < entityStarts.length; i++) {
	const name = entityStarts[i][1]
	const start = entityStarts[i].index
	const end = i + 1 < entityStarts.length ? entityStarts[i + 1].index : entitiesBlock.length
	const body = entitiesBlock.slice(start, end)

	const fieldsMatch = body.match(/fields:\s*\[([\s\S]*?)\]\s*,\s*\n\t\t\t\tviews:/)
	const fieldsBody = fieldsMatch?.[1] ?? ''

	// Split field objects roughly by `{ name:` / `{ name:`
	const fieldChunks = fieldsBody.split(/\{\s*\n?\s*(?:name:)/).slice(1)
	const manyEntityFields = []
	const manyPrimitiveFields = []
	for (const chunk of fieldChunks) {
		const nameMatch = chunk.match(/^\s*['"]([^'"]+)['"]/)
		const fieldName = nameMatch?.[1]
		if (!fieldName) continue
		const isMany = /cardinality:\s*EntityFieldCardinality\.Many/.test(chunk)
		if (!isMany) continue
		if (/type:\s*EntityFieldType\.EntitiesReference/.test(chunk))
			manyEntityFields.push(fieldName)
		else if (/type:\s*EntityFieldType\.Primitive/.test(chunk))
			manyPrimitiveFields.push(fieldName)
		else
			manyEntityFields.push(fieldName) // treat other Many as remodel-relevant
	}

	const viewsIdx = body.indexOf('views:')
	const viewsBody = viewsIdx >= 0 ? body.slice(viewsIdx) : ''
	const hasCarousels = /\bcarousels:\s*\[/.test(viewsBody)
	let carouselCount = 0
	if (hasCarousels) {
		const cm = viewsBody.match(/carousels:\s*\[([\s\S]*?)\]/)
		carouselCount = cm ? Math.max([...cm[1].matchAll(/label:/g)].length, 1) : 1
	}

	entities.push({
		name,
		manyFields: manyEntityFields.length,
		manyFieldNames: manyEntityFields,
		manyPrimitiveFields,
		hasCarousels,
		carouselCount,
	})
}

const doneRemodeled = new Set([
	'AvailNetwork', 'BittensorNetwork', 'BnbBeaconNetwork', 'CelestiaNetwork',
	'DydxChainNetwork', 'KaspaNetwork', 'LightningNetwork', 'NearNetwork',
	'ZeroGNetwork', 'TronNetwork', 'HyperliquidNetwork',
	'_GlobalActivityPubNetwork', '_GlobalFarcasterNetwork', '_GlobalLensNetwork',
	'_GlobalRedditNetwork', '_GlobalRssNetwork', '_GlobalXNetwork', '_GlobalYoutubeNetwork',
	'FarcasterNetwork', 'LensNetwork',
	'AlgorandAccount', 'AptosAccount', 'AvalancheSubnet', 'EnsName',
	'FarcasterUser', 'FarcasterChannel', 'GitRepository',
	'_GlobalNostrNetwork', '_GlobalAgentNetwork', '_GlobalAiModelCatalog',
	'_GlobalArweaveNetwork', '_GlobalEvmAbiCatalog',
	'EigenLayerProtocol', 'EigenLayerAvs', 'EigenLayerOperator', 'EigenLayerStrategy',
	'BitTorrentMetainfo', 'BeaconSlot', 'A2aTask', 'McpServer', 'RegulatedAssetProfile',
	'BlockheadCashuWalletState', 'BlockheadLightningNodeState', 'BlockheadRadicleNodeState',
	'BlockheadSessionAction', 'BlockheadMoneroWalletState', 'BlockheadQuilibriumNodeState',
	'BlockheadSession', 'BlockheadZcashWalletState', 'BlockheadZeroGStorageNodeState',
	'BlockheadStateChannel', 'AlgorandApplication', 'DydxChainSubaccount',
	'KaspaAddress', 'KaspaTransaction', 'AptosTransaction',
])

const em01Done = new Set([
	'CardanoNetwork', 'HederaNetwork', 'IcpNetwork', 'StarknetNetwork',
	'SuiNetwork', 'TonNetwork', 'TezosNetwork', 'StellarNetwork',
	'XrplNetwork', 'AlgorandNetwork', 'AptosNetwork', 'ArweaveNetwork',
])

const isolated = new Set([
	'Network', 'Account', 'AssetInstance', 'Url', 'Media',
])

const outcomes = []
for (const e of entities) {
	if (doneRemodeled.has(e.name)) {
		outcomes.push({ ...e, outcome: 'done', reason: 'em02 remodeled (batches 1–5)' })
		continue
	}
	if (em01Done.has(e.name)) {
		outcomes.push({ ...e, outcome: 'done', reason: 'em01 first-12 network modeling pass' })
		continue
	}
	if (isolated.has(e.name)) {
		outcomes.push({
			...e,
			outcome: 'blocked-with-specific-gap',
			reason: 'isolated high-traffic shared entity — defer until dedicated isolated pass',
		})
		continue
	}

	if (
		e.name.endsWith('_Timestamp')
		|| e.name.endsWith('_Snapshot')
		|| e.name.endsWith('_Round')
		|| e.name.endsWith('_LedgerCoordinate')
	) {
		outcomes.push({
			...e,
			outcome: 'unchanged-with-reason',
			reason: 'timestamp/observation/snapshot row — sparse singular view is correct; no carousel remodel',
		})
		continue
	}

	if (e.manyFields <= 2) {
		outcomes.push({
			...e,
			outcome: 'unchanged-with-reason',
			reason: `sparse entity (≤2 EntitiesReference many-fields: ${e.manyFields}${e.manyFieldNames.length ? `; ${e.manyFieldNames.join(', ')}` : ''}); singular view already accurate without carousel remodel`,
		})
		continue
	}

	if (e.hasCarousels && e.carouselCount >= 2) {
		outcomes.push({
			...e,
			outcome: 'unchanged-with-reason',
			reason: `already has singular carousels (${e.carouselCount}); organization looks domain-shaped from prior passes`,
		})
		continue
	}

	outcomes.push({
		...e,
		outcome: 'remaining',
		reason: `candidate remodel: ${e.manyFields} many-entity-fields [${e.manyFieldNames.join(', ')}], carousels=${e.hasCarousels ? e.carouselCount : 0}`,
	})
}

const counts = Object.fromEntries(
	['done', 'unchanged-with-reason', 'blocked-with-specific-gap', 'remaining'].map((k) => [
		k,
		outcomes.filter((o) => o.outcome === k).length,
	]),
)

const remaining = outcomes
	.filter((o) => o.outcome === 'remaining')
	.sort((a, b) => b.manyFields - a.manyFields || a.name.localeCompare(b.name))

const unchanged = outcomes.filter((o) => o.outcome === 'unchanged-with-reason')
const blocked = outcomes.filter((o) => o.outcome === 'blocked-with-specific-gap')
const done = outcomes.filter((o) => o.outcome === 'done')

const prefix = (name) => {
	const buckets = [
		'Evm', 'Bitcoin', 'Solana', 'Cosmos', 'Polkadot', 'Filecoin', 'Ipfs', 'Swarm',
		'Nostr', 'ActivityPub', 'Atproto', 'Farcaster', 'Lens', 'Reddit', 'Youtube', 'Rss',
		'Ai', 'A2a', 'Acp', 'Mcp', 'Agent', 'EigenLayer', 'Beacon', 'Bridge', 'Market',
		'Liquidity', 'Coin', 'Currency', 'Nft', 'Token', 'Blockhead', 'Git', 'Radicle',
		'Lightning', 'Cashu', 'Monero', 'Zcash', 'Quilibrium', 'ZeroG', 'Arweave',
		'Algorand', 'Aptos', 'Avalanche', 'Cardano', 'Hedera', 'Icp', 'Starknet', 'Sui',
		'Ton', 'Tezos', 'Stellar', 'Xrpl', 'Near', 'Tron', 'Kaspa', 'Dydx', 'Hyperliquid',
		'Bittensor', 'Celestia', 'Avail', 'Bnb', 'Specification', 'Proposal', 'Ens',
		'Utxo', 'Move', 'Soroban', 'Litecoin', 'Cctp', 'Erc', 'Magnet',
	]
	if (name.startsWith('_Global')) return '_Global'
	for (const b of buckets) {
		if (name === b || name.startsWith(b)) return b
	}
	return 'Other'
}

const remainingByBucket = Map.groupBy(remaining, (e) => prefix(e.name))
const bucketSummary = [...remainingByBucket.entries()]
	.map(([k, list]) => ({
		bucket: k,
		count: list.length,
		names: list.map((e) => e.name),
		detail: list.map((e) => `${e.name}(${e.manyFields}: ${e.manyFieldNames.join('|')})`),
	}))
	.sort((a, b) => b.count - a.count)

const out = {
	entitiesInventoried: entities.length,
	counts,
	doneNames: done.map((d) => d.name).sort(),
	blocked: blocked.map((b) => ({ name: b.name, reason: b.reason, manyFields: b.manyFields, manyFieldNames: b.manyFieldNames })),
	remainingByBucket: bucketSummary,
	remainingAll: remaining.map((e) => ({
		name: e.name,
		manyFields: e.manyFields,
		manyFieldNames: e.manyFieldNames,
		hasCarousels: e.hasCarousels,
		carouselCount: e.carouselCount,
	})),
	unchangedByReason: Object.fromEntries(
		Object.entries(
			Object.groupBy(unchanged, (u) => (
				u.reason.startsWith('timestamp') ? 'timestamp-row'
				: u.reason.startsWith('sparse') ? 'sparse-le2'
				: u.reason.startsWith('already has') ? 'already-carousels'
				: 'other'
			)),
		).map(([k, list]) => [k, { count: list.length, sample: list.slice(0, 12).map((x) => x.name) }]),
	),
	unchangedAll: unchanged.map((u) => ({
		name: u.name,
		reason: u.reason,
		manyFields: u.manyFields,
		manyFieldNames: u.manyFieldNames,
	})),
}

fs.writeFileSync('_em02_classify_out.json', JSON.stringify(out, null, '\t') + '\n')
console.log(JSON.stringify({
	entitiesInventoried: out.entitiesInventoried,
	counts: out.counts,
	sum: Object.values(out.counts).reduce((a, b) => a + b, 0),
	unchangedByReason: out.unchangedByReason,
	blocked: out.blocked,
	topRemainingBuckets: bucketSummary,
	remainingAll: out.remainingAll,
}, null, '\t'))
