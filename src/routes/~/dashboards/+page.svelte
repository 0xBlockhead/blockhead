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
	import BlockheadPanelTreesView from '$/views/BlockheadPanelTreesView.svelte'
</script>


<svelte:head>
	<title>Dashboards • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadPanelTrees',
	})
		.$$blockheadPanelTrees({
			sources: [
				Source.Local_Internal,
			],
		})}

	<BlockheadPanelTreesView
		href={resolve('/~/dashboards')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-panel-trees'
	/>
</Page>
