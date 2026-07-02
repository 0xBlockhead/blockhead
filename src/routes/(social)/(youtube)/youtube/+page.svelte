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
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<svelte:head>
	<title>YouTube network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalYoutubeNetworkView
		href={resolve('/(social)/(youtube)/youtube')}
		selection={select(EntityType._GlobalYoutubeNetwork, data.selector)}
	/>
</Page>
