<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CosmosGovernanceProposal, data.selector, {
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CosmosGovernanceProposalView from '$/views/CosmosGovernanceProposalView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Proposal ' + (pageSelection.entitySelector.proposalId ?? '') : [(pageSelection.entity.title ?? ''), 'Proposal ' + pageSelection.entitySelector.proposalId].filter(Boolean).join(' ') || 'Cosmos governance proposal')} • Cosmos governance proposal • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Cosmos governance proposal'} • Cosmos governance proposal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CosmosGovernanceProposalView
		selection={pageSelection}
	/>
	{/if}
</Page>
