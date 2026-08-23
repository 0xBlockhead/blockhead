<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAgentNetworkView from '$/views/_GlobalAgentNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalAgentNetwork, data.selector))}
			<title>{data?.title ?? 'global agent network'} • global agent network • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'global agent network'} • global agent network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType._GlobalAgentNetwork, data.selector))}

		<GlobalAgentNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
