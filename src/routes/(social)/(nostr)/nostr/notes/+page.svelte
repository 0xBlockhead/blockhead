<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	<NostrNotesView
		entityFieldReference={{
			entityType: EntityType.NostrNetwork,
			entityId: { scope: 'NostrNetwork' },
			fieldName: '$$nostrNotes',
		}}
		href={resolve('/nostr/notes')}
		id="nostr-notes"
		title="Notes"
	/>
</Page>
