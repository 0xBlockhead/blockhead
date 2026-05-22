<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeChannelsView from '$/views/YouTubeChannelsView.svelte'
</script>


<Page>
	<YouTubeChannelsView
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubeChannels',
		}}
		href={resolve('/youtube/channels')}
		id="youtube-channels"
	/>
</Page>
