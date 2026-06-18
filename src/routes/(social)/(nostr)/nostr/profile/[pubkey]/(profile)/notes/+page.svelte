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
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<Page>
	<NostrNotesView
		href={resolve(
			'/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes',
			{ pubkey: data.selector.pubkey },
		)}
		selection={select(
			EntityType.NostrProfile,
			data.selector
		).$$notes}
		id="nostr-profile-notes"
	/>
</Page>
