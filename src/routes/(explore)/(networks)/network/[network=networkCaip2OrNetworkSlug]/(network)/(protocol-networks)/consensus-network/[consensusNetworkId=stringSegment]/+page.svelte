<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGConsensusNetworkView from '$/views/ZeroGConsensusNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGConsensusNetwork, data.selector, {
					sources: [
						Source.ZeroGChainScan_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.consensusNetworkId || 'zero g consensus network')} • zero g consensus network • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g consensus network'} • zero g consensus network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGConsensusNetwork, data.selector, {
					sources: [
						Source.ZeroGChainScan_Rest,
					],
				}))}

		<ZeroGConsensusNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
