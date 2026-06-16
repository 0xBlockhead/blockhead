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

const evmEnsCoinTypeId = (chainId: number) => (
	0x80000000 | chainId
)

const ensRegistrationStatuses = [
	{
		status: EnsRegistrationStatus.Active,
		label: 'Active registration',
	},
	{
		status: EnsRegistrationStatus.GracePeriod,
		label: 'Grace period',
	},
	{
		status: EnsRegistrationStatus.Expired,
		label: 'Expired',
	},
] as const satisfies readonly {
	status: EnsRegistrationStatus
	label: string
}[]

const ensTextRecordLabels = [
	{
		key: 'alias',
		label: 'Alias',
	},
	{
		key: 'name',
		label: 'Name',
	},
	{
		key: 'display',
		label: 'Display name',
	},
	{
		key: 'avatar',
		label: 'Avatar',
	},
	{
		key: 'header',
		label: 'Header',
	},
	{
		key: 'description',
		label: 'Description',
	},
	{
		key: 'location',
		label: 'Location',
	},
	{
		key: 'keywords',
		label: 'Keywords',
	},
	{
		key: 'notice',
		label: 'Notice',
	},
	{
		key: 'url',
		label: 'Website',
	},
	{
		key: 'website',
		label: 'Website',
	},
	{
		key: 'email',
		label: 'Email',
	},
	{
		key: 'mail',
		label: 'Mailing address',
	},
	{
		key: 'phone',
		label: 'Phone',
	},
	{
		key: 'timezone',
		label: 'Timezone',
	},
	{
		key: 'language',
		label: 'Language',
	},
	{
		key: 'theme',
		label: 'Theme',
	},
	{
		key: 'primary-contact',
		label: 'Primary contact',
	},
	{
		key: 'com.discord',
		label: 'Discord',
	},
	{
		key: 'com.github',
		label: 'GitHub',
	},
	{
		key: 'io.keybase',
		label: 'Keybase',
	},
	{
		key: 'com.linkedin',
		label: 'LinkedIn',
	},
	{
		key: 'com.peepeth',
		label: 'Peepeth',
	},
	{
		key: 'com.reddit',
		label: 'Reddit',
	},
	{
		key: 'org.telegram',
		label: 'Telegram',
	},
	{
		key: 'com.twitter',
		label: 'X (Twitter)',
	},
	{
		key: 'eth.ens.delegate',
		label: 'ENS delegate',
	},
] as const satisfies readonly {
	key: string
	label: string
}[]

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

const ensCoinTypeLabels = [
	{
		key: '0',
		label: 'BTC',
	},
	{
		key: '2',
		label: 'LTC',
	},
	{
		key: '3',
		label: 'DOGE',
	},
	{
		key: '60',
		label: 'ETH',
	},
	{
		key: '118',
		label: 'ATOM',
	},
	{
		key: '144',
		label: 'XRP',
	},
	{
		key: '145',
		label: 'BCH',
	},
	{
		key: '501',
		label: 'SOL',
	},
	{
		key: String(evmEnsCoinTypeId(10)),
		label: 'Optimism',
	},
	{
		key: String(evmEnsCoinTypeId(42161)),
		label: 'Arbitrum One',
	},
	{
		key: String(evmEnsCoinTypeId(8453)),
		label: 'Base',
	},
	{
		key: String(evmEnsCoinTypeId(137)),
		label: 'Polygon',
	},
	{
		key: String(evmEnsCoinTypeId(59144)),
		label: 'Linea',
	},
	{
		key: String(evmEnsCoinTypeId(534352)),
		label: 'Scroll',
	},
	{
		key: String(evmEnsCoinTypeId(42220)),
		label: 'Celo',
	},
] as const satisfies readonly {
	key: string
	label: string
}[]

export const ensCoinTypeIdsToResolve = [
	0,
	2,
	3,
	60,
	118,
	144,
	145,
	501,
	evmEnsCoinTypeId(10),
	evmEnsCoinTypeId(42161),
	evmEnsCoinTypeId(8453),
	evmEnsCoinTypeId(137),
	evmEnsCoinTypeId(59144),
	evmEnsCoinTypeId(534352),
	evmEnsCoinTypeId(42220),
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

export const ensTextRecordLinkRules = [
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

export const ensRegistrationStatusByStatus = Object.fromEntries(
	ensRegistrationStatuses.map((row) => [
		row.status,
		row,
	])
)

export const ensTextRecordLabelByKey = Object.fromEntries(
	ensTextRecordLabels.map((row) => [
		row.key,
		row,
	])
)

export const ensCoinTypeLabelByKey = Object.fromEntries(
	ensCoinTypeLabels.map((row) => [
		row.key,
		row,
	])
)

export const ensTextRecordDisplayRank = Object.fromEntries(
	ensTextRecordDisplayOrder.map((key, rank) => [
		key,
		{
			key,
			rank,
		},
	])
)
