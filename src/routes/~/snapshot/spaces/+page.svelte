<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import SnapshotSpacesView from '$/views/SnapshotSpacesView.svelte'
</script>


<svelte:head>
	<title>Snapshot spaces • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$snapshotSpaces',
	})
		.$$snapshotSpaces({
			sources: [
				Source.SnapshotHub_Graphql,
			],
		})}

	<SnapshotSpacesView
		href={resolve('/~/snapshot/spaces')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='snapshot-spaces'
	/>
</Page>
