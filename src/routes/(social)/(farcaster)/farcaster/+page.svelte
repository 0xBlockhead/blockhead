<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}
			<title>{data?.title ?? (pageSelection.entity == null ? 'Farcaster' : pageSelection.entity.protocolName || 'Farcaster')} • Farcaster • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'Farcaster'} • Farcaster • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.FarcasterNetwork, data.selector, {
					sources: [
						Source.Constants_Internal,
					],
					fields: {
						protocolName: true,
					},
				}))}

		<FarcasterNetworkView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
