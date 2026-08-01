import { networks } from '$/constants/Network.ts'
import {
	chainlistCanonicalFamilyBySlugToken,
	chainlistCanonicalFamilyByToken,
	chainlistFamilyStopwords,
	chainlistRootFamilyByToken,
	chainlistTestnetKeywordPattern,
} from '$/constants/ChainlistPairing.ts'
import { type } from 'arktype'

import {
	EntityMetaKey,
	type Entity,
	type EntitySelector,
	type EntitySelectorForSelectorName,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { UrlString } from '$/schema/UrlString.ts'
import { schema } from '$/schema/index.ts'

type EvmChainCatalogPairing = {
	chainId: number
	name: string
	title?: string
	shortName?: string
	chainSlug?: string
	parent?: {
		chain: string
	}
	nativeCurrency: {
		symbol: string
	}
	isTestnet?: boolean
	testnet?: boolean
}

type EvmChainCatalogExplorer = {
	url: string
}

const normalizeEvmChainCatalogPairingShortName = (shortName: string | undefined) => (
	(shortName ?? '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '')
		.replace(/(testnet|sepolia|holesky|hoodi|goerli|rinkeby|ropsten|kovan)+$/g, '')
)

const normalizeEvmChainCatalogFamilyToken = (value: string) => (
	value.toLowerCase().replace(/[^a-z0-9]+/g, '')
)

const canonicalEvmChainCatalogFamilyToken = (value: string) => (
	chainlistCanonicalFamilyByToken[normalizeEvmChainCatalogFamilyToken(value)]?.canonicalFamily
	?? normalizeEvmChainCatalogFamilyToken(value)
)

export const evmChainCatalogFamilyKey = (chain: EvmChainCatalogPairing) => {
	const chainSlug = chain.chainSlug?.trim()
	const text = `${chain.title ?? ''} ${chain.name} ${chain.shortName ?? ''}`
	const family = (
		chainSlug != null && chainSlug.length > 0 ?
			chainlistCanonicalFamilyBySlugToken[
				normalizeEvmChainCatalogFamilyToken(
					canonicalEvmChainCatalogFamilyToken(chainSlug)
				)
			]?.canonicalFamily
			?? canonicalEvmChainCatalogFamilyToken(chainSlug)
		:
			/\bethereum\s+classic\b/i.test(text) ?
				'ethereumclassic'
			:
				/\bpolygon\s+zkevm\b/i.test(text)
				|| (/\bpolygon\b/i.test(text) && /\bzkevm\b/i.test(text)) ?
					normalizeEvmChainCatalogFamilyToken('polygonzkevm')
				:
					((token) => (
						token == null ?
							undefined
						:
							canonicalEvmChainCatalogFamilyToken(token)
					))(text
						.toLowerCase()
						.split(/[^a-z0-9]+/g)
						.find((value) => (
							value.length > 0
							&& !chainlistFamilyStopwords.some((stopword) => stopword === value)
						)))
	)
	return family == null ?
		undefined
	:
		chainlistRootFamilyByToken[normalizeEvmChainCatalogFamilyToken(family)]?.rootFamily ?? family
}

export const evmChainCatalogRowImpliesTestnet = (chain: EvmChainCatalogPairing) => (
	chain.isTestnet === true
	|| chain.testnet === true
	|| chainlistTestnetKeywordPattern.test(`${chain.title ?? ''} ${chain.name}`)
)

export const evmChainCatalogIsEthereumExecutionRoot = (chain: EvmChainCatalogPairing) => (
	evmChainCatalogFamilyKey(chain) === chainlistCanonicalFamilyByToken.eth.canonicalFamily
	&& chain.parent?.chain == null
)

export const evmChainCatalogEthereumRootAcceptsTestnet = (
	sourceMainnet: EvmChainCatalogPairing,
	candidateTestnet: EvmChainCatalogPairing
) => (
	!evmChainCatalogIsEthereumExecutionRoot(sourceMainnet)
	|| candidateTestnet.nativeCurrency.symbol.trim().toUpperCase() === 'ETH'
)

export const selectBestEvmChainCatalogMainnet = ({
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
	const chainIdPrefixMatch = mainnetCandidates
		.filter((candidate) => testnetChainIdAsString.startsWith(String(candidate.chainId)))
		.toSorted((leftCandidate, rightCandidate) => (
			String(rightCandidate.chainId).length - String(leftCandidate.chainId).length
			|| leftCandidate.chainId - rightCandidate.chainId
		))
		.at(0)
	if (chainIdPrefixMatch != null) return chainIdPrefixMatch

	const normalizedSourceShortName = normalizeEvmChainCatalogPairingShortName(testnetShortName)
	if (normalizedSourceShortName.length > 0) {
		const shortNamePrefixMatch = mainnetCandidates
			.filter((candidate) => {
				const normalizedCandidateShortName = normalizeEvmChainCatalogPairingShortName(candidate.shortName)
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
			.at(0)
		if (shortNamePrefixMatch != null) return shortNamePrefixMatch
	}

	return (
		mainnetCandidates
			.filter((candidate) => /\bmainnet\b/i.test(candidate.name ?? ''))
			.toSorted((leftCandidate, rightCandidate) => (
				leftCandidate.chainId - rightCandidate.chainId
			))
			.at(0)
		?? mainnetCandidates
			.toSorted((leftCandidate, rightCandidate) => (
				leftCandidate.chainId - rightCandidate.chainId
			))
			.at(0)
	)
}

export const evmChainCatalogUrlEntities = (
	urls: string[]
) => urls.flatMap((raw) => {
	const trimmed = raw.trim()
	if (trimmed === '') return []

	const url = new URL(
		trimmed.startsWith('http://') || trimmed.startsWith('https://') ?
			trimmed
		:
			trimmed.startsWith('//') ?
				`https:${trimmed}`
			:
				`https://${trimmed}`
	).toString()
	const hrefAsUrlString = UrlString(url)
	if (hrefAsUrlString instanceof type.errors) return []

	return [({
		[EntityMetaKey.Selector]: {
			url: hrefAsUrlString,
		},
	}) satisfies Entity<typeof schema, EntityType.Url>]
})

export const evmChainCatalogExplorerUrlEntities = ({
	explorers,
	infoURL,
}: {
	explorers: EvmChainCatalogExplorer[] | undefined
	infoURL?: string | null
}) => {
	const infoUrl = infoURL?.trim() ?? ''
	return evmChainCatalogUrlEntities([
		...(explorers ?? []).map((explorer) => explorer.url),
		...(
			infoUrl !== ''
			&& !(explorers ?? []).some((explorer) => explorer.url.trim() === infoUrl) ?
				[infoUrl]
			:
				[]
		),
	])
}

export const evmChainIdFromCatalogParent = (
	parent: {
		chain: string
	} | null | undefined
) => {
	const match = parent == null ?
		null
	:
		/^eip155[:-](\d+)$/i.exec(parent.chain.trim())
	return match == null ? undefined : Number(match[1])
}

export const evmChainIdFromNetworkSelector = (
	network: EntitySelector<typeof schema, EntityType.Network>
) => {
	const catalogNetwork = (
		'slug' in network ?
			networks.find(({ slug }) => slug === network.slug)
		:
			undefined
	)
	const caip2 = (
		'caip2' in network ?
			network.caip2
		: catalogNetwork != null && 'caip2' in catalogNetwork ?
			catalogNetwork.caip2
		:
			undefined
	)
	if (caip2 == null || caip2.namespace !== 'eip155')
		throw new Error('Network selector is not an EIP-155 chain')

	const chainId = Number(caip2.reference)
	if (
		!Number.isSafeInteger(chainId)
		|| chainId < 0
		|| String(chainId) !== caip2.reference
	)
		throw new Error('Network selector has an invalid EIP-155 chain reference')

	return chainId
}

export const evmNetworkSelectorFromChainId = (chainId: number) => ({
	caip2: {
		namespace: 'eip155',
		reference: String(chainId),
	},
}) as const satisfies EntitySelectorForSelectorName<typeof schema, EntityType.Network, 'Caip2'>
