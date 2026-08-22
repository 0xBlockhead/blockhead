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

	const pageSelection = $derived(select(EntityType.SnapshotProposal, data.selector, {
		sources: [
			Source.SnapshotHub_Graphql,
		],
		fields: {
			title: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotProposalView from '$/views/SnapshotProposalView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.proposalId ?? '') || 'Snapshot proposal' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.proposalId || 'Snapshot proposal')} • Snapshot proposal • Blockhead</title>
</svelte:head>


<Page>
	<SnapshotProposalView
		selection={pageSelection}
	/>
</Page>
