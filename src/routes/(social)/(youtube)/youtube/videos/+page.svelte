<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeVideosView from '$/views/YoutubeVideosView.svelte'
</script>


<svelte:head>
	<title>YouTube Videos • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeVideosView
		href={resolve('/(social)/(youtube)/youtube/videos')}
		title='YouTube Videos'
		selection={
			select(EntityType._GlobalYoutubeNetwork, {
				scope: '_GlobalYoutubeNetwork',
			})[EntityProxyField]<EntityType.YoutubeVideo>('$$observedVideos', {
				sources: [
					Source.Constants_Internal,
					Source.Youtube_Rest,
				],
			})
		}
		id='observed-videos'
	/>
</Page>
