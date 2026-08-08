/**
 * Amboss public Lightning GraphQL wire shapes (fail-closed arktype envelopes).
 * @see https://api.amboss.space/graphql
 */

import { type as arktype } from 'arktype'


const nonEmptyString = arktype('string > 0')
const unsignedSafe = arktype(`number.integer >= 0 <= ${Number.MAX_SAFE_INTEGER}`)
const losslessUnsigned = (
	unsignedSafe
		.or(arktype('/^(0|[1-9][0-9]*)$/'))
)
const compressedPublicKey = arktype('/^(02|03)[0-9a-f]{64}$/')
const channelId = arktype('/^(0|[1-9][0-9]*)(x[0-9]+x[0-9]+)?$/')
const channelFundingPoint = arktype('/^[^:\\s]+:(0|[1-9][0-9]*)$/')
const channelLastUpdateWire = (
	unsignedSafe
		.or(arktype('/^(0|[1-9][0-9]*)$/'))
		.or(nonEmptyString)
)

const ambossIpInfoWire = arktype({
	city: 'string',
	country_code: 'string',
})

const ambossNodeAddressWire = arktype({
	addr: nonEmptyString,
	'ip_info?': ambossIpInfoWire.or(arktype('null')),
})

const ambossGraphNodeWire = arktype({
	pub_key: compressedPublicKey,
	alias: 'string',
	color: 'string',
	last_update: unsignedSafe,
	addresses: ambossNodeAddressWire.array(),
})

const ambossNodeChannelsSummaryWire = arktype({
	num_channels: unsignedSafe,
	total_capacity: losslessUnsigned,
})

export const ambossGetNodeDataWire = arktype({
	'getNode?': arktype({
		graph_info: {
			'node?': ambossGraphNodeWire.or(arktype('null')),
			'channels?': ambossNodeChannelsSummaryWire.or(arktype('null')),
		},
	}).or(arktype('null')),
})

export type AmbossGetNodeData = typeof ambossGetNodeDataWire.infer

const ambossEdgePolicyWire = arktype({
	fee_rate_milli_msat: losslessUnsigned,
	disabled: 'boolean',
})

const ambossClosedEdgeWire = arktype({
	'close_transaction_id?': nonEmptyString.or(arktype('null')),
	closed_date: nonEmptyString,
	closed_height: unsignedSafe,
	'closure_type?': arktype('string').or(arktype('null')),
})

const ambossCloseTransactionWire = arktype({
	id: nonEmptyString,
	'fee?': losslessUnsigned.or(arktype('null')),
})

const ambossEdgeInfoWire = arktype({
	capacity: losslessUnsigned,
	is_closed: 'boolean',
	last_update: channelLastUpdateWire,
	chan_point: channelFundingPoint,
	node1_pub: compressedPublicKey,
	node2_pub: compressedPublicKey,
	'node1_policy?': ambossEdgePolicyWire.or(arktype('null')),
	'node2_policy?': ambossEdgePolicyWire.or(arktype('null')),
	'closed_info?': ambossClosedEdgeWire.or(arktype('null')),
	transactions: {
		'close_transaction?': ambossCloseTransactionWire.or(arktype('null')),
	},
})

export const ambossGetEdgeDataWire = arktype({
	'getEdge?': arktype({
		long_channel_id: channelId,
		short_channel_id: channelId,
		'graph?': arktype({
			info: ambossEdgeInfoWire,
		}).or(arktype('null')),
	}).or(arktype('null')),
})

export type AmbossGetEdgeData = typeof ambossGetEdgeDataWire.infer

const ambossChannelListRowWire = arktype({
	long_channel_id: channelId,
	short_channel_id: channelId,
	chan_point: channelFundingPoint,
	capacity: losslessUnsigned,
	last_update: unsignedSafe,
	node1_pub: compressedPublicKey,
	node2_pub: compressedPublicKey,
	'node1_policy?': ambossEdgePolicyWire.or(arktype('null')),
	'node2_policy?': ambossEdgePolicyWire.or(arktype('null')),
})

export const ambossGetNodeChannelsDataWire = arktype({
	'getNode?': arktype({
		graph_info: {
			'channels?': arktype({
				num_channels: unsignedSafe,
				channel_list: {
					list: ambossChannelListRowWire.array(),
					pagination: {
						limit: unsignedSafe,
						offset: unsignedSafe,
					},
				},
			}).or(arktype('null')),
		},
	}).or(arktype('null')),
})

export type AmbossGetNodeChannelsData = typeof ambossGetNodeChannelsDataWire.infer

export const ambossGetPopularNodesDataWire = arktype({
	'getPopularNodes?': compressedPublicKey.array().or(arktype('null')),
})

export type AmbossGetPopularNodesData = typeof ambossGetPopularNodesDataWire.infer

export const parseAmbossChannelFundingPoint = (
	chanPoint: string
) => {
	const separatorIndex = chanPoint.indexOf(':')
	const outputIndex = chanPoint.slice(separatorIndex + 1)
	if (
		separatorIndex <= 0
		|| !/^(0|[1-9][0-9]*)$/.test(outputIndex)
	)
		throw new Error('Amboss_Graphql: invalid channel funding point')

	return {
		fundingTransactionId: chanPoint.slice(0, separatorIndex),
		fundingOutputIndex: Number(outputIndex),
	}
}
