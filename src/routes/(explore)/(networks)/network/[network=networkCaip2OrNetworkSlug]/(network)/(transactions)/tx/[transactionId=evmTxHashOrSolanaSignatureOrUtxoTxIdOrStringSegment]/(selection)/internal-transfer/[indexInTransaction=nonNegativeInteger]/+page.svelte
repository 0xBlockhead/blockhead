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

	const pageSelection = $derived(select(EntityType.EvmInternalTransfer, {
		$transaction: data.selector,
		indexInTransaction: Number(params.indexInTransaction),
	}, {
		sources: [
			Source.Blockscout_Rest,
		],
		fields: {
			callType: true,
			value: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmInternalTransferView from '$/views/EvmInternalTransferView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? `Internal #${pageSelection.entitySelector.indexInTransaction}` : (String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Internal #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM internal transfer')} • EVM internal transfer • Blockhead</title>
</svelte:head>


<Page>
	<EvmInternalTransferView
		selection={pageSelection}
	/>
</Page>
