// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseRouteEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import OciManifestSchema from '$/schema/OciManifest.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.registry) && matchStringSegment(params.repository) && matchStringSegment(params.reference)))
		error(404, 'Route mapping not applicable')

	const ociManifestRegistryRepositoryReferenceSelector = parseRouteEntitySelector(
		schema,
		OciManifestSchema,
		{
			registry: params.registry,
			repository: decodeURIComponent(params.repository),
			reference: decodeURIComponent(params.reference),
		},
		'RegistryRepositoryReference'
	)
	if (ociManifestRegistryRepositoryReferenceSelector instanceof arktype.errors)
		error(404, 'Invalid OciManifest selector')

	return {
		selector: ociManifestRegistryRepositoryReferenceSelector,
	}
}
