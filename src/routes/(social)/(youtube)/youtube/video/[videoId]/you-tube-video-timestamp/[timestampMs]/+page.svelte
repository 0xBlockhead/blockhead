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
	import YouTubeVideo_TimestampView from '$/views/YouTubeVideo_TimestampView.svelte'
</script>


<Page>
	<YouTubeVideo_TimestampView
		selection={select(EntityType.YouTubeVideo_Timestamp, data.selector)}
	/>
</Page>
