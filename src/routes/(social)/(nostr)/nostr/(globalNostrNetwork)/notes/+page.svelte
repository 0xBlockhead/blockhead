<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Nostr notes • Blockhead</title>
</svelte:head>


<Page>
	<NostrNotesView
		href={resolve('/nostr/notes')}
		title='Nostr notes'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			}).$$observedNotes({
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
				count: true,
			})
		}
		id='observed-notes'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
