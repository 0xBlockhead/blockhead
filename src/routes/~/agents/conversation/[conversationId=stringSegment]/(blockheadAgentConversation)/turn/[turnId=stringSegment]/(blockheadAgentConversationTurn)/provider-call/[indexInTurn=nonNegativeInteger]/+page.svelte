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

	const pageSelection = $derived(select(EntityType.BlockheadAgentProviderCall, {
		$turn: data.selector,
		indexInTurn: Number(params.indexInTurn),
	}, {
		sources: [
			Source.Local_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProviderCallView from '$/views/BlockheadAgentProviderCallView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? ((String(pageSelection.entitySelector.indexInTurn ?? '') ? 'Call #' + String(pageSelection.entitySelector.indexInTurn ?? '') : '') || 'blockhead agent provider call')} • blockhead agent provider call • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentProviderCallView
		selection={pageSelection}
	/>
</Page>
