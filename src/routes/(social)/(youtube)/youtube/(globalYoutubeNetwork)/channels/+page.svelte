<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
</script>


<svelte:head>
	<title>YouTube channels • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType._GlobalYoutubeNetwork, {
		scope: '_GlobalYoutubeNetwork',
	}).$$observedChannels}

	<YoutubeChannelsView
		href={resolve('/(social)/(youtube)/youtube/(globalYoutubeNetwork)/channels')}
		title='YouTube channels'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
