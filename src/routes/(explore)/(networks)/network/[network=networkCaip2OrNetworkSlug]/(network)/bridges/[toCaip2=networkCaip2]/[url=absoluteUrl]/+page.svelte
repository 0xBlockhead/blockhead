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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.EvmNetworkBridge, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.url || 'EVM network bridge')} • EVM network bridge • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'EVM network bridge'} • EVM network bridge • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<EvmNetworkBridgeView
		selection={pageSelection}
	/>
	{/if}
</Page>
