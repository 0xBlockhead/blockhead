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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmLog, data.selector, {
					sources: [
						Source.Blockscout_Rest,
					],
				}))}
			<title>{data?.title ?? ((String(pageSelection.entitySelector.indexInTransaction ?? '') ? 'Log #' + String(pageSelection.entitySelector.indexInTransaction ?? '') : '') || 'EVM log')} • EVM log • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EVM log'} • EVM log • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.EvmLog, data.selector, {
					sources: [
						Source.Blockscout_Rest,
					],
				}))}

		<EvmLogView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
