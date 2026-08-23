<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import StarknetEventView from '$/views/StarknetEventView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetEvent, {
					$transaction: data.selector,
					eventIndex: Number(params.eventIndex),
				}, {
					sources: [
						Source.Starkscan,
						Source.Voyager,
					],
				}))}
			<title>{data?.title ?? (String(pageSelection.entitySelector.eventIndex) || 'starknet event')} • starknet event • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'starknet event'} • starknet event • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.StarknetEvent, {
					$transaction: data.selector,
					eventIndex: Number(params.eventIndex),
				}, {
					sources: [
						Source.Starkscan,
						Source.Voyager,
					],
				}))}

		<StarknetEventView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
