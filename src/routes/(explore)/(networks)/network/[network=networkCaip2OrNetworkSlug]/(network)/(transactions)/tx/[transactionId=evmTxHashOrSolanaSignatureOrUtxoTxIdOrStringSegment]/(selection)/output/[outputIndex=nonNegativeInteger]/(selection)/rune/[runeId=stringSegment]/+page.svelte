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


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinRuneBalanceView from '$/views/BitcoinRuneBalanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinRuneBalance, {
				$output: data.selector,
				$rune: {
					$network: data.selector.$transaction.$network,
					runeId: params.runeId,
				},
			}, {
				sources: [
					Source.UniSat_Rest,
				],
				fields: {
					amount: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Rune balance' : pageSelection.entity.amount || 'Bitcoin Rune balance')} • Bitcoin Rune balance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Rune balance'} • Bitcoin Rune balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BitcoinRuneBalance, {
				$output: data.selector,
				$rune: {
					$network: data.selector.$transaction.$network,
					runeId: params.runeId,
				},
			}, {
				sources: [
					Source.UniSat_Rest,
				],
				fields: {
					amount: true,
				},
			})}

	<BitcoinRuneBalanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
