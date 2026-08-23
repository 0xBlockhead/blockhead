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
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSessionAction, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					actionType: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'blockhead session action' : pageSelection.entity.actionType || 'blockhead session action')} • blockhead session action • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead session action'} • blockhead session action • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadSessionAction, data.selector, {
				sources: [
					Source.Local_Internal,
				],
				fields: {
					actionType: true,
				},
			})}

	<BlockheadSessionActionView
		selection={pageSelection}
	/>
	{/if}
</Page>
