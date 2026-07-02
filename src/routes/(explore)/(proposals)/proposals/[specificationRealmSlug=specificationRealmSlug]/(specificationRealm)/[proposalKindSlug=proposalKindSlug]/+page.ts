// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { proposalCategoryBySlug, specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SpecificationProposalKindSchema from '$/schema/SpecificationProposalKind.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const specificationProposalKindSelector = parseEntitySelector(
		schema,
		SpecificationProposalKindSchema,
		{
			realm: specificationRealmBySlug[params.specificationRealmSlug].id,
			category: proposalCategoryBySlug[params.proposalKindSlug].id,
		}
	)
	if (specificationProposalKindSelector instanceof arktype.errors) error(404, 'Invalid SpecificationProposalKind selector')

	return {
		selector: specificationProposalKindSelector,
		title: proposalCategoryBySlug[params.proposalKindSlug].labelPlural,
	}
}
