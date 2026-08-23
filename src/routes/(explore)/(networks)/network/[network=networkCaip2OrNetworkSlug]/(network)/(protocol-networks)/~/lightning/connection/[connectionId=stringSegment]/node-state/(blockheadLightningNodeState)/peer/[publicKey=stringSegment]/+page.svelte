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
	import BlockheadLightningPeerView from '$/views/BlockheadLightningPeerView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningPeer, data.selector, {
					sources: [
						Source.LightningLnd_Rest,
						Source.Local_Internal,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.publicKey || 'local LND peer')} • local LND peer • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'local LND peer'} • local LND peer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BlockheadLightningPeer, data.selector, {
					sources: [
						Source.LightningLnd_Rest,
						Source.Local_Internal,
					],
				}))}

		<BlockheadLightningPeerView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
