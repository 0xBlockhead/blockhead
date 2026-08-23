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
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenNft, {
					$output: data.selector,
				}, {
					sources: [
						Source.BitcoinCashNode_JsonRpc,
					],
					fields: {
						capability: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken NFT' : pageSelection.entity.capability || 'Bitcoin Cash CashToken NFT')} • Bitcoin Cash CashToken NFT • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken NFT'} • Bitcoin Cash CashToken NFT • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenNft, {
					$output: data.selector,
				}, {
					sources: [
						Source.BitcoinCashNode_JsonRpc,
					],
					fields: {
						capability: true,
					},
				}))}

		<BitcoinCashCashTokenNftView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
