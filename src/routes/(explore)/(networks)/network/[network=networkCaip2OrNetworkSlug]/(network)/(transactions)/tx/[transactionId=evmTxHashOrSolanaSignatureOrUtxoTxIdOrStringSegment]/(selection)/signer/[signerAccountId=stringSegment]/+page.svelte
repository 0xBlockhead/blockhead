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

	const pageSelection = $derived(select(EntityType.NearTransaction, {
		$network: data.selector.$network,
		hash: params.transactionId,
		signerAccountId: params.signerAccountId,
	}, {
		sources: [
			Source.NearRpc_JsonRpc,
			Source.NearBlocks_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.hash || 'near transaction')} • near transaction • Blockhead</title>
</svelte:head>


<Page>
	<NearTransactionView
		selection={pageSelection}
	/>
</Page>
