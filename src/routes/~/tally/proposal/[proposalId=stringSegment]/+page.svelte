<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.TallyProposal, data.selector, {
		sources: [
			Source.Tally,
		],
		fields: {
			title: true,
			onchainId: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import TallyProposalView from '$/views/TallyProposalView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.proposalId ?? '') || 'Tally proposal' : (pageSelection.entity.title ?? '') || [(pageSelection.entity.onchainId ? 'Proposal ' + pageSelection.entity.onchainId : ''), pageSelection.entitySelector.proposalId].filter(Boolean).join(' ') || 'Tally proposal')} • Tally proposal • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Tally proposal'} • Tally proposal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<TallyProposalView
		selection={pageSelection}
	/>
	{/if}
</Page>
