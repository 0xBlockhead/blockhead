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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.NostrProfile, data.selector, {
		sources: [
			Source.Constants_Internal,
			Source.NostrRelay_WebSocket,
			Source.Primal_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.pubkey || 'Nostr profile')} • Nostr profile • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Nostr profile'} • Nostr profile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<NostrProfileView
		selection={pageSelection}
	/>
	{/if}
</Page>
