import { beforeEach, describe, expect, it, vi } from 'vitest'

import bindings from '$/sources/Eip8004Scan/bindings.ts'
import { Source } from '$/sources/Source.ts'

const sourceGetJson = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: () => 'https://8004scan.test/api/v1/public',
	sourceGetJson,
}))

const {
	fetchAgentDetail,
	fetchAgentList,
} = await import('$/sources/Eip8004Scan/Rest/queries.ts')

const binding = bindings[Source.Eip8004Scan_Rest][0]

describe('EIP-8004 Scan endpoints', () => {
	beforeEach(() => {
		sourceGetJson.mockReset()
	})

	it('returns the detail response envelope without projecting it', async () => {
		const response = {
			data: {
				chain_id: 1,
				token_id: '42',
				contract_address: '0x1234567890abcdef1234567890abcdef12345678',
				raw_metadata: {
					offchain_uri: 'https://agents.example/42.json',
				},
				services: {
					' a2a ': {
						endpoint: ' https://agents.example/a2a ',
						name: ' Trading agent ',
						version: ' 1.2.0 ',
						protocol: ' https ',
						active: false,
					},
					emptyKind: {
						endpoint: ' ',
					},
					' ': {
						endpoint: 'https://agents.example/no-kind',
					},
				},
			},
		}
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(fetchAgentDetail(
			{
				chainId: 1,
				tokenId: '42',
			}
		)).resolves.toBe(response)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://8004scan.test/api/v1/public/agents/1/42'
		)
	})

	it('returns the list response envelope without projecting it', async () => {
		const response = {
			success: true,
			data: [{
				chain_id: 1,
				token_id: '42',
				contract_address: 'invalid',
				name: 'Agent 42',
			}],
			meta: {
				pagination: {
					page: 3,
					limit: 20,
					total: 699983,
					hasMore: true,
				},
			},
		}
		sourceGetJson.mockResolvedValueOnce(response)

		await expect(fetchAgentList(
			{
				limit: 20,
				page: 3,
			}
		)).resolves.toBe(response)
		expect(sourceGetJson).toHaveBeenCalledWith(
			binding,
			'https://8004scan.test/api/v1/public/agents?limit=20&page=3'
		)
	})

	it('propagates HTTP failures from sourceGetJson', async () => {
		sourceGetJson.mockRejectedValueOnce(new Error('Eip8004Scan_Rest: 404 Not Found'))
		await expect(fetchAgentDetail(
			{
				chainId: 1,
				tokenId: 'missing',
			}
		)).rejects.toThrow('Eip8004Scan_Rest: 404 Not Found')

		sourceGetJson.mockRejectedValueOnce(new Error('Eip8004Scan_Rest: 502 Bad Gateway'))
		await expect(fetchAgentList()).rejects.toThrow('Eip8004Scan_Rest: 502 Bad Gateway')
	})
})
