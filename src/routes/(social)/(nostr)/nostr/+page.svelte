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


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalNostrNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})}
		<title>{data?.title ?? 'Nostr'} • Nostr • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Nostr'} • Nostr • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType._GlobalNostrNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
				],
			})}

	<GlobalNostrNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
