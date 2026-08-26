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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.PayjoinEndpoint, data.selector))


	// Components
	import Page from '$/components/Page.svelte'
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'payjoin endpoint')} • payjoin endpoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'payjoin endpoint'} • payjoin endpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<PayjoinEndpointView
		selection={pageSelection}
	/>
	{/if}
</Page>
