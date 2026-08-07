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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAlgorandPendingTransaction, {
		nodeId: params.nodeId,
		txId: params.txId,
		observedAtMs: Number(params.observedAtMs),
	}, {
		sources: [
			Source.Nodely,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAlgorandPendingTransactionView from '$/views/BlockheadAlgorandPendingTransactionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.txId || 'blockhead algorand pending transaction'} • blockhead algorand pending transaction • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAlgorandPendingTransactionView
		selection={pageSelection}
	/>
</Page>
