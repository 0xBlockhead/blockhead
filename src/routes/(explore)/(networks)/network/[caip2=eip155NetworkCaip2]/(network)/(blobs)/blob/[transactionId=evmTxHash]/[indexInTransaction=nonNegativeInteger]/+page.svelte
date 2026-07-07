<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
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
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<Page>
	<EvmBlobView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(blobs)/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
				caip2: params.caip2,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={
			select(EntityType.EvmBlob, {
				$transaction: {
					$network: {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					},
					txHash: decodeURIComponent(params.transactionId),
				},
				indexInTransaction: Number(params.indexInTransaction),
			}, {
				sources: [
					Source.Voltaire_JsonRpc,
					Source.Blobscan_Rest,
				],
				fields: {
					versionedHash: true,
					$block: true,
					kzgCommitment: true,
				},
			})
		}
	/>
</Page>
