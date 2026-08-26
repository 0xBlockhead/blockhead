<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.AssetObject, {
		$assetInstance: data.selector,
		objectKey: params.objectKey,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import AssetObjectView from '$/views/AssetObjectView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.objectKey || 'asset object')} • asset object • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'asset object'} • asset object • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<AssetObjectView
		selection={pageSelection}
	/>
	{/if}
</Page>
