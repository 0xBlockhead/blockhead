<!-- Generated from APP.ts. -->

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


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NostrRelay, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.relayUrl || 'Nostr relay')} • Nostr relay • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Nostr relay'} • Nostr relay • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NostrRelay, data.selector)}

	<NostrRelayView
		selection={pageSelection}
	/>
	{/if}
</Page>
