<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='observed-channels'
	/>
</Page>
