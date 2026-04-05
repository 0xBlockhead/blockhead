/**
 * Org / repo / path / ref for ethereum/EIPs and ethereum/ercs (`master`).
 * @see https://github.com/ethereum/EIPs/tree/master/EIPS
 * @see https://github.com/ethereum/ercs/tree/master/ERCS
 */
export const ethereumEipSpecGithubRepoByLedger = {
	eip: {
		owner: 'ethereum',
		repo: 'EIPs',
		path: 'EIPS',
		ref: 'master',
		entryLedger: 'eip' as const,
	},
	erc: {
		owner: 'ethereum',
		repo: 'ercs',
		path: 'ERCS',
		ref: 'master',
		entryLedger: 'erc' as const,
	},
} as const

export const ethereumEipSpecMarkdownPrefixByLedger = {
	eip: 'eip',
	erc: 'erc',
} as const
