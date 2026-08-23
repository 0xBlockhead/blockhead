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


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProviderCallView from '$/views/BlockheadAgentProviderCallView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentProviderCall, {
				$turn: data.selector,
				indexInTurn: Number(params.indexInTurn),
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTurn ?? '') ? 'Call #' + String(pageSelection.entitySelector.indexInTurn ?? '') : '') || 'blockhead agent provider call')} • blockhead agent provider call • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead agent provider call'} • blockhead agent provider call • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadAgentProviderCall, {
				$turn: data.selector,
				indexInTurn: Number(params.indexInTurn),
			}, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadAgentProviderCallView
		selection={pageSelection}
	/>
	{/if}
</Page>
