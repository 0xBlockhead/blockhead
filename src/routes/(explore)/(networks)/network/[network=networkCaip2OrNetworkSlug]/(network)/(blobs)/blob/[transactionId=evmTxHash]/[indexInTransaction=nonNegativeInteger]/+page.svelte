<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmBlob, data.selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.Blobscan_Rest,
		],
		fields: {
			versionedHash: true,
			$block: true,
			kzgCommitment: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInTransaction) ?? '') ? 'Blob #' + String((pageSelection.entitySelector.indexInTransaction) ?? '') : '') || 'EVM blob' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Blob #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'EVM blob')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlobView from '$/views/EvmBlobView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM blob • Blockhead</title>
</svelte:head>


<Page>
	<EvmBlobView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/blob/[transactionId=evmTxHash]/[indexInTransaction=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={pageSelection}
	/>
</Page>
