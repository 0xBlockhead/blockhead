<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrProfileMetadataEvent, {
		eventId: params.eventId,
	}, {
		fields: {
			displayName: true,
			nip05: true,
			pubkey: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileMetadataEventView from '$/views/NostrProfileMetadataEventView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? 'Nostr profile metadata event' : [(pageSelection.entity.displayName ?? ''), (pageSelection.entity.nip05 ?? '')].filter(Boolean).join(' ') || pageSelection.entity.pubkey || 'Nostr profile metadata event'} • Nostr profile metadata event • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileMetadataEventView
		selection={pageSelection}
	/>
</Page>
