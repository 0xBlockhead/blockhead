import { beforeEach, describe, expect, it, vi } from 'vitest'

const getJson = vi.hoisted(() => vi.fn())

vi.mock('$/lib/http.ts', () => ({
	getJson,
}))

const { fetchAgentDetail } = await import('$/sources/Eip8004Scan/Rest/queries.ts')

describe('EIP-8004 Scan detail normalization', () => {
	beforeEach(() => {
		getJson.mockReset()
	})

	it('preserves typed service metadata and drops unusable service rows', async () => {
		vi.spyOn(Date, 'now').mockReturnValueOnce(1_720_000_000_000)
		getJson.mockResolvedValueOnce({
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
		})

		await expect(fetchAgentDetail({
			chainId: 1,
			tokenId: '42',
		})).resolves.toMatchObject({
			agentUri: 'https://agents.example/42.json',
			fetchedAt: 1_720_000_000_000,
			services: [{
				endpointKind: 'a2a',
				endpointUrl: 'https://agents.example/a2a',
				name: 'Trading agent',
				version: '1.2.0',
				protocolKind: 'https',
				active: false,
			}],
		})
	})

	it('does not materialize detail without canonical registration identity and URI', async () => {
		getJson
			.mockResolvedValueOnce({
				data: {
					chain_id: 1,
					token_id: '42',
					contract_address: 'invalid',
					raw_metadata: {
						offchain_uri: 'https://agents.example/42.json',
					},
				},
			})
			.mockResolvedValueOnce({
				data: {
					chain_id: 1,
					token_id: '42',
					contract_address: '0x1234567890abcdef1234567890abcdef12345678',
				},
			})

		await expect(fetchAgentDetail({
			chainId: 1,
			tokenId: '42',
		})).resolves.toBeUndefined()
		await expect(fetchAgentDetail({
			chainId: 1,
			tokenId: '42',
		})).resolves.toBeUndefined()
	})
})
