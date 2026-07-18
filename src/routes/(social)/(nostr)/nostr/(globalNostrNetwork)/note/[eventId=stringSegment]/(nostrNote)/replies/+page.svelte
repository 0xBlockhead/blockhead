<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Note replies • Blockhead</title>
</svelte:head>


<Page>
	<NostrNotesView
		href={
			resolve('/nostr/note/[eventId=stringSegment]/replies', {
				eventId: params.eventId,
			})
		}
		title='Note replies'
		selection={
			select(EntityType.NostrNote, data.selector).$$replies({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
				count: true,
			})
		}
		id='replies'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
