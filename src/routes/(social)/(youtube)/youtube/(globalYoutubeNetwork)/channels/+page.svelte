<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeChannelsView from '$/views/YoutubeChannelsView.svelte'
</script>


<svelte:head>
	<title>YouTube channels • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeChannelsView
		href={resolve('/youtube/channels')}
		title='YouTube channels'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			})
				.$$observedChannels({
					sources: [
						Source.Constants_Internal,
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
				})
		}
		countResource={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			})
				.$$observedChannels({
					sources: [
						Source.Constants_Internal,
						Source.Youtube_Rest,
						Source.Piped_Rest,
					],
				}).count
		}
		id='observed-channels'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
