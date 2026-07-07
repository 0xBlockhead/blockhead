<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { specificationRealmBySlug, proposalCategoryBySlug } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


<Page>
	<SpecificationProposalKindView
		href={
			resolve('/(explore)/(proposals)/proposals/[specificationRealmSlug=specificationRealmSlug]/(specificationRealm)/[proposalKindSlug=proposalKindSlug]', {
				specificationRealmSlug: params.specificationRealmSlug,
				proposalKindSlug: params.proposalKindSlug,
			})
		}
		selection={
			select(EntityType.SpecificationProposalKind, {
				realm: specificationRealmBySlug[params.specificationRealmSlug].id,
				category: proposalCategoryBySlug[params.proposalKindSlug].id,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					labelPlural: true,
					label: true,
					slug: true,
					$specificationRealm: true,
				},
			})
		}
	/>
</Page>
