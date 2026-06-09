<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<Page>
	<NostrNotesView
		href={resolve('/nostr/notes')}
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrNotes',
		}}
		id="nostr-notes"
		title="Notes"
	/>
</Page>
