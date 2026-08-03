<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrProfile, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
		fields: {
			$latestMetadataEvent: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.pubkey ?? '') || 'Nostr profile' : pageSelection.entitySelector.pubkey || 'Nostr profile')} • Nostr profile • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfileView
		selection={pageSelection}
	/>
</Page>
