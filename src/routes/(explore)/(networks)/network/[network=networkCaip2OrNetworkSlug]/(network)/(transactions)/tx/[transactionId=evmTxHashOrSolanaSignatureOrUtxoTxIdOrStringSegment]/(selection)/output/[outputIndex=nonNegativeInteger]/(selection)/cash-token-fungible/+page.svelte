<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinCashCashTokenFungibleAmount, {
		$output: data.selector,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			amount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenFungibleAmountView from '$/views/BitcoinCashCashTokenFungibleAmountView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken fungible amount' : String(pageSelection.entity.amount) || 'Bitcoin Cash CashToken fungible amount')} • Bitcoin Cash CashToken fungible amount • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken fungible amount'} • Bitcoin Cash CashToken fungible amount • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinCashCashTokenFungibleAmountView
		selection={pageSelection}
	/>
	{/if}
</Page>
