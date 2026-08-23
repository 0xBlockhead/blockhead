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
	import BlockheadQuilibriumPendingTransactionView from '$/views/BlockheadQuilibriumPendingTransactionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadQuilibriumPendingTransaction, {
					$accountState: data.selector,
					transactionAddress: params.transactionAddress,
				}, {
					sources: [
						Source.Local_Internal,
						Source.QuilibriumNodeRpc_Grpc,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.transactionAddress || 'blockhead quilibrium pending transaction')} • blockhead quilibrium pending transaction • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium pending transaction'} • blockhead quilibrium pending transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadQuilibriumPendingTransaction, {
					$accountState: data.selector,
					transactionAddress: params.transactionAddress,
				}, {
					sources: [
						Source.Local_Internal,
						Source.QuilibriumNodeRpc_Grpc,
					],
				}))}

		<BlockheadQuilibriumPendingTransactionView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
