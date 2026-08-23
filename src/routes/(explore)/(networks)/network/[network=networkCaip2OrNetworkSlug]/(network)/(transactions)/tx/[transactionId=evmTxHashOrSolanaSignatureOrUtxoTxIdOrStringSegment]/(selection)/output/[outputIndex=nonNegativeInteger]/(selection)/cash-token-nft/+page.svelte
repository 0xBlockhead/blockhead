<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinCashCashTokenNft, {
		$output: data.selector,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			capability: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenNftView from '$/views/BitcoinCashCashTokenNftView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken NFT' : pageSelection.entity.capability || 'Bitcoin Cash CashToken NFT')} • Bitcoin Cash CashToken NFT • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken NFT'} • Bitcoin Cash CashToken NFT • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinCashCashTokenNftView
		selection={pageSelection}
	/>
	{/if}
</Page>
