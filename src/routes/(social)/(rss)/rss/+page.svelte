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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.RssNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import RssNetworkView from '$/views/RssNetworkView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'RSS / Atom' : pageSelection.entity.protocolName || 'RSS / Atom')} • RSS / Atom • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'RSS / Atom'} • RSS / Atom • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<RssNetworkView
		selection={pageSelection}
	/>
	{/if}
</Page>
