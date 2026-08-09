import type { SourceBinding } from '$/sources/SourceBinding.ts'
import bindings from '$/sources/AvalancheInfo/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import type {
	AvalancheInfoNetworkId,
	AvalancheInfoNetworkName,
	AvalancheInfoNodeId,
	AvalancheInfoNodeVersion,
	AvalancheInfoPeers,
	AvalancheInfoUptime,
} from '$/sources/AvalancheInfo/JsonRpc/types.ts'
import { type as arktype } from 'arktype'


const networkIdWire = arktype({
	networkID: 'string | number.integer',
})

const networkNameWire = arktype({
	networkName: 'string',
})

const nodeIdWire = arktype({
	nodeID: 'string',
	'nodePOP?': {
		publicKey: 'string',
		proofOfPossession: 'string',
	},
})

const nodeVersionWire = arktype({
	version: 'string',
	databaseVersion: 'string',
	rpcProtocolVersion: 'string',
	gitCommit: 'string',
	vmVersions: 'Record<string, string>',
})

const peersWire = arktype({
	numPeers: 'string',
	peers: arktype({
		ip: 'string',
		'publicIP?': 'string',
		nodeID: 'string',
		version: 'string',
		'observedUptime?': 'string | number',
		'trackedSubnets?': 'string[]',
		'benched?': 'string[]',
		'lastReceived?': 'string',
		'lastSent?': 'string',
		'upgradeTime?': 'number.integer | string',
		'objectedACPs?': 'unknown[]',
		'supportedACPs?': 'unknown[]',
	}).array(),
})

const uptimeWire = arktype({
	rewardingStakePercentage: 'string',
	weightedAveragePercentage: 'string',
})

const binding = bindings[Source.AvalancheInfo_JsonRpc][0]

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.AvalancheInfo_JsonRpc}: invalid ${label} response envelope`)
	}
}

const request = async <_Result>(
	binding: SourceBinding, method: string,
	params?: Readonly<Record<string, unknown>> | readonly unknown[]
) => (
	jsonRpc2<_Result>(binding, method, params)
)

export const getNetworkId = async () => (
	assertEnvelope(
		'network id',
		networkIdWire,
		await request<unknown>(binding, 'info.getNetworkID')
	)
)

export const getNetworkName = async () => (
	assertEnvelope(
		'network name',
		networkNameWire,
		await request<unknown>(binding, 'info.getNetworkName')
	)
)

export const getNodeId = async () => (
	assertEnvelope(
		'node id',
		nodeIdWire,
		await request<unknown>(binding, 'info.getNodeID')
	)
)

export const getNodeVersion = async () => (
	assertEnvelope(
		'node version',
		nodeVersionWire,
		await request<unknown>(binding, 'info.getNodeVersion')
	)
)

export const getPeers = async () => (
	assertEnvelope(
		'peers',
		peersWire,
		await request<unknown>(binding, 'info.peers')
	)
)

export const getUptime = async () => (
	assertEnvelope(
		'uptime',
		uptimeWire,
		await request<unknown>(binding, 'info.uptime')
	)
)
