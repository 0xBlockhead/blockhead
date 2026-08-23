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
	import LightningChannelView from '$/views/LightningChannelView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LightningChannel, data.selector, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
				fields: {
					shortChannelId: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.channelId ?? '') || 'Lightning channel' : (pageSelection.entity.shortChannelId ?? '') || pageSelection.entitySelector.channelId || 'Lightning channel')} • Lightning channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Lightning channel'} • Lightning channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.LightningChannel, data.selector, {
				sources: [
					Source.LightningMempoolSpace_Rest,
					Source.LightningLnd_Rest,
				],
				fields: {
					shortChannelId: true,
				},
			})}

	<LightningChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>
