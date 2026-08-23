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
	import ZeroGDaQuorumView from '$/views/ZeroGDaQuorumView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGDaQuorum, data.selector, {
					sources: [
						Source.ZeroGChainScan_Rest,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.quorumId || 'zero g da quorum')} • zero g da quorum • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g da quorum'} • zero g da quorum • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGDaQuorum, data.selector, {
					sources: [
						Source.ZeroGChainScan_Rest,
						Source.ZeroGStorageNode_JsonRpc,
					],
				}))}

		<ZeroGDaQuorumView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
