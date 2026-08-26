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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.OracleFeed, data.selector, {
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import OracleFeedView from '$/views/OracleFeedView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.address ?? '') || 'oracle feed' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.address || 'oracle feed')} • oracle feed • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'oracle feed'} • oracle feed • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<OracleFeedView
		selection={pageSelection}
	/>
	{/if}
</Page>
