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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.BlockheadQuilibriumPendingTransaction, {
		$accountState: data.selector,
		transactionAddress: params.transactionAddress,
	}, {
		sources: [
			Source.Local_Internal,
			Source.QuilibriumNodeRpc_Grpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadQuilibriumPendingTransactionView from '$/views/BlockheadQuilibriumPendingTransactionView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.transactionAddress || 'blockhead quilibrium pending transaction')} • blockhead quilibrium pending transaction • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead quilibrium pending transaction'} • blockhead quilibrium pending transaction • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<BlockheadQuilibriumPendingTransactionView
		selection={pageSelection}
	/>
	{/if}
</Page>
