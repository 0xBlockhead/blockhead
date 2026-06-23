<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const eventId = $derived(
		decodeURIComponent(page.params.eventId ?? '').toLowerCase(),
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
		eventId: eventId,
	})}
	id={eventId}
>
	{#snippet Summary({ open: _open })}
		<NostrNoteView
			selection={
				select(
					EntityType.NostrNote,
					{
						eventId: eventId,
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
