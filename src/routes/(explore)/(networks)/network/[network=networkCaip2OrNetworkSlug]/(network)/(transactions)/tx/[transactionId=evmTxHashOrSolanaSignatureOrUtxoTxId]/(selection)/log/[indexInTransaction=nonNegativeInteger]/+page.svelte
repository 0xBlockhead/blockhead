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

	const pageSelection = $derived(select(EntityType.EvmLog, data.selector, {
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			$emitter: true,
			$block: true,
			data: true,
			removed: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? (String((pageSelection.entitySelector.indexInTransaction) ?? '') ? 'Log #' + String((pageSelection.entitySelector.indexInTransaction) ?? '') : '') || 'EVM log' : (String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') ? 'Log #' + String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).indexInTransaction) ?? '') : '') || 'EVM log')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM log • Blockhead</title>
</svelte:head>


<Page>
	<EvmLogView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/log/[indexInTransaction=nonNegativeInteger]', {
				network: params.network,
				transactionId: params.transactionId,
				indexInTransaction: params.indexInTransaction,
			})
		}
		selection={pageSelection}
	/>
</Page>
