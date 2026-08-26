<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalAgentNetwork, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAgentNetworkView from '$/views/_GlobalAgentNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'global agent network'} • global agent network • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'global agent network'} • global agent network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalAgentNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
