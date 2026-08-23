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
	import YoutubeChannelView from '$/views/YoutubeChannelView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.YoutubeChannel, data.selector, {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
					Source.Constants_Internal,
				],
				fields: {
					title: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.channelId ?? '') || 'YouTube channel' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.channelId || 'YouTube channel')} • YouTube channel • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'YouTube channel'} • YouTube channel • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.YoutubeChannel, data.selector, {
				sources: [
					Source.Youtube_Rest,
					Source.Piped_Rest,
					Source.Constants_Internal,
				],
				fields: {
					title: true,
				},
			})}

	<YoutubeChannelView
		selection={pageSelection}
	/>
	{/if}
</Page>
