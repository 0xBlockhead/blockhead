<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { htmlToPlainText } from '$/lib/html.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ActivityPubNote, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
		fields: {
			content: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.localStatusId ?? '') || 'ActivityPub note' : [pageSelection.entity.content == null ? '' : htmlToPlainText(pageSelection.entity.content), pageSelection.entitySelector.localStatusId].filter(Boolean).join(' ') || 'ActivityPub note')} • ActivityPub note • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ActivityPub note'} • ActivityPub note • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ActivityPubNoteView
		selection={pageSelection}
	/>
	{/if}
</Page>
