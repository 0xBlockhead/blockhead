<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
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
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ActivityPubNote, data.selector, {
					sources: [
						Source.Mastodon_Rest,
					],
					fields: {
						content: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.localStatusId ?? '') || 'ActivityPub note' : [pageSelection.entity.content == null ? '' : htmlToPlainText(pageSelection.entity.content), pageSelection.entitySelector.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note')} • ActivityPub note • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'ActivityPub note'} • ActivityPub note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ActivityPubNote, data.selector, {
					sources: [
						Source.Mastodon_Rest,
					],
					fields: {
						content: true,
					},
				}))}

		<ActivityPubNoteView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
