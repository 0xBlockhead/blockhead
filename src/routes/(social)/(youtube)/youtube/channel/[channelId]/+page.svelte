<script lang="ts">
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
	/>
</Page>
