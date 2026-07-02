<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadBridgeTransactionView from '$/views/BlockheadBridgeTransactionView.svelte'
</script>


<svelte:head>
	<title>bridge transaction • Blockhead</title>
</svelte:head>


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
			select(EntityType.BlockheadBridgeTransaction, data.selector, {
				fields: {
					$bridgeTransfer: true,
				},
			})
		}
	/>
</Page>
