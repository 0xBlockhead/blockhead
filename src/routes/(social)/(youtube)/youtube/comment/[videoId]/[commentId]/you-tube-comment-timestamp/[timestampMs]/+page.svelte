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
	import YouTubeComment_TimestampView from '$/views/YouTubeComment_TimestampView.svelte'
</script>


<Page>
	<YouTubeComment_TimestampView
		selection={select(EntityType.YouTubeComment_Timestamp, data.selector)}
	/>
</Page>
