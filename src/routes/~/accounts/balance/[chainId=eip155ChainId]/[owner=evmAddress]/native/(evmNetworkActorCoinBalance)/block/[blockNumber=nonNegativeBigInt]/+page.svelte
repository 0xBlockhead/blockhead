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
	import EvmNetworkActorCoinBalance_EvmBlockView from '$/views/EvmNetworkActorCoinBalance_EvmBlockView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetworkActorCoinBalance_EvmBlock, {
					$actorCoin: data.selector,
					$block: {
						$network: data.selector.$network,
						blockNumber: BigInt(params.blockNumber),
					},
				}))}
			<title>{data?.title ?? 'EVM network actor coin balance EVM block'} • EVM network actor coin balance EVM block • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM network actor coin balance EVM block'} • EVM network actor coin balance EVM block • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetworkActorCoinBalance_EvmBlock, {
					$actorCoin: data.selector,
					$block: {
						$network: data.selector.$network,
						blockNumber: BigInt(params.blockNumber),
					},
				}))}

		<EvmNetworkActorCoinBalance_EvmBlockView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
