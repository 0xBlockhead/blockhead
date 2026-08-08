import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
import bindings from '$/sources/AvalancheInfo/bindings.ts'
import { Source } from '$/sources/Source.ts'

const jsonRpc2 = vi.hoisted(() => vi.fn())

vi.mock('$/sources/_shared/wire/JsonRpc2/client.ts', () => ({
	jsonRpc2,
}))

const {
	getNetworkName,
	getNodeVersion,
	getPeers,
} = await import('$/sources/AvalancheInfo/JsonRpc/queries.ts')

const binding = bindings[Source.AvalancheInfo_JsonRpc][0]

beforeEach(() => {
	jsonRpc2.mockReset()
})

it('passes only the caller-provided noncanonical binding to JSON-RPC', async () => {
	const modifiedBinding = {
		...binding,
		endpoints: binding.endpoints.map((endpoint) => ({
			...endpoint,
			locator: 'https://noncanonical.example/info',
		})),
	}
	jsonRpc2.mockResolvedValueOnce({ networkName: 'mainnet' })

	await getNetworkName(modifiedBinding)

	expect(jsonRpc2).toHaveBeenCalledOnce()
	expect(jsonRpc2.mock.calls[0][0]).toBe(modifiedBinding)
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
				observedUptime: '0',
				lastSent: '2026-08-07T00:15:11Z',
				supportedACPs: [23],
			}],
		})

	await expect(getNetworkName(binding)).resolves.toEqual({
		networkName: 'mainnet',
	})
	await expect(getNodeVersion(binding)).resolves.toEqual({
		version: 'avalanchego/1.14.2',
		databaseVersion: 'v1.4.5',
		rpcProtocolVersion: '45',
		gitCommit: 'abc',
		vmVersions: {
			platform: 'avalanchego/1.14.2',
		},
	})
	await expect(getPeers(binding)).resolves.toMatchObject({
		numPeers: '2',
		peers: [{
			ip: '1.2.3.4:9651',
			nodeID: 'NodeID-a',
			version: 'avalanchego/1.14.2',
			observedUptime: '0',
			lastSent: '2026-08-07T00:15:11Z',
			supportedACPs: [23],
		}],
	})
	expect(jsonRpc2.mock.calls.map(([, method]) => method)).toEqual([
		'info.getNetworkName',
		'info.getNodeVersion',
		'info.peers',
	])
	expect(jsonRpc2.mock.calls.map(([passedBinding]) => passedBinding)).toEqual([
		binding,
		binding,
		binding,
	])
})

it('fail-closes malformed Info envelopes', async () => {
	jsonRpc2.mockResolvedValueOnce({
		version: 'avalanchego/1.14.2',
	})

	await expect(getNodeVersion(binding)).rejects.toThrow('invalid node version response envelope')
})

it('accepts live Info peer optional clocks and fail-closes missing peer identity', async () => {
	jsonRpc2.mockResolvedValueOnce({
		numPeers: '1',
		peers: [{
			ip: '34.250.50.224:9651',
			publicIP: '34.250.50.224:9651',
			nodeID: 'NodeID-Dw7tuwxpAmcpvVGp9JzaHAR3REPoJ8f2R',
			version: 'avalanchego/1.14.2',
			observedUptime: 0,
			trackedSubnets: [],
			benched: [],
			lastReceived: '2026-08-07T00:15:08Z',
			lastSent: '2026-08-07T00:15:11Z',
			upgradeTime: 1763568000,
			objectedACPs: [],
			supportedACPs: [],
		}],
	})
	await expect(getPeers(binding)).resolves.toMatchObject({
		numPeers: '1',
	})

	jsonRpc2.mockResolvedValueOnce({
		numPeers: '1',
		peers: [{
			ip: '1.2.3.4:9651',
			version: 'avalanchego/1.14.2',
		}],
	})
	await expect(getPeers(binding)).rejects.toThrow('invalid peers response envelope')
})
