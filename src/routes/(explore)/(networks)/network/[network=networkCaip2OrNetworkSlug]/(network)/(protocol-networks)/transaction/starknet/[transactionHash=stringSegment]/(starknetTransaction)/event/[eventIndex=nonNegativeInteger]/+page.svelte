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

	const pageSelection = $derived(select(EntityType.StarknetEvent, {
		$transaction: data.selector,
		eventIndex: Number(params.eventIndex),
	}, {
		sources: [
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetEventView from '$/views/StarknetEventView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (String(pageSelection.entitySelector.eventIndex) || 'starknet event')} • starknet event • Blockhead</title>
</svelte:head>


<Page>
	<StarknetEventView
		selection={pageSelection}
	/>
</Page>
