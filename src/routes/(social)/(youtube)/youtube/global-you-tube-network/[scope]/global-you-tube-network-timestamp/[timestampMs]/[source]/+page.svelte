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
	import GlobalYouTubeNetwork_TimestampView from '$/views/_GlobalYouTubeNetwork_TimestampView.svelte'
</script>


<Page>
	<GlobalYouTubeNetwork_TimestampView
		selection={select(EntityType._GlobalYouTubeNetwork_Timestamp, data.selector)}
	/>
</Page>
