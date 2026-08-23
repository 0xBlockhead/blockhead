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
	import ZeroGServiceProviderView from '$/views/ZeroGServiceProviderView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGServiceProvider, data.selector, {
				sources: [
					Source.ZeroGStorageNode_JsonRpc,
					Source.ZeroGStorageScan_Rest,
				],
			})}
		<title>{data?.title ?? (pageSelection.entitySelector.providerId || 'zero g service provider')} • zero g service provider • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'zero g service provider'} • zero g service provider • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ZeroGServiceProvider, data.selector, {
				sources: [
					Source.ZeroGStorageNode_JsonRpc,
					Source.ZeroGStorageScan_Rest,
				],
			})}

	<ZeroGServiceProviderView
		selection={pageSelection}
	/>
	{/if}
</Page>
