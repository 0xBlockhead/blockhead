import { query } from '$app/server'
import { type } from 'arktype'

import {
	getAttestation as getAttestationFromEasScan,
	getAttestationsBySchema as getAttestationsBySchemaFromEasScan,
	getSchema as getSchemaFromEasScan,
} from '$/sources/EasScan/Graphql/queries.ts'

const networkUidInput = type({
	network: 'string > 0',
	uid: 'string > 0',
})

const networkSchemaUidInput = type({
	network: 'string > 0',
	schemaUid: 'string > 0',
})

export const getAttestation = query(
	networkUidInput,
	(input) => getAttestationFromEasScan(input)
)

export const getSchema = query(
	networkSchemaUidInput,
	(input) => getSchemaFromEasScan(input)
)

export const getAttestationsBySchema = query(
	type({
		...networkSchemaUidInput.definition,
		'skip?': 'number',
		'take?': 'number',
	}),
	(input) => getAttestationsBySchemaFromEasScan(input)
)
