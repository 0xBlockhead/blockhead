<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'

	const pageSelection = $derived(select(EntityType.NostrNetwork, {
		scope: 'NostrNetwork',
	}, {
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNetworkView from '$/views/NostrNetworkView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.scope ?? '') || 'Nostr network' : pageSelection.entity.protocolName || pageSelection.entitySelector.scope || 'Nostr network'} • Nostr network • Blockhead</title>
</svelte:head>


<Page>
	<NostrNetworkView
		selection={pageSelection}
	/>
</Page>
