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
	import CompoundPositionView from '$/views/CompoundPositionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CompoundPosition, data.selector, {
				sources: [
					Source.Compound_Rest,
				],
				fields: {
					baseTokenSymbol: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Compound position' : pageSelection.entity.baseTokenSymbol || 'Compound position')} • Compound position • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Compound position'} • Compound position • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.CompoundPosition, data.selector, {
				sources: [
					Source.Compound_Rest,
				],
				fields: {
					baseTokenSymbol: true,
				},
			})}

	<CompoundPositionView
		selection={pageSelection}
	/>
	{/if}
</Page>
