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
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSession, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'session' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'session')} • session • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'session'} • session • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSession, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					name: true,
				},
			})}

	<BlockheadSessionView
		selection={pageSelection}
	/>
	{/if}
</Page>
