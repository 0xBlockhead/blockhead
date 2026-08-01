<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import {
		proposalCategoryById,
		proposalCategoryBySlug,
		specificationRealmById,
		specificationRealmBySlug,
	} from '$/constants/SpecificationProposal.ts'
	import specificationProposalSources from '$/sources/specificationProposalSources.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageEntitySelector = $derived({
		realm: specificationRealmBySlug[params.specificationRealmSlug].id,
		category: proposalCategoryBySlug[params.proposalKindSlug].id,
		number: Number(params.proposalRef.slice(params.proposalRef.lastIndexOf('-') + 1)),
	})
	const pageSelection = $derived(select(EntityType.SpecificationProposal, pageEntitySelector, {
		sources: specificationProposalSources({
			realm: pageEntitySelector.realm,
			category: pageEntitySelector.category,
		}),
		fields: {
			documentTitle: true,
			documentCategory: true,
			documentStatus: true,
			documentBody: true,
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
