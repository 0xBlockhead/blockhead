<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotProposalView from '$/views/SnapshotProposalView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SnapshotProposal, data.selector, {
				sources: [
					Source.SnapshotHub_Graphql,
				],
				fields: {
					title: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.proposalId ?? '') || 'Snapshot proposal' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.proposalId || 'Snapshot proposal')} • Snapshot proposal • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Snapshot proposal'} • Snapshot proposal • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.SnapshotProposal, data.selector, {
				sources: [
					Source.SnapshotHub_Graphql,
				],
				fields: {
					title: true,
				},
			})}

	<SnapshotProposalView
		selection={pageSelection}
	/>
	{/if}
</Page>
