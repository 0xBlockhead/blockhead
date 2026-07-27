<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSourcesView from '$/views/BlockheadSourcesView.svelte'
</script>


<svelte:head>
	<title>Sources • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadSources',
	}).$$blockheadSources}

	<BlockheadSourcesView
		href={resolve('/~/manage/sources')}
		title='Sources'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-sources'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
