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
	import BridgeRouteView from '$/views/BridgeRouteView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BridgeRoute, data.selector, {
				sources: [
					Source.Lifi_Rest,
				],
			})}
		<title>{data?.title ?? ([String(pageSelection.entitySelector.fromChainId), 'to', String(pageSelection.entitySelector.toChainId)].filter(Boolean).join(' ') || 'bridge route')} • bridge route • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'bridge route'} • bridge route • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.BridgeRoute, data.selector, {
				sources: [
					Source.Lifi_Rest,
				],
			})}

	<BridgeRouteView
		selection={pageSelection}
	/>
	{/if}
</Page>
