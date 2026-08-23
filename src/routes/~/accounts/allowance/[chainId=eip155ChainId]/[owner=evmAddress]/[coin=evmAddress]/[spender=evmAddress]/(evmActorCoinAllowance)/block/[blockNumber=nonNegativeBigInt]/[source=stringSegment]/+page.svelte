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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmActorCoinAllowance_BlockView from '$/views/EvmActorCoinAllowance_BlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmActorCoinAllowance_Block, {
					$allowance: data.selector,
					blockNumber: BigInt(params.blockNumber),
					source: params.source,
				}, {
					sources: [params.source],
				}))}
			<title>{data?.title ?? 'Block ' + String(pageSelection.entitySelector.blockNumber)} • EVM actor coin allowance block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM actor coin allowance block'} • EVM actor coin allowance block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmActorCoinAllowance_Block, {
					$allowance: data.selector,
					blockNumber: BigInt(params.blockNumber),
					source: params.source,
				}, {
					sources: [params.source],
				}))}

		<EvmActorCoinAllowance_BlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
