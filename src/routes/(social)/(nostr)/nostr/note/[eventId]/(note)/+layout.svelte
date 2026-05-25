<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()


	const eventId = $derived(
		decodeURIComponent(page.params.eventId ?? '').trim().toLowerCase(),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
		eventId,
	})}
	id={eventId}
>
	{#snippet Summary({ open: _open })}
		<NostrNoteView
			entityId={{ eventId }}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
