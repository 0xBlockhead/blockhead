import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	sourceGetJson,
	sourceGetText: vi.fn(),
}))

import {
	getContents,
	getProposalMarkdownPageUrl,
	getProposalMarkdownUrl,
} from '$/sources/EthereumEips/Github/queries.ts'

beforeEach(() => {
	sourceGetJson.mockReset()
})

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

it('rejects unscoped proposal numbers before deriving provider URLs', () => {
	expect(() => getProposalMarkdownUrl({
		ledger: 'eip',
		number: 0,
	})).toThrow('proposal number must be a positive safe integer')
	expect(() => getProposalMarkdownPageUrl({
		ledger: 'erc',
		number: Number.MAX_SAFE_INTEGER + 1,
	})).toThrow('proposal number must be a positive safe integer')
})

it('rejects duplicate repository entries before they become duplicate proposal rows', async () => {
	sourceGetJson.mockResolvedValueOnce([
		{
			name: 'eip-1.md',
		},
		{
			name: 'eip-1.md',
		},
	])

	await expect(getContents({
		ledger: 'eip',
	})).rejects.toThrow('duplicate entry name')
})
