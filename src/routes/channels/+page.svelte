<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadStateChannelsView from '$/views/BlockheadStateChannelsView.svelte'
</script>


<svelte:head>
	<title>Channels • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._Global, {
		scope: '$$blockheadStateChannels',
	}).$$blockheadStateChannels}

	<BlockheadStateChannelsView
		href={resolve('/channels')}
		title='Channels'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='blockhead-state-channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
