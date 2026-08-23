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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinRuneBalance, {
		$address: data.selector,
		$rune: {
			$network: data.selector.$network,
			runeId: params.runeId,
		},
	}, {
		sources: [
			Source.UniSat_Rest,
		],
		fields: {
			amount: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinRuneBalanceView from '$/views/BitcoinRuneBalanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Rune balance' : pageSelection.entity.amount || 'Bitcoin Rune balance')} • Bitcoin Rune balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Rune balance'} • Bitcoin Rune balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinRuneBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
