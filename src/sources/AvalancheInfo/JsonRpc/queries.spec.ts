import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getNetworkName,
	getNodeVersion,
	getPeers,
} = await import('$/sources/AvalancheInfo/JsonRpc/queries.ts')

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('reads Info network, version, and peer envelopes through the P-Chain Info binding', async () => {
	jsonRpc2
		.mockResolvedValueOnce({
			networkName: 'mainnet',
		})
		.mockResolvedValueOnce({
			version: 'avalanchego/1.14.2',
			databaseVersion: 'v1.4.5',
			rpcProtocolVersion: '45',
			gitCommit: 'abc',
			vmVersions: {
				platform: 'avalanchego/1.14.2',
			},
		})
		.mockResolvedValueOnce({
			numPeers: '2',
			peers: [{
				ip: '1.2.3.4:9651',
				nodeID: 'NodeID-a',
				version: 'avalanchego/1.14.2',
			}],
		})

	await expect(getNetworkName()).resolves.toEqual({
		networkName: 'mainnet',
	})
	await expect(getNodeVersion()).resolves.toEqual({
		version: 'avalanchego/1.14.2',
		databaseVersion: 'v1.4.5',
		rpcProtocolVersion: '45',
		gitCommit: 'abc',
		vmVersions: {
			platform: 'avalanchego/1.14.2',
		},
	})
	await expect(getPeers()).resolves.toMatchObject({
		numPeers: '2',
	})
	expect(jsonRpc2.mock.calls.map(([, method]) => method)).toEqual([
		'info.getNetworkName',
		'info.getNodeVersion',
		'info.peers',
	])
})

it('fail-closes malformed Info envelopes', async () => {
	jsonRpc2.mockResolvedValueOnce({
		version: 'avalanchego/1.14.2',
	})

	await expect(getNodeVersion()).rejects.toThrow('invalid node version response envelope')
})
