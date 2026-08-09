// Generated from APP.ts.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import _GlobalEvmAbiCatalogSchema from '$/schema/_GlobalEvmAbiCatalog.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	const globalEvmAbiCatalogScopeSelector = parseEntitySelector(
		schema,
		_GlobalEvmAbiCatalogSchema,
		{
			scope: 'global',
		},
		'Scope'
	)
	if (globalEvmAbiCatalogScopeSelector instanceof arktype.errors)
		error(404, 'Invalid _GlobalEvmAbiCatalog selector')

	return {
		selector: globalEvmAbiCatalogScopeSelector,
	}
}
