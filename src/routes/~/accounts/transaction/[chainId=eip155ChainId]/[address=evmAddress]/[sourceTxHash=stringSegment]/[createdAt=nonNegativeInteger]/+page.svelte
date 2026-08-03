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

	const pageSelection = $derived(select(EntityType.BlockheadBridgeTransaction, {
		$account: {
			interopAddress: 'eip155:' + String(Number(params.chainId)) + ':' + String(params.address),
		},
		$sourceTx: {
			$network: {
				caip2: {
					namespace: 'eip155',
					reference: params.chainId,
				},
			},
			txHash: params.sourceTxHash,
		},
		createdAt: Number(params.createdAt),
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
</script>


<svelte:head>
	<title>{String(pageSelection.entitySelector.createdAt) || 'bridge transaction'} • bridge transaction • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBridgeTransactionView
		selection={pageSelection}
	/>
</Page>
