<script lang="ts">
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
		entityFieldReference={{
			entityType: EntityType.YouTubeNetwork,
			entityId: { scope: 'YouTubeNetwork' },
			fieldName: '$$youtubeChannels',
		}}
		id="youtube-channels"
	/>
</Page>
