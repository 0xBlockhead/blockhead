<!-- Generated from APP.ts. -->

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
	import GlobalAgentNetworkView from '$/views/_GlobalAgentNetworkView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'global agent network'} • global agent network • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAgentNetworkView
		selection={select(EntityType._GlobalAgentNetwork, data.selector)}
	/>
</Page>
