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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RedditComment, data.selector, {
		sources: [
			Source.Reddit_PublicJson,
			Source.Reddit_Rest,
		],
		fields: {
			body: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.fullname ?? '') || 'Reddit comment' : (pageSelection.entity.body ?? '') || pageSelection.entitySelector.fullname || 'Reddit comment')} • Reddit comment • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Reddit comment'} • Reddit comment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RedditCommentView
		selection={pageSelection}
	/>
	{/if}
</Page>
