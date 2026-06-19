<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(EntityType.YouTubeChannel, { channelId: decodeURIComponent(params.channelId) })}
	/>
</Page>
