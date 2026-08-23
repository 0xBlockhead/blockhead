<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { proposalCategoryById } from '$/constants/SpecificationProposal.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SpecificationProposalKindView from '$/views/SpecificationProposalKindView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SpecificationProposalKind, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					labelPlural: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (proposalCategoryById[pageSelection.entitySelector.category]?.labelPlural ?? pageSelection.entitySelector.category ?? '') || 'Specification proposal kind' : pageSelection.entity.labelPlural || (proposalCategoryById[pageSelection.entitySelector.category]?.labelPlural ?? pageSelection.entitySelector.category) || 'Specification proposal kind')} • Specification proposal kind • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Specification proposal kind'} • Specification proposal kind • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SpecificationProposalKind, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					labelPlural: true,
				},
			})}

	<SpecificationProposalKindView
		selection={pageSelection}
	/>
	{/if}
</Page>
