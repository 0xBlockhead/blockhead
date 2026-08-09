<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmTrace, {
		$transaction: data.selector,
		traceAddress: params.traceAddress,
	}, {
		fields: {
			index: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmTraceView from '$/views/EvmTraceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'EVM trace' : (String(pageSelection.entity.index ?? '') ? 'Trace #' + String(pageSelection.entity.index ?? '') : '') || (pageSelection.entitySelector.traceAddress ?? '') || 'EVM trace')} • EVM trace • Blockhead</title>
</svelte:head>


<Page>
	<EvmTraceView
		selection={pageSelection}
	/>
</Page>
