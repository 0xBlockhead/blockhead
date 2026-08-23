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
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannel, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.id || 'blockhead state channel')} • blockhead state channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'blockhead state channel'} • blockhead state channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BlockheadStateChannel, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})}

	<BlockheadStateChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>
