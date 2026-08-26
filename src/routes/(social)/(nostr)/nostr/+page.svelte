<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType._GlobalNostrNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'Nostr'} • Nostr • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Nostr'} • Nostr • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<GlobalNostrNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
