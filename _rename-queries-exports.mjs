import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname)
const exports = fs.readFileSync('/tmp/queries-exports.txt', 'utf8').trim().split('\n')

const stripGetPrefix = (name, prefix) => (
	name.startsWith(`get${prefix}`) ?
		'get' + name.slice(`get${prefix}`.length)
	:
		null
)

const stripVerbPrefix = (name, verb, prefix) => {
	const full = verb + prefix
	return (
		name.startsWith(full) ?
			verb + name.slice(full.length)
		:
			null
	)
}

const lowerFirst = (s) => (
	s.charAt(0).toLowerCase() + s.slice(1)
)

function suggestRename(name) {
	// keep: etherscan account offset, JSON-RPC mirror names
	if (name === 'etherscanAccountListMaxOffset') return null
	if (/^proxyEth|^accountErc|^accountInternal|^accountToken|^gastracker/.test(name)) return null

	for (const p of ['fedi', 'mastodon', 'bskySocial', 'bsky', 'youtube', 'redditJson', 'reddit', 'piped', 'fxEmbed', 'rss2Json']) {
		if (name.startsWith(p)) {
			const rest = name.slice(p.length)
			if (/^Get/.test(rest)) return 'get' + rest.slice(3)
			if (/^List/.test(rest)) return 'list' + rest.slice(4)
			if (/^Search/.test(rest)) return 'search' + rest.slice(6)
		}
	}
	if (name.startsWith('rssGet')) return 'get' + name.slice('rssGet'.length)
	if (name.startsWith('rssList')) return 'list' + name.slice('rssList'.length)

	if (name.startsWith('xGet')) return 'get' + name.slice(4)
	if (name.startsWith('xList')) return 'list' + name.slice(5)
	if (name.startsWith('xSearch')) return 'search' + name.slice(7)

	for (const p of ['lens', 'hey']) {
		if (name.startsWith(p + 'Query')) return 'query' + name.slice(p.length + 5)
	}

	for (const prefix of [
		'Blockscout',
		'CoingeckoOpenApi',
		'Coingecko',
		'Coinpaprika',
		'CoinMarketCap',
		'Voltaire',
		'Sourcify',
		'Caips',
		'Ensips',
		'Blockchair',
		'BeaconchaIn',
		'Allium',
		'Amboss',
		'ZeroG',
		'Openchain',
		'Blobscan',
		'Dexscreener',
		'TradingView',
		'Snapchain',
		'Quilibrium',
		'Defillama',
		'LogosDocs',
	]) {
		const n = stripGetPrefix(name, prefix)
		if (n) return n
	}

	for (const [verb, prefix] of [
		['fetch', 'Coingecko'],
		['fetch', 'Eip8004Scan'],
		['fetch', 'Swarm'],
		['fetch', 'Ipfs'],
		['fetch', 'Superchain'],
		['fetch', 'ThreeXpl'],
		['fetch', 'GoEthereum'],
		['find', 'Coingecko'],
		['collect', 'CoingeckoOpenApi'],
		['collect', 'Coinpaprika'],
		['narrow', 'Voltaire'],
		['list', 'Quilibrium'],
	]) {
		const n = stripVerbPrefix(name, verb, prefix)
		if (n) return n
	}

	if (name.startsWith('streamBlockToVoltaire')) return 'streamBlockTo' + name.slice('streamBlockToVoltaire'.length)
	if (name.startsWith('uniqueBlockscout')) return 'unique' + name.slice('uniqueBlockscout'.length)
	if (name.startsWith('evmAddressFromBlockscout')) return 'evmAddressFrom' + name.slice('evmAddressFromBlockscout'.length)
	if (name.startsWith('blockscoutEth')) return lowerFirst(name.slice('blockscout'.length))
	if (name.startsWith('voltaire')) return lowerFirst(name.slice('voltaire'.length))

	for (const prefix of ['coinpaprika', 'coinMarketCap', 'defillama', 'sourcify', 'logosDocs']) {
		if (name.startsWith(prefix)) return lowerFirst(name.slice(prefix.length))
	}

	if (name.startsWith('swarm')) {
		const out = lowerFirst(name.slice('swarm'.length))
		return out === 'gatewayUrl' ? 'getGatewayUrl' : out
	}
	if (name.startsWith('normalizeSwarm')) return 'normalize' + name.slice('normalizeSwarm'.length)
	if (name.startsWith('parseSwarm')) return 'parse' + name.slice('parseSwarm'.length)
	if (name.startsWith('parseIpfs')) return 'parse' + name.slice('parseIpfs'.length)
	if (name.startsWith('ipfsGatewayUrl')) return 'getGatewayUrl'
	if (name.startsWith('ipfsNamespaceForTarget')) return 'getNamespaceForTarget'

	if (name.startsWith('getRecentVoltaire')) return 'getRecent' + name.slice('getRecentVoltaire'.length)
	if (name.startsWith('marketKindFromCoinpaprika')) return 'marketKindFrom' + name.slice('marketKindFromCoinpaprika'.length)
	if (name.startsWith('marketVenueIdFromCoinpaprika')) return 'marketVenueIdFrom' + name.slice('marketVenueIdFromCoinpaprika'.length)
	if (name.startsWith('marketEntityIdFromCoinpaprika')) return 'marketEntityIdFrom' + name.slice('marketEntityIdFromCoinpaprika'.length)

	if (name.startsWith('piped')) {
		const rest = name.slice('piped'.length)
		if (/^Get/.test(rest)) return 'get' + rest.slice(3)
		if (/^List/.test(rest)) return 'list' + rest.slice(4)
		return lowerFirst(rest)
	}

	if (name.startsWith('zgsGet')) return 'get' + name.slice('zgsGet'.length)
	if (name === 'zeroGMainnetRpcUrl' || name === 'bittensorMainnetRpcUrl') return 'mainnetRpcUrl'
	if (name === 'zeroGChainScanInfo') return 'chainScanInfo'

	if (name.endsWith('Blockscout')) return name.slice(0, -'Blockscout'.length)

	// Beacon REST (provider folder Beacon/Rest)
	if (name.startsWith('getBeacon')) return 'get' + name.slice('getBeacon'.length)
	if (name.startsWith('beacon') && name.endsWith('FromWire')) return lowerFirst(name.slice('beacon'.length))

	// MempoolSpace provider
	if (name.startsWith('getMempoolStats')) return 'getStats'
	if (name.startsWith('getMempoolTxids')) return 'getTxids'

	// Github/Rest generic client
	if (name === 'getGithubRestRepoContentsUrl') return 'getRestRepoContentsUrl'
	if (name === 'getGithubRawUserContentUrl') return 'getRawUserContentUrl'

	// Proposal catalog repos
	for (const prefix of [
		'BitcoinBips',
		'BitcoinBip',
		'BitcoinCashChips',
		'BitcoinCashChip',
		'CosmosAdrs',
		'CosmosAdr',
		'DogecoinDips',
		'DogecoinDip',
		'EthereumEipSpec',
		'FilecoinFips',
		'FilecoinFip',
		'LitecoinLips',
		'LitecoinLip',
		'NearNeps',
		'NearNep',
		'PolkadotRfcs',
		'PolkadotRfc',
		'ZcashZips',
		'ZcashZip',
		'CaipNamespaces',
		'CaipNamespace',
		'Simd',
	]) {
		const n = stripGetPrefix(name, prefix)
		if (n) return n
	}

	if (name.startsWith('getCaip') && !name.startsWith('getCaips')) {
		return 'get' + name.slice('getCaip'.length)
	}

	if (name === 'getBcmrRegistry') return 'getRegistry'
	if (name === 'CoingeckoCoinsMarket') return 'CoinsMarket'
	if (name === 'searchThreeXpl') return 'search'
	if (name === 'fetchGoEthereumParamsConfigGo') return 'fetchParamsConfigGo'

	return null
}

const renames = new Map()
for (const name of exports) {
	const n = suggestRename(name)
	if (n && n !== name) renames.set(name, n)
}

const byTarget = new Map()
for (const [from, to] of renames) {
	if (!byTarget.has(to)) byTarget.set(to, [])
	byTarget.get(to).push(from)
}
for (const [to, froms] of byTarget) {
	if (froms.length > 1)
		console.error('COLLISION', to, '<-', froms)
}

console.log('Renames:', renames.size)
for (const [from, to] of [...renames.entries()].sort((a, b) => a[0].localeCompare(b[0])))
	console.log(`${from} -> ${to}`)

if (process.argv.includes('--apply')) {
	const exts = new Set(['.ts', '.svelte', '.js', '.mjs', '.md'])
	const walk = (dir, files = []) => {
		if (!fs.existsSync(dir)) return files
		for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
			if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'build') continue
			const p = path.join(dir, ent.name)
			if (ent.isDirectory()) walk(p, files)
			else if (exts.has(path.extname(ent.name))) files.push(p)
		}
		return files
	}

	const sorted = [...renames.entries()].sort((a, b) => b[0].length - a[0].length)
	const skipFiles = new Set([
		path.join(root, '_rename-queries-exports.mjs'),
	])
	let changed = 0
	for (const dir of ['src', 'tests', 'specs', 'docs']) {
		for (const file of walk(path.join(root, dir))) {
			if (skipFiles.has(file)) continue
			let text = fs.readFileSync(file, 'utf8')
			const orig = text
			for (const [from, to] of sorted) {
				text = text.replaceAll(new RegExp(`\\b${from}\\b`, 'g'), to)
			}
			if (text !== orig) {
				fs.writeFileSync(file, text)
				changed++
				console.log('updated', path.relative(root, file))
			}
		}
	}
	console.log('files changed:', changed)
}
