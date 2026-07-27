// Generated from APP.ts. Do not edit by hand.

import type { LayoutLoad } from './$types'
import { error } from '@sveltejs/kit'
import { proposalCategoryBySlug, specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
import { match as matchProposalKindSlug } from '$/params/proposalKindSlug.ts'
import { match as matchSpecificationRealmSlug } from '$/params/specificationRealmSlug.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SpecificationProposalKindSchema from '$/schema/SpecificationProposalKind.ts'
import { type as arktype } from 'arktype'

export const load: LayoutLoad = ({ params }) => {
	if (!(matchSpecificationRealmSlug(params.specificationRealmSlug) && matchProposalKindSlug(params.proposalKindSlug))) error(404, 'Route mapping not applicable')

	const specificationProposalKindRealmCategorySelector = parseEntitySelector(
		schema,
		SpecificationProposalKindSchema,
		{
			realm: specificationRealmBySlug[params.specificationRealmSlug].id,
			category: proposalCategoryBySlug[params.proposalKindSlug].id,
		}
	)
	if (specificationProposalKindRealmCategorySelector instanceof arktype.errors) error(404, 'Invalid SpecificationProposalKind selector')

	return {
		selector: specificationProposalKindRealmCategorySelector,
		title: proposalCategoryBySlug[params.proposalKindSlug].labelPlural,
	}
}
