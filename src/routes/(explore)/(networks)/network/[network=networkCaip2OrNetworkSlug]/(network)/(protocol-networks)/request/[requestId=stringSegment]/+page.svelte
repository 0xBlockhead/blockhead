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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IcpRequestStatus, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import IcpRequestStatusView from '$/views/IcpRequestStatusView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? 'ICP request status'} • ICP request status • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP request status'} • ICP request status • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IcpRequestStatusView
		selection={pageSelection}
	/>
	{/if}
</Page>
