import {
	expect,
	it,
} from 'vitest'

import {
	getProposalMarkdownPageUrl,
	getProposalMarkdownUrl,
} from '$/sources/EthereumEips/Github/queries.ts'

it('derives proposal URLs from the ledger binding target', () => {
	expect(getProposalMarkdownUrl({
		ledger: 'eip',
		number: 1559,
	})).toBe('https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-1559.md')
	expect(getProposalMarkdownPageUrl({
		ledger: 'erc',
		number: 721,
	})).toBe('https://github.com/ethereum/ercs/blob/master/ERCS/erc-721.md')
})
