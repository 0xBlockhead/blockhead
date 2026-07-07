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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
</script>


<Page>
	<BlockheadBridgeTransactionView
		href={
			resolve('/~/accounts/transaction/[chainId=eip155ChainId]/[address=evmAddress]/[sourceTxHash]/[createdAt]', {
				chainId: params.chainId,
				address: params.address,
				sourceTxHash: params.sourceTxHash,
				createdAt: params.createdAt,
			})
		}
		selection={
			select(EntityType.BlockheadBridgeTransaction, {
				$account: {
					interopAddress: 'eip155:' + String(params.chainId) + ':' + String(params.address),
				},
				$sourceTx: {
					$network: {
						caip2: {
							namespace: 'eip155',
							reference: params.chainId,
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
			})
		}
	/>
</Page>
