import { error } from '@sveltejs/kit'

import { type as arktype } from 'arktype'

import { parseEntitySelector } from '$/schema/$schema.ts'
import EntitySchema from '$/schema/AiArtifactAttestation.ts'
import { schema } from '$/schema/index.ts'

import type { PageLoad } from './$types.ts'


export const load: PageLoad = ({ params }) => {
	const selector = parseEntitySelector(
		schema,
		EntitySchema,
		{
			'$artifact': {
				ociDigest: decodeURIComponent(params.ociDigest),
			},
			attestationKind: decodeURIComponent(params.attestationKind),
			signatureHashAlgorithm: decodeURIComponent(params.signatureHashAlgorithm),
			signatureHash: decodeURIComponent(params.signatureHash),
		}
	)
	if (selector instanceof arktype.errors) error(404, 'Invalid AiArtifactAttestation selector')

	return { selector }
}
