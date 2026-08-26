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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SnapshotVote, {
		voteId: decodeURIComponent(params.voteId),
	}, {
		sources: [
			Source.SnapshotHub_Graphql,
		],
		fields: {
			voter: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotVoteView from '$/views/SnapshotVoteView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Snapshot vote' : pageSelection.entity.voter || 'Snapshot vote'} • Snapshot vote • Blockhead</title>
</svelte:head>


<Page>
	<SnapshotVoteView
		selection={pageSelection}
	/>
</Page>
