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
	import BitcoinRuneBalanceView from '$/views/BitcoinRuneBalanceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinRuneBalance, {
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
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Rune balance' : pageSelection.entity.amount || 'Bitcoin Rune balance')} • Bitcoin Rune balance • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin Rune balance'} • Bitcoin Rune balance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinRuneBalance, {
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
				}))}

		<BitcoinRuneBalanceView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
