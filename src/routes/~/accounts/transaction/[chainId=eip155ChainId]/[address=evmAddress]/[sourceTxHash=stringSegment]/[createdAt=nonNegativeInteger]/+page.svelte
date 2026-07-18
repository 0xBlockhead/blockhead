<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
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
					reference: Number(params.chainId),
				},
			},
			txHash: decodeURIComponent(params.sourceTxHash),
		},
		createdAt: Number(params.createdAt),
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$bridgeTransfer: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.createdAt) ?? '')].filter(Boolean).join(' ') || 'bridge transaction' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).createdAt) ?? '')].filter(Boolean).join(' ') || 'bridge transaction'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • bridge transaction • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadBridgeTransactionView
		href={
			resolve('/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash=stringSegment]/[createdAt=nonNegativeInteger]', {
				chainId: params.chainId,
				address: params.address,
				sourceTxHash: params.sourceTxHash,
				createdAt: params.createdAt,
			})
		}
		selection={pageSelection}
	/>
</Page>
