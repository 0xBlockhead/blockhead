<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BridgeTransferView from '$/views/BridgeTransferView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeTransfer, data.selector, {
					sources: [data.selector.source],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.transferId || 'bridge transfer')} • bridge transfer • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'bridge transfer'} • bridge transfer • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.BridgeTransfer, data.selector, {
					sources: [data.selector.source],
				}))}

		<BridgeTransferView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
