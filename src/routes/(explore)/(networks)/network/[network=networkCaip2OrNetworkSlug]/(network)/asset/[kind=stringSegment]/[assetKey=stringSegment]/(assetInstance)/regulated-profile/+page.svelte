<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import RegulatedAssetProfileView from '$/views/RegulatedAssetProfileView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RegulatedAssetProfile, data.selector, {
				fields: {
					standard: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? 'regulated asset profile' : pageSelection.entity.standard || 'regulated asset profile')} • regulated asset profile • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'regulated asset profile'} • regulated asset profile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.RegulatedAssetProfile, data.selector, {
				fields: {
					standard: true,
				},
			})}

	<RegulatedAssetProfileView
		selection={pageSelection}
	/>
	{/if}
</Page>
