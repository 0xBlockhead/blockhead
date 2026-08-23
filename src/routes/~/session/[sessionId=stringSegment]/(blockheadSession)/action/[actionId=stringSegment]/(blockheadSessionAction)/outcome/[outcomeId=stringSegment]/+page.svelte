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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadActionOutcomeView from '$/views/BlockheadActionOutcomeView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadActionOutcome, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					outcomeKind: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead action outcome' : pageSelection.entity.outcomeKind || 'blockhead action outcome')} • blockhead action outcome • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead action outcome'} • blockhead action outcome • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadActionOutcome, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					outcomeKind: true,
				},
			})}

	<BlockheadActionOutcomeView
		selection={pageSelection}
	/>
	{/if}
</Page>
