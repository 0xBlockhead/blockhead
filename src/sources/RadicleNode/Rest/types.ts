import { type as arktype } from 'arktype'

export type RadicleNodeConnectPeer = {
	nodeId: string
	address: string
}

const nonEmptyString = arktype('string > 0')
const nonNegativeInteger = arktype('number.integer >= 0')

export const radicleNodeEnvelope = arktype({
	id: nonEmptyString,
	'agent?': nonEmptyString,
	state: nonEmptyString,
	config: {
		'alias?': nonEmptyString,
		'listen?': nonEmptyString.array(),
		'peers?': {
			'type?': nonEmptyString,
		},
		'connect?': nonEmptyString.array(),
		'externalAddresses?': nonEmptyString.array(),
	},
})

export const radicleStatsEnvelope = arktype({
	repos: {
		total: nonNegativeInteger,
	},
})

export const radicleRepoEnvelope = arktype({
	rid: nonEmptyString,
})

export const radicleReposEnvelope = radicleRepoEnvelope.array()

export type RadicleNodeWire = typeof radicleNodeEnvelope.infer
export type RadicleStatsWire = typeof radicleStatsEnvelope.infer
export type RadicleRepoWire = typeof radicleRepoEnvelope.infer
