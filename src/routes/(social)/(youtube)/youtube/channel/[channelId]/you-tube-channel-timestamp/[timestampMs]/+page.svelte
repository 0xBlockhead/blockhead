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
	import YouTubeChannel_TimestampView from '$/views/YouTubeChannel_TimestampView.svelte'
</script>


<Page>
	<YouTubeChannel_TimestampView
		selection={select(EntityType.YouTubeChannel_Timestamp, data.selector)}
	/>
</Page>
