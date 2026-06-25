<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeChannelsView from '$/views/YouTubeChannelsView.svelte'
</script>


<Page>
	<YouTubeChannelsView
		href={resolve('/youtube/channels')}
		selection={select(
			EntityType.YouTubeNetwork,
			{ scope: 'YouTubeNetwork' }
		).$$youtubeChannels}
		id="youtube-channels"
	/>
</Page>
