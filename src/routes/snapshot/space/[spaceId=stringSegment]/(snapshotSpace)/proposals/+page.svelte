<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotProposalsView from '$/views/SnapshotProposalsView.svelte'
</script>


<svelte:head>
	<title>Space proposals • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.SnapshotSpace, {
		spaceId: decodeURIComponent(params.spaceId),
	})
		.$$proposals({
			sources: [
				Source.SnapshotHub_Graphql,
			],
		})}

	<SnapshotProposalsView
		href={
			resolve(
				'/snapshot/space/[spaceId=stringSegment]/(snapshotSpace)/proposals',
				{
					spaceId: params.spaceId,
				}
			)
		}
		title='Space proposals'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='proposals'
	/>
</Page>
