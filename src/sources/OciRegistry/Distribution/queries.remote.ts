import { query } from '$app/server'
import { type } from 'arktype'

import {
	getManifest,
	getReferrers,
} from '$/sources/OciRegistry/Distribution/queries.ts'


const manifestIdentity = type({
	registry: 'string',
	repository: 'string',
	reference: 'string',
})

export const getManifestRemote = query(manifestIdentity, getManifest)

const referrersIdentity = type({
	registry: 'string',
	repository: 'string',
	digest: 'string',
	limit: 'number.integer >= 0 <= 1000',
})

export const getReferrersRemote = query(referrersIdentity, getReferrers)
