<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YouTubePlaylist_TimestampView from '$/views/YouTubePlaylist_TimestampView.svelte'
</script>


<Page>
	<YouTubePlaylist_TimestampView
		selection={select(EntityType.YouTubePlaylist_Timestamp, data.selector)}
	/>
</Page>
