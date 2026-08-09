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

	const pageSelection = $derived(select(EntityType.BlockheadQuilibriumPendingTransaction, {
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
	<title>{data.title ?? (pageSelection.entitySelector.transactionAddress || 'blockhead quilibrium pending transaction')} • blockhead quilibrium pending transaction • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadQuilibriumPendingTransactionView
		selection={pageSelection}
	/>
</Page>
