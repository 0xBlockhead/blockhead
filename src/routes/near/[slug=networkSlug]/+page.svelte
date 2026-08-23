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
	import NearNetworkView from '$/views/NearNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.NearRpc_JsonRpc,
				],
				fields: {
					name: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.slug ?? '') || 'near network' : [(pageSelection.entity.name ?? ''), pageSelection.entitySelector.slug].filter(Boolean).join(' ') || 'near network')} • near network • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'near network'} • near network • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.NearNetwork, data.selector, {
				sources: [
					Source.Constants_Internal,
					Source.NearRpc_JsonRpc,
				],
				fields: {
					name: true,
				},
			})}

	<NearNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
