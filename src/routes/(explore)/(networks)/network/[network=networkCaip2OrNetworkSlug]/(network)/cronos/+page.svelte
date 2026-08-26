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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.CronosNetworkProfile, {
		$network: data.selector,
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import CronosNetworkProfileView from '$/views/CronosNetworkProfileView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'cronos network profile'} • cronos network profile • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'cronos network profile'} • cronos network profile • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<CronosNetworkProfileView
		selection={pageSelection}
	/>
	{/if}
</Page>
