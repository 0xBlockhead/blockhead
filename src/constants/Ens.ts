// Types
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


// Constants
export const ensEthereumChainId = 1

export const ensTextRecordLabels = {
	name: 'Name',
	display: 'Display name',
	avatar: 'Avatar',
	description: 'Description',
	location: 'Location',
	keywords: 'Keywords',
	notice: 'Notice',
	url: 'Website',
	email: 'Email',
	mail: 'Mailing address',
	phone: 'Phone',
	'com.discord': 'Discord',
	'com.github': 'GitHub',
	'io.keybase': 'Keybase',
	'com.linkedin': 'LinkedIn',
	'com.peepeth': 'Peepeth',
	'com.reddit': 'Reddit',
	'org.telegram': 'Telegram',
	'com.twitter': 'Twitter',
} as const

export const ensTextRecordKeys = [
	'name',
	'display',
	'avatar',
	'description',
	'location',
	'keywords',
	'notice',
	'url',
	'email',
	'mail',
	'phone',
	'com.discord',
	'com.github',
	'io.keybase',
	'com.linkedin',
	'com.peepeth',
	'com.reddit',
	'org.telegram',
	'com.twitter',
] as const

export const ensTextRecordDisplayOrder = [
	...ensTextRecordKeys,
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
} as const

export const ensCoinTypeIdsToResolve = Object.keys(
	ensCoinTypeLabels,
)

const ensTextRecordLabelsLookup: Record<string, string> = { ...ensTextRecordLabels }

const ensCoinTypeLabelsLookup: Record<string, string> = { ...ensCoinTypeLabels }

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
	key in ensTextRecordLabelsLookup ? ensTextRecordLabelsLookup[key] : key
)

export const getEnsCoinTypeLabel = (coinType: string | number) => {
	const key = String(coinType)
	return key in ensCoinTypeLabelsLookup ? ensCoinTypeLabelsLookup[key] : `Coin type ${coinType}`
}
