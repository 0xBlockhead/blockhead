// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
import { match as matchSpecificationRealmSlug } from '$/params/specificationRealmSlug.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import { SpecificationRealm as SpecificationRealmSchema } from '$/schema/SpecificationRealm.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchSpecificationRealmSlug(params.specificationRealmSlug))) error(404, 'Route mapping not applicable')

	const specificationRealmRealmSelector = parseEntitySelector(
		schema,
		SpecificationRealmSchema,
		{
			realm: specificationRealmBySlug[params.specificationRealmSlug].id,
		}
	)
	if (specificationRealmRealmSelector instanceof arktype.errors) error(404, 'Invalid SpecificationRealm selector')

	return {
		selector: specificationRealmRealmSelector,
	}
}
