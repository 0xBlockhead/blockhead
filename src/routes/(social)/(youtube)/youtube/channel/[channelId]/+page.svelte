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
	import YouTubeChannelView from '$/views/YouTubeChannelView.svelte'
</script>


<Page>
	<YouTubeChannelView
		selection={select(EntityType.YouTubeChannel, data.selector)}
	/>
</Page>
