<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<Page>
	{#if data.noteEntitySelector}
		<NostrReactionsView
			href={resolve('/nostr/reactions')}
			selection={select(
			EntityType.NostrNote,
			data.noteEntitySelector
		).$$reactions}
			id="nostr-reactions"
			title="Reactions"
		/>
	{:else}
		<p data-text="muted">
			Open reactions for a specific note with
			<code>?note=</code>
			followed by the 64-character kind-1 event id, or navigate from a note’s reactions carousel.
		</p>
	{/if}
</Page>
