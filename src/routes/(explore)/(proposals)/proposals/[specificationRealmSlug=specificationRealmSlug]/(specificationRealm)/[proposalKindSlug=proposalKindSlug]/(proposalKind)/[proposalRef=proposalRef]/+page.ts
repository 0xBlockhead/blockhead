// Generated from APP.ts. Do not edit by hand.

import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'
import { proposalCategoryBySlug, specificationRealmBySlug } from '$/constants/SpecificationProposal.ts'
import { parseEntitySelector } from '$/schema/$schema.ts'
import { schema } from '$/schema/index.ts'
import SpecificationProposalSchema from '$/schema/SpecificationProposal.ts'
import { type as arktype } from 'arktype'

export const load: PageLoad = ({ params }) => {
	const specificationProposalSelector = parseEntitySelector(
		schema,
		SpecificationProposalSchema,
		{
			realm: specificationRealmBySlug[params.specificationRealmSlug].id,
			category: proposalCategoryBySlug[params.proposalKindSlug].id,
			number: Number(params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)),
		}
	)
	if (specificationProposalSelector instanceof arktype.errors) error(404, 'Invalid SpecificationProposal selector')

	return {
		selector: specificationProposalSelector,
	}
}
