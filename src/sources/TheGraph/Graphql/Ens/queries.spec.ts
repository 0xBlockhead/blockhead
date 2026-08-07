import {
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

const queryTheGraph = vi.fn()

vi.mock('$/sources/TheGraph/Graphql/client.ts', () => ({
	queryTheGraph,
}))

const { getName } = await import('$/sources/TheGraph/Graphql/Ens/queries.ts')

const publicEnv = {
	PUBLIC_THEGRAPH_API_KEY: 'test',
}

const domain = {
	id: '0xdomain',
	name: 'vitalik.eth',
	labelName: 'vitalik',
	labelhash: '0xlabel',
	parent: {
		id: '0xparent',
		name: 'eth',
	},
	subdomains: [],
	resolvedAddress: {
		id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
	},
	owner: {
		id: '0x000000000000000000000000000000000000dead',
	},
	registrant: null,
	wrappedOwner: null,
	wrappedDomain: null,
	registration: null,
	resolver: {
		id: '0xresolverid',
		address: '0x0000000000000000000000000000000000000001',
		addr: null,
		contentHash: null,
		texts: ['url'],
		coinTypes: ['60'],
	},
	ttl: '300',
	isMigrated: true,
	createdAt: '1700000000',
	expiryDate: '1800000000',
	subdomainCount: 0,
}

beforeEach(() => {
	vi.clearAllMocks()
})

describe('TheGraph ENS GraphQL tip event hydration', () => {
	it('hydrates ordered root text/coin/addr tip events onto getName domains', async () => {
		queryTheGraph
			.mockResolvedValueOnce({
				domains: [domain],
			})
			.mockResolvedValueOnce({
				textChangeds: [{
					__typename: 'TextChanged',
					blockNumber: 200,
					key: 'url',
					value: 'https://vitalik.ca',
				}],
				multicoinAddrChangeds: [{
					__typename: 'MulticoinAddrChanged',
					blockNumber: 201,
					coinType: '60',
					addr: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
				}],
				addrChangeds: [{
					__typename: 'AddrChanged',
					blockNumber: 150,
					addr: {
						id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
					},
				}],
			})

		await expect(getName({
			publicEnv,
			name: 'vitalik.eth',
		})).resolves.toEqual([{
			...domain,
			resolver: {
				...domain.resolver,
				events: [
					{
						__typename: 'TextChanged',
						blockNumber: 200,
						key: 'url',
						value: 'https://vitalik.ca',
					},
					{
						__typename: 'MulticoinAddrChanged',
						blockNumber: 201,
						coinType: '60',
						addr: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
					},
					{
						__typename: 'AddrChanged',
						blockNumber: 150,
						addr: {
							id: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
						},
					},
				],
			},
		}])

		expect(queryTheGraph.mock.calls[1]?.[0].variables).toEqual({
			resolver: '0xresolverid',
			first: 1000,
		})
	})

	it('skips tip-event hydration when the domain has no resolver', async () => {
		queryTheGraph.mockResolvedValueOnce({
			domains: [{
				...domain,
				resolver: null,
			}],
		})

		await expect(getName({
			publicEnv,
			name: 'vitalik.eth',
		})).resolves.toEqual([{
			...domain,
			resolver: null,
		}])
		expect(queryTheGraph).toHaveBeenCalledTimes(1)
	})
})
