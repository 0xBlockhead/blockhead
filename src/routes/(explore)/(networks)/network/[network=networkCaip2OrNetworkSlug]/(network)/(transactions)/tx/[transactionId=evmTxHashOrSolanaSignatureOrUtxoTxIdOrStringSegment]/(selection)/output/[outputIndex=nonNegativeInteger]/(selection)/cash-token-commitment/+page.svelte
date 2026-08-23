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
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenCommitment, {
					$output: data.selector,
				}, {
					sources: [
						Source.BitcoinCashNode_JsonRpc,
					],
					fields: {
						commitmentHex: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken commitment' : pageSelection.entity.commitmentHex || 'Bitcoin Cash CashToken commitment')} • Bitcoin Cash CashToken commitment • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken commitment'} • Bitcoin Cash CashToken commitment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BitcoinCashCashTokenCommitment, {
					$output: data.selector,
				}, {
					sources: [
						Source.BitcoinCashNode_JsonRpc,
					],
					fields: {
						commitmentHex: true,
					},
				}))}

		<BitcoinCashCashTokenCommitmentView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
