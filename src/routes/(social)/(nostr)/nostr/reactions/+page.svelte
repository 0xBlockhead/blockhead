<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
</script>


<Page>
	{#if data.noteEntityId}
		<NostrReactionsView
			entityFieldReference={{
				entityType: EntityType.NostrNote,
				entityId: data.noteEntityId,
				fieldName: '$$reactions',
			}}
			href={`${resolve('/(social)/(nostr)/nostr/reactions')}?note=${data.noteEntityId.eventId}`}
			id="nostr-reactions"
			title="Reactions"
		/>
	{:else}
		<NostrNotesView
			entityFieldReference={{
				entityType: EntityType.NostrNetwork,
				entityId: { scope: 'NostrNetwork' },
				fieldName: '$$nostrNotes',
			}}
			href={resolve('/(social)/(nostr)/nostr/reactions')}
			id="nostr-reactions-notes"
			title="Notes"
		/>
	{/if}
</Page>
