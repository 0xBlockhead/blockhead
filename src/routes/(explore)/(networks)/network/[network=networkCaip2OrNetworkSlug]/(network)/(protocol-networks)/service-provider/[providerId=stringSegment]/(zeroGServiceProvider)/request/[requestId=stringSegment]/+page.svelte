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
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGServiceRequest, data.selector, {
					sources: [
						Source.ZeroGChain_JsonRpc,
						Source.ZeroGStorageNode_JsonRpc,
						Source.ZeroGStorageScan_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.requestId || 'zero g service request')} • zero g service request • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'zero g service request'} • zero g service request • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.ZeroGServiceRequest, data.selector, {
					sources: [
						Source.ZeroGChain_JsonRpc,
						Source.ZeroGStorageNode_JsonRpc,
						Source.ZeroGStorageScan_Rest,
					],
				}))}

		<ZeroGServiceRequestView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
