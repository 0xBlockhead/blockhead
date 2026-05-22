<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ channelId: decodeURIComponent(params.channelId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<Page>
	<YouTubeChannelView
		{entityId}
		href={resolve(
			'/(social)/(youtube)/youtube/channel/[channelId]',
			{ channelId: encodeURIComponent(entityId.channelId) },
		)}
	/>
</Page>
