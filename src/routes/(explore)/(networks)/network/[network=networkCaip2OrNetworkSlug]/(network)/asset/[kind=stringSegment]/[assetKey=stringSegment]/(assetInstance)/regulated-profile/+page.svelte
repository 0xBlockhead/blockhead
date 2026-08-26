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
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RegulatedAssetProfile, data.selector, {
		fields: {
			standard: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'regulated asset profile' : pageSelection.entity.standard || 'regulated asset profile')} • regulated asset profile • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'regulated asset profile'} • regulated asset profile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RegulatedAssetProfileView
		selection={pageSelection}
	/>
	{/if}
</Page>
