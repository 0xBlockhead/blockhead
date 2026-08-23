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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetBlockView from '$/views/StarknetBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetBlock, {
					$network: data.selector,
					blockHash: params.blockHash,
				}, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
						Source.Starkscan,
						Source.Voyager,
					],
					fields: {
						blockNumber: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'starknet block' : String(pageSelection.entity.blockNumber) || 'starknet block')} • starknet block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'starknet block'} • starknet block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetBlock, {
					$network: data.selector,
					blockHash: params.blockHash,
				}, {
					sources: [
						Source.Juno_JsonRpc,
						Source.Pathfinder,
						Source.Starkscan,
						Source.Voyager,
					],
					fields: {
						blockNumber: true,
					},
				}))}

		<StarknetBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
