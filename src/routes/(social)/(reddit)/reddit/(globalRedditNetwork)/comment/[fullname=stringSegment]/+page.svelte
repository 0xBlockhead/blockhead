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
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RedditComment, data.selector, {
					sources: [
						Source.Reddit_PublicJson,
						Source.Reddit_Rest,
					],
					fields: {
						body: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.fullname ?? '') || 'Reddit comment' : (pageSelection.entity.body ?? '') || pageSelection.entitySelector.fullname || 'Reddit comment')} • Reddit comment • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Reddit comment'} • Reddit comment • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.RedditComment, data.selector, {
					sources: [
						Source.Reddit_PublicJson,
						Source.Reddit_Rest,
					],
					fields: {
						body: true,
					},
				}))}

		<RedditCommentView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
