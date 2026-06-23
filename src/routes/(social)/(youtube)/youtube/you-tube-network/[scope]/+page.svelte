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
	import YouTubeNetworkView from '$/views/YouTubeNetworkView.svelte'
</script>


<Page>
	<YouTubeNetworkView
		selection={select(EntityType.YouTubeNetwork, data.selector)}
	/>
</Page>
