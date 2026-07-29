<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.NostrRelay, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entitySelector.relayUrl || 'Nostr relay')} • Nostr relay • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelayView
		selection={pageSelection}
	/>
</Page>
