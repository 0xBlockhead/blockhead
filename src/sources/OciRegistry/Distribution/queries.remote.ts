import { query } from '$app/server'
import { type } from 'arktype'

import { getManifest } from '$/sources/OciRegistry/Distribution/queries.ts'


const manifestIdentity = type({
	registry: 'string',
	repository: 'string',
	reference: 'string',
})

export const getManifestRemote = query(manifestIdentity, getManifest)
