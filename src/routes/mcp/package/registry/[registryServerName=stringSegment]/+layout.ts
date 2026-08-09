// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { match as matchStringSegment } from '$/params/stringSegment.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import McpServerPackageSchema from '$/schema/McpServerPackage.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchStringSegment(params.registryServerName)))
		error(404, 'Route mapping not applicable')

	const mcpServerPackageRegistryServerNameSelector = parseEntitySelector(
		schema,
		McpServerPackageSchema,
		{
			registryServerName: params.registryServerName,
		},
		'RegistryServerName'
	)
	if (mcpServerPackageRegistryServerNameSelector instanceof arktype.errors)
		error(404, 'Invalid McpServerPackage selector')

	return {
		selector: mcpServerPackageRegistryServerNameSelector,
	}
}
