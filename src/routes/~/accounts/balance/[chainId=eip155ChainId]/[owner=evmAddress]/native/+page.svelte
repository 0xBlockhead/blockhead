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
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetworkActorCoinBalance, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						symbol: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'balance' : pageSelection.entity.symbol || 'balance')} • balance • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'balance'} • balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmNetworkActorCoinBalance, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						symbol: true,
					},
				}))}

		<EvmNetworkActorCoinBalanceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
