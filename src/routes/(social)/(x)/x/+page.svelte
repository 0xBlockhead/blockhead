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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.XNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XNetworkView from '$/views/XNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'X' : pageSelection.entity.protocolName || 'X')} • X • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'X'} • X • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<XNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
