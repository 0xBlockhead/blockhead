<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	let {
		params,
	} = $props()

	const entityId = $derived(
		{ channelId: decodeURIComponent(params.channelId) },
	)


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubeVideosView from '$/views/YouTubeVideosView.svelte'
</script>


<Page>
	<YouTubeVideosView
		entityFieldReference={{
			entityType: EntityType.YouTubeChannel,
			entityId,
			fieldName: '$$videos',
		}}
		href={resolve('/(social)/(youtube)/youtube/channel/[channelId]/(channel)/videos', {
			channelId: encodeURIComponent(entityId.channelId),
		})}
		id="youtube-channel-videos"
	/>
</Page>
