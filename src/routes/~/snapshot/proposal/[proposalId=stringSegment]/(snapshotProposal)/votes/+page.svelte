<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotVotesView from '$/views/SnapshotVotesView.svelte'
</script>


<svelte:head>
	<title>Proposal votes • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.SnapshotProposal, {
		proposalId: decodeURIComponent(params.proposalId),
	})
		.$$votes({
			sources: [
				Source.SnapshotHub_Graphql,
			],
		})}

	<SnapshotVotesView
		href={
			resolve(
				'/~/snapshot/proposal/[proposalId=stringSegment]/(snapshotProposal)/votes',
				{
					proposalId: params.proposalId,
				}
			)
		}
		title='Proposal votes'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='votes'
	/>
</Page>
