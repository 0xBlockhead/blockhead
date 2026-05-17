/**
 * Shared mainnet↔testnet pairing heuristics for Chainlist + Ethereum Lists catalogs.
 * Families are normalized so slug/name drift (e.g. binance vs bnb) still pairs.
 * Ethereum execution-layer roots exclude non-ETH gas testnets that only match via title.
 */

export type CatalogWireChain = {
	chainId: number
	name: string
	title?: string
	shortName?: string
	chainSlug?: string
	parent?: { type?: string; chain?: string | null } | null
	nativeCurrency: { symbol: string }
	isTestnet?: boolean
	testnet?: boolean
}

const testnetKeywordPattern = /\b(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)\b/i

const familyAliasByToken: Record<string, string> = {
	op: 'optimism',
	oeth: 'optimism',
	arb: 'arbitrum',
	arb1: 'arbitrum',
	eth: 'ethereum',
}

/** Merge tokens that refer to the same ecosystem but diverge across catalogs. */
const pairingFamilyEquivalenceRoot: Record<string, string> = {
	bnb: 'binance',
	bnbt: 'binance',
	bsctest: 'binance',
	binance: 'binance',
	matic: 'polygon',
	maticmum: 'polygon',
	polygonamoy: 'polygon',
}

const familyStopwords = new Set([
	'mainnet',
	'testnet',
	'network',
	'chain',
	'rollup',
	'l2',
	'l3',
	'public',
	'private',
	'alpha',
	'beta',
	'devnet',
	'deprecated',
	'legacy',
	'stage',
	'staging',
	'v1',
	'v2',
	'v3',
])

const slugFamilyTokenAliases: Record<string, string> = {
	zksyncera: 'zksync',
}

export const normalizePairingShortName = (shortName: string | undefined): string => (
	(shortName ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '')
		.replace(/(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)+$/g, '')
)

export const normalizeFamilyToken = (value: string): string => (
	value.toLowerCase().replace(/[^a-z0-9]+/g, '')
)

export const canonicalFamilyToken = (value: string): string => (
	familyAliasByToken[normalizeFamilyToken(value)]
	?? normalizeFamilyToken(value)
)

export const ethereumFamilyCanonical = canonicalFamilyToken('ethereum')

export const resolveCatalogFamilyToken = ({
	name,
	title,
	shortName,
	chainSlug,
}: Pick<CatalogWireChain, 'name' | 'shortName'> & {
	title?: string
	chainSlug?: string
}): string | undefined => {
	if (chainSlug != null && chainSlug.trim().length > 0) {
		const slugCanonical = canonicalFamilyToken(chainSlug.trim())
		const slugNormalized = normalizeFamilyToken(slugCanonical)
		return slugFamilyTokenAliases[slugNormalized] ?? slugCanonical
	}
	const text = `${title ?? ''} ${name ?? ''} ${shortName ?? ''}`
	if (/\bethereum\s+classic\b/i.test(text)) {
		return 'ethereumclassic'
	}
	if (/\bpolygon\s+zkevm\b/i.test(text) || (/\bpolygon\b/i.test(text) && /\bzkevm\b/i.test(text))) {
		return normalizeFamilyToken('polygonzkevm')
	}
	const token = text
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.find((value) => value.length > 0 && !familyStopwords.has(value))
	return token == null ? undefined : canonicalFamilyToken(token)
}

export const pairingFamilyKey = (chain: CatalogWireChain): string | undefined => {
	const raw = resolveCatalogFamilyToken(chain)
	if (raw == null) return undefined
	const normalized = normalizeFamilyToken(raw)
	return pairingFamilyEquivalenceRoot[normalized] ?? raw
}

export const chainlistRowImpliesTestnet = (chain: Pick<CatalogWireChain, 'name' | 'title' | 'isTestnet' | 'testnet'>): boolean => (
	chain.isTestnet === true
	|| chain.testnet === true
	|| testnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name ?? ''}`)
)

export const ethereumListsRowImpliesTestnet = (chain: Pick<CatalogWireChain, 'name' | 'title'>): boolean => (
	testnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name ?? ''}`)
)

export const catalogChainIsEthereumExecutionRoot = (chain: CatalogWireChain): boolean => (
	pairingFamilyKey(chain) === ethereumFamilyCanonical
	&& chain.parent?.chain == null
)

/**
 * Execution-layer Ethereum roots list many fork/test chains whose titles contain “Ethereum” but whose
 * native symbol is not ETH; those should not appear as peers of Ethereum Mainnet.
 */
export const catalogEthereumExecutionRootAcceptsTestnetCandidate = (
	sourceMainnet: CatalogWireChain,
	candidateTestnet: CatalogWireChain,
): boolean => (
	!catalogChainIsEthereumExecutionRoot(sourceMainnet)
	|| candidateTestnet.nativeCurrency.symbol.trim().toUpperCase() === 'ETH'
)

export const selectBestMainnetCandidate = ({
	testnetChainId,
	testnetShortName,
	mainnetCandidates,
}: {
	testnetChainId: number
	testnetShortName?: string
	mainnetCandidates: {
		chainId: number
		shortName?: string
		name?: string
	}[]
}) => {
	const testnetChainIdAsString = String(testnetChainId)
	const byChainIdPrefix = mainnetCandidates
		.filter((candidate) => (
			testnetChainIdAsString.startsWith(String(candidate.chainId))
		))
		.toSorted((leftCandidate, rightCandidate) => (
			String(rightCandidate.chainId).length - String(leftCandidate.chainId).length
			|| leftCandidate.chainId - rightCandidate.chainId
		))
	if (byChainIdPrefix[0] != null) return byChainIdPrefix[0]
	const normalizedSourceShortName = normalizePairingShortName(testnetShortName)
	if (normalizedSourceShortName.length > 0) {
		const byShortNamePrefix = mainnetCandidates
			.filter((candidate) => {
				const normalizedCandidateShortName = normalizePairingShortName(candidate.shortName)
				return (
					normalizedCandidateShortName.length > 0
					&& (
						normalizedSourceShortName.startsWith(normalizedCandidateShortName)
						|| normalizedCandidateShortName.startsWith(normalizedSourceShortName)
					)
				)
			})
			.toSorted((leftCandidate, rightCandidate) => (
				leftCandidate.chainId - rightCandidate.chainId
			))
		if (byShortNamePrefix[0] != null) return byShortNamePrefix[0]
	}
	const byMainnetKeyword = mainnetCandidates
		.filter((candidate) => /\bmainnet\b/i.test(candidate.name ?? ''))
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		))
	if (byMainnetKeyword[0] != null) return byMainnetKeyword[0]
	return mainnetCandidates
		.toSorted((leftCandidate, rightCandidate) => (
			leftCandidate.chainId - rightCandidate.chainId
		))[0]
}
