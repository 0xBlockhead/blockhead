<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'YouTube'} • YouTube network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetworkView
		selection={
			select(EntityType._GlobalYoutubeNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})
		}
	/>
</Page>
