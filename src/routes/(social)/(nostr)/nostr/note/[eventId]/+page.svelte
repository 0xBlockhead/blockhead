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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<Page>
	<NostrNoteView
		href={
			resolve('/(social)/(nostr)/nostr/note/[eventId]', {
				eventId: params.eventId,
			})
		}
		selection={
			select(EntityType.NostrNote, {
				eventId: decodeURIComponent(params.eventId),
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					content: true,
					createdAt: true,
					kind: true,
					pubkey: true,
					$author: true,
					replyToEventId: true,
					rootEventId: true,
				},
			})
		}
	/>
</Page>
