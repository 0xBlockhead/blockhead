<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<Page>
	<NostrNoteView
		entityId={data.entityId}
		href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
			eventId: data.entityId.eventId,
		})}
	/>
</Page>
