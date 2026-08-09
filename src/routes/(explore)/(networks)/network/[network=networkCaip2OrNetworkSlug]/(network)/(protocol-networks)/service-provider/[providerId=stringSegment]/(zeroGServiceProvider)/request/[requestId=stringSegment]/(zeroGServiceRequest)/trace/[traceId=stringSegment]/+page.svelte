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

	const pageSelection = $derived(select(EntityType.ZeroGSettlementTrace, {
		$serviceRequest: data.selector,
		traceId: params.traceId,
	}, {
		sources: [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ZeroGSettlementTraceView from '$/views/ZeroGSettlementTraceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.traceId || 'zero g settlement trace')} • zero g settlement trace • Blockhead</title>
</svelte:head>


<Page>
	<ZeroGSettlementTraceView
		selection={pageSelection}
	/>
</Page>
