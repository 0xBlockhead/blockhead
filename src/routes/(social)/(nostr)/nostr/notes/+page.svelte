<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
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
		selection={select(
			EntityType.NostrNetwork,
			{ scope: 'NostrNetwork' }
		).$$nostrNotes}
		id="nostr-notes"
		title="Notes"
	/>
</Page>
