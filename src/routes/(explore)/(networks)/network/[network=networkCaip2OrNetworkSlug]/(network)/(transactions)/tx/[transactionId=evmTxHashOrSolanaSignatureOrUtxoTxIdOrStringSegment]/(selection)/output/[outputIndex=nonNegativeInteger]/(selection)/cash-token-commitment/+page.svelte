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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BitcoinCashCashTokenCommitment, {
		$output: data.selector,
	}, {
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
		fields: {
			commitmentHex: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Bitcoin Cash CashToken commitment' : pageSelection.entity.commitmentHex || 'Bitcoin Cash CashToken commitment')} • Bitcoin Cash CashToken commitment • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Bitcoin Cash CashToken commitment'} • Bitcoin Cash CashToken commitment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BitcoinCashCashTokenCommitmentView
		selection={pageSelection}
	/>
	{/if}
</Page>
