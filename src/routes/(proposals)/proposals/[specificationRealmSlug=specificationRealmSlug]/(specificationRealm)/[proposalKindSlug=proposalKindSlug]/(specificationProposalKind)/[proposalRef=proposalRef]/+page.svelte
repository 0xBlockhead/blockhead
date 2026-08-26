<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import {
		proposalCategoryById,
		proposalCategoryBySlug,
		specificationRealmBySlug,
	} from '$/constants/SpecificationProposal.ts'
	import specificationProposalSources from '$/sources/specificationProposalSources.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const entitySelector = $derived({
		realm: specificationRealmBySlug[params.specificationRealmSlug].id,
		category: proposalCategoryBySlug[params.proposalKindSlug].id,
		number: Number(params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)),
	})
	const pageSelection = $derived(select(EntityType.SpecificationProposal, entitySelector, {
		sources: specificationProposalSources({
			realm: entitySelector.realm,
			category: entitySelector.category,
		}),
		fields: {
			documentTitle: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalView from '$/views/SpecificationProposalView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (
		(
			[
				(proposalCategoryById[pageSelection.entitySelector.category]?.label ?? pageSelection.entitySelector.category ?? ''),
				String(pageSelection.entitySelector.number ?? ''),
			]
				.filter(Boolean)
				.join('-')
		)
		|| 'Specification proposal'
	) : (
		(
			[
				[(proposalCategoryById[pageSelection.entitySelector.category]?.label ?? pageSelection.entitySelector.category) + '-', String(pageSelection.entitySelector.number)].filter(Boolean).join(''),
				(pageSelection.entity.documentTitle ?? ''),
			]
				.filter(Boolean)
				.join(': ')
			|| [
				(proposalCategoryById[pageSelection.entitySelector.category]?.label ?? pageSelection.entitySelector.category),
				String(pageSelection.entitySelector.number),
			]
				.filter(Boolean)
				.join('-')
		)
		|| 'Specification proposal'
	)} • Specification proposal • Blockhead</title>
</svelte:head>


<Page>
	<SpecificationProposalView
		selection={pageSelection}
	/>
</Page>
