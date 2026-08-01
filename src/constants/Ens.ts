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

const evmEnsCoinTypeId = (chainId: number) => (
	0x80000000 | chainId
)

export const ensTextRecords = [
	{
		key: 'avatar',
		label: 'Avatar',
		profile: true,
		displayRank: 0,
	},
	{
		key: 'header',
		label: 'Header',
		profile: true,
		displayRank: 1,
	},
	{
		key: 'name',
		label: 'Name',
		profile: true,
		displayRank: 3,
	},
	{
		key: 'alias',
		label: 'Alias',
		profile: true,
		displayRank: 2,
	},
	{
		key: 'display',
		label: 'Display name',
		profile: true,
		displayRank: 4,
	},
	{
		key: 'description',
		label: 'Description',
		profile: true,
		displayRank: 5,
	},
	{
		key: 'url',
		label: 'Website',
		profile: true,
		displayRank: 6,
	},
	{
		key: 'location',
		label: 'Location',
		profile: false,
		displayRank: 8,
	},
	{
		key: 'keywords',
		label: 'Keywords',
		profile: false,
		displayRank: 20,
	},
	{
		key: 'notice',
		label: 'Notice',
		profile: false,
		displayRank: 21,
	},
	{
		key: 'timezone',
		label: 'Timezone',
		profile: false,
		displayRank: 9,
	},
	{
		key: 'language',
		label: 'Language',
		profile: false,
		displayRank: 10,
	},
	{
		key: 'theme',
		label: 'Theme',
		profile: false,
		displayRank: 24,
	},
	{
		key: 'primary-contact',
		label: 'Primary contact',
		profile: false,
		displayRank: 25,
	},
	{
		key: 'email',
		label: 'Email',
		profile: true,
		displayRank: 7,
	},
	{
		key: 'com.twitter',
		label: 'X (Twitter)',
		profile: false,
		displayRank: 11,
	},
	{
		key: 'com.github',
		label: 'GitHub',
		profile: false,
		displayRank: 12,
	},
	{
		key: 'com.discord',
		label: 'Discord',
		profile: false,
		displayRank: 13,
	},
	{
		key: 'org.telegram',
		label: 'Telegram',
		profile: false,
		displayRank: 14,
	},
	{
		key: 'com.linkedin',
		label: 'LinkedIn',
		profile: false,
		displayRank: 15,
	},
	{
		key: 'com.reddit',
		label: 'Reddit',
		profile: false,
		displayRank: 16,
	},
	{
		key: 'io.keybase',
		label: 'Keybase',
		profile: false,
		displayRank: 17,
	},
	{
		key: 'com.peepeth',
		label: 'Peepeth',
		profile: false,
		displayRank: 18,
	},
	{
		key: 'eth.ens.delegate',
		label: 'ENS delegate',
		profile: false,
		displayRank: 19,
	},
	{
		key: 'mail',
		label: 'Mailing address',
		profile: false,
		displayRank: 22,
	},
	{
		key: 'phone',
		label: 'Phone',
		profile: false,
		displayRank: 23,
	},
	{
		key: 'website',
		label: 'Website',
		profile: false,
		displayRank: null,
	},
] as const satisfies readonly {
	key: string
	label: string
	profile: boolean
	displayRank: number | null
}[]

export const ensCoinTypes = [
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
