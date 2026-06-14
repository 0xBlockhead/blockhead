<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<Page>
	<YouTubeChannelView
		selector={{ channelId: decodeURIComponent(params.channelId) }}
	/>
</Page>
