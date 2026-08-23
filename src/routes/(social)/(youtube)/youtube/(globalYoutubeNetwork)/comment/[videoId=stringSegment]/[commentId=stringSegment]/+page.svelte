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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.YoutubeComment, data.selector, {
		sources: [
			Source.Youtube_Rest,
			Source.Piped_Rest,
		],
		fields: {
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import YoutubeCommentView from '$/views/YoutubeCommentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'YouTube comment' : (pageSelection.entity.text ?? '') || 'YouTube comment')} • YouTube comment • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'YouTube comment'} • YouTube comment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<YoutubeCommentView
		selection={pageSelection}
	/>
	{/if}
</Page>
