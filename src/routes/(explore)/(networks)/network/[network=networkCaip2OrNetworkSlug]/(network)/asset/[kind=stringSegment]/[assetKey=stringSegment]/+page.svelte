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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AssetInstance, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'Asset instance' : [pageSelection.entity.symbol, pageSelection.entity.name].filter(Boolean).join(' ') || 'Asset instance')} • Asset instance • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'Asset instance'} • Asset instance • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AssetInstanceView
		selection={pageSelection}
	/>
	{/if}
</Page>
