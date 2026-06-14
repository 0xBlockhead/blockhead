<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<Page>
	<NostrNotesView
		href={resolve(
			'/(social)/(nostr)/nostr/note/[eventId]/(note)/replies',
			{ eventId: data.selector.eventId },
		)}
		entityFieldReference={{
			entityType: EntityType.NostrNote,
			selector: data.selector,
			fieldName: '$$replies',
		}}
		id="nostr-note-replies"
		title="Replies"
	/>
</Page>
