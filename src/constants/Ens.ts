// Types
import { ensContentHashBrowseHref } from '$/lib/ensContentHash.ts'
import { resolveMediaUrlTransport } from '$/lib/media.ts'


export enum EnsTextRecordHrefMode {
	Value = 'value',
	Mailto = 'mailto',
	Prefix = 'prefix',
	PrefixStripAt = 'prefixStripAt',
}

export type EnsTextRecordLinkEntry = {
	keys: readonly string[]
	hrefMode: EnsTextRecordHrefMode
	urlPrefix?: string
}

export enum EnsRegistrationStatus {
	Active = 'active',
	GracePeriod = 'gracePeriod',
	Expired = 'expired',
}


// Constants
export const ensEthereumChainId = 1

export const ensGracePeriodSeconds = (
	90n * 24n * 60n * 60n
)

export const ensEvmCoinTypeId = (chainId: number) => (
	0x80000000 | chainId
)

export const ensTextRecordLabels = {
	alias: 'Alias',
	name: 'Name',
	display: 'Display name',
	avatar: 'Avatar',
	header: 'Header',
	description: 'Description',
	location: 'Location',
	keywords: 'Keywords',
	notice: 'Notice',
	url: 'Website',
	website: 'Website',
	email: 'Email',
	mail: 'Mailing address',
	phone: 'Phone',
	timezone: 'Timezone',
	language: 'Language',
	theme: 'Theme',
	'primary-contact': 'Primary contact',
	'com.discord': 'Discord',
	'com.github': 'GitHub',
	'io.keybase': 'Keybase',
	'com.linkedin': 'LinkedIn',
	'com.peepeth': 'Peepeth',
	'com.reddit': 'Reddit',
	'org.telegram': 'Telegram',
	'com.twitter': 'X (Twitter)',
	'eth.ens.delegate': 'ENS delegate',
} as const

export const ensGeneralTextRecordKeys = [
	'name',
	'alias',
	'display',
	'description',
	'url',
	'location',
	'keywords',
	'notice',
	'timezone',
	'language',
	'theme',
	'primary-contact',
] as const

export const ensSocialTextRecordKeys = [
	'email',
	'com.twitter',
	'com.github',
	'com.discord',
	'org.telegram',
	'com.linkedin',
	'com.reddit',
	'io.keybase',
	'com.peepeth',
	'eth.ens.delegate',
] as const

export const ensMediaTextRecordKeys = [
	'avatar',
	'header',
] as const

export const ensTextRecordKeys = [
	...ensMediaTextRecordKeys,
	...ensGeneralTextRecordKeys,
	...ensSocialTextRecordKeys,
	'mail',
	'phone',
	'website',
] as const

export const ensTextRecordDisplayOrder = [
	'avatar',
	'header',
	'alias',
	'name',
	'display',
	'description',
	'url',
	'email',
	'location',
	'timezone',
	'language',
	'com.twitter',
	'com.github',
	'com.discord',
	'org.telegram',
	'com.linkedin',
	'com.reddit',
	'io.keybase',
	'com.peepeth',
	'eth.ens.delegate',
	'keywords',
	'notice',
	'mail',
	'phone',
	'theme',
	'primary-contact',
] as const

export const ensCoinTypeLabels = {
	'0': 'BTC',
	'2': 'LTC',
	'3': 'DOGE',
	'60': 'ETH',
	'118': 'ATOM',
	'144': 'XRP',
	'145': 'BCH',
	'501': 'SOL',
	[String(ensEvmCoinTypeId(10))]: 'Optimism',
	[String(ensEvmCoinTypeId(42161))]: 'Arbitrum One',
	[String(ensEvmCoinTypeId(8453))]: 'Base',
	[String(ensEvmCoinTypeId(137))]: 'Polygon',
	[String(ensEvmCoinTypeId(59144))]: 'Linea',
	[String(ensEvmCoinTypeId(534352))]: 'Scroll',
	[String(ensEvmCoinTypeId(42220))]: 'Celo',
} as const

export const ensCoinTypeIdsToResolve = [
	0,
	2,
	3,
	60,
	118,
	144,
	145,
	501,
	ensEvmCoinTypeId(10),
	ensEvmCoinTypeId(42161),
	ensEvmCoinTypeId(8453),
	ensEvmCoinTypeId(137),
	ensEvmCoinTypeId(59144),
	ensEvmCoinTypeId(534352),
	ensEvmCoinTypeId(42220),
].map(String)

export const ensProfileTextRecordKeys = [
	'avatar',
	'header',
	'alias',
	'display',
	'name',
	'description',
	'url',
	'email',
] as const

export const ensTextRecordLinkEntries = [
	{ keys: ['url', 'website'], hrefMode: EnsTextRecordHrefMode.Value },
	{ keys: ['email'], hrefMode: EnsTextRecordHrefMode.Mailto },
	{
		keys: ['twitter', 'com.twitter'],
		hrefMode: EnsTextRecordHrefMode.PrefixStripAt,
		urlPrefix: 'https://twitter.com/',
	},
	{
		keys: ['com.github'],
		hrefMode: EnsTextRecordHrefMode.Prefix,
		urlPrefix: 'https://github.com/',
	},
	{
		keys: ['com.linkedin'],
		hrefMode: EnsTextRecordHrefMode.Prefix,
		urlPrefix: 'https://www.linkedin.com/in/',
	},
	{
		keys: ['com.reddit'],
		hrefMode: EnsTextRecordHrefMode.Prefix,
		urlPrefix: 'https://reddit.com/u/',
	},
	{
		keys: ['org.telegram'],
		hrefMode: EnsTextRecordHrefMode.Prefix,
		urlPrefix: 'https://t.me/',
	},
	{
		keys: ['com.discord'],
		hrefMode: EnsTextRecordHrefMode.Prefix,
		urlPrefix: 'https://discord.com/users/',
	},
] as const satisfies readonly EnsTextRecordLinkEntry[]


// Lookups
const ensTextRecordLabelsLookup: Record<string, string> = { ...ensTextRecordLabels }

const ensCoinTypeLabelsLookup: Record<string, string> = { ...ensCoinTypeLabels }

export const ensTextRecordDisplayRank = Object.fromEntries(
	ensTextRecordDisplayOrder.map((key, index) => [
		key,
		index,
	]),
)

export const getEnsTextRecordHref = (key: string, value: string) => {
	const entry = ensTextRecordLinkEntries.find((candidate) => (
		candidate.keys.some((candidateKey) => candidateKey === key)
	))
	if (entry == null) return null

	switch (entry.hrefMode) {
		case EnsTextRecordHrefMode.Value:
			return value
		case EnsTextRecordHrefMode.Mailto:
			return `mailto:${value}`
		case EnsTextRecordHrefMode.Prefix:
			return `${entry.urlPrefix ?? ''}${value}`
		case EnsTextRecordHrefMode.PrefixStripAt:
			return `${entry.urlPrefix ?? ''}${value.startsWith('@') ? value.slice(1) : value}`
	}
}

export const getEnsTextRecordLabel = (key: string) => (
	key in ensTextRecordLabelsLookup ?
		ensTextRecordLabelsLookup[key]
	:
		key
)

export const getEnsCoinTypeLabel = (coinType: string | number) => {
	const key = String(coinType)
	return key in ensCoinTypeLabelsLookup ?
		ensCoinTypeLabelsLookup[key]
	:
		`Coin type ${coinType}`
}

export const ensAvatarUrlFromTextRecords = (
	textRecords: Record<string, string> | undefined,
) => {
	const raw = textRecords?.avatar?.trim()
	if (raw == null || raw === '') return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export const ensHeaderUrlFromTextRecords = (
	textRecords: Record<string, string> | undefined,
) => {
	const raw = textRecords?.header?.trim()
	if (raw == null || raw === '') return undefined
	return resolveMediaUrlTransport(raw)?.url
}

export const ensDisplayAliasFromTextRecords = (
	textRecords: Record<string, string> | undefined,
) => {
	const alias = textRecords?.alias?.trim()
	if (alias != null && alias !== '') return alias
	const legacyName = textRecords?.name?.trim()
	if (legacyName != null && legacyName !== '') return legacyName
	return undefined
}

export const ensRegistrationStatusFromExpiryMs = (expiryMs: number) => (
	Date.now() < expiryMs ?
		EnsRegistrationStatus.Active
	: Date.now() < expiryMs + Number(ensGracePeriodSeconds) * 1000 ?
		EnsRegistrationStatus.GracePeriod
	:
		EnsRegistrationStatus.Expired
)

export const ensRegistrationStatusLabel = (status: EnsRegistrationStatus) => (
	status === EnsRegistrationStatus.Active ?
		'Active registration'
	: status === EnsRegistrationStatus.GracePeriod ?
		'Grace period'
	:
		'Expired'
)

export const getEnsContentHashBrowseHref = ensContentHashBrowseHref
