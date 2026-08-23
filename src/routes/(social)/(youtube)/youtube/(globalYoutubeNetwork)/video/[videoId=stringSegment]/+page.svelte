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
	import YoutubeVideoView from '$/views/YoutubeVideoView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.YoutubeVideo, data.selector, {
					sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
						Source.Constants_Internal,
					],
					fields: {
						title: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.videoId ?? '') || 'YouTube video' : (pageSelection.entity.title ?? '') || pageSelection.entitySelector.videoId || 'YouTube video')} • YouTube video • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'YouTube video'} • YouTube video • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.YoutubeVideo, data.selector, {
					sources: [
						Source.Youtube_Rest,
						Source.Piped_Rest,
						Source.Constants_Internal,
					],
					fields: {
						title: true,
					},
				}))}

		<YoutubeVideoView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
