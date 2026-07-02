<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeNetworkView from '$/views/YoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>YouTube Data API • Blockhead</title>
</svelte:head>


<Page>
	<YoutubeNetworkView
		href={resolve('/(social)/(youtube)/youtube/api')}
		selection={
			select(EntityType.YoutubeNetwork, data.selector, {
				fields: {
					protocolName: true,
					homeUrl: true,
					docsUrl: true,
				},
			})
		}
	/>
</Page>
