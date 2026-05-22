<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// State
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrNotesView
		entityFieldReference={{
			entityType: EntityType.NostrNote,
			entityId: data.entityId,
			fieldName: '$$replies',
		}}
		href={resolve('/(social)/(nostr)/nostr/note/[eventId]/(note)/replies', {
			eventId: data.entityId.eventId,
		})}
		id="nostr-note-replies"
		title="Replies"
	/>
</Page>
