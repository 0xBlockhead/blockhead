// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SpecificationRealmSchema from '$/schema/SpecificationRealm.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const specificationRealmSelector = parseEntitySelector(
		schema,
		SpecificationRealmSchema,
		{
			realm: specificationRealmBySlug[params.specificationRealmSlug].id,
		}
	)
	if (specificationRealmSelector instanceof arktype.errors) error(404, 'Invalid SpecificationRealm selector')

	return {
		selector: specificationRealmSelector,
	}
}
