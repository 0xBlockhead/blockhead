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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.StarknetEvent, {
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
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.eventIndex) || 'starknet event')} • starknet event • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'starknet event'} • starknet event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<StarknetEventView
		selection={pageSelection}
	/>
	{/if}
</Page>
