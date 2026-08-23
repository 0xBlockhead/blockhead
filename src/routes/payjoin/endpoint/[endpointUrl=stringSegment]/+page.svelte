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
	import PayjoinEndpointView from '$/views/PayjoinEndpointView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PayjoinEndpoint, data.selector)}
		<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'payjoin endpoint')} • payjoin endpoint • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'payjoin endpoint'} • payjoin endpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.PayjoinEndpoint, data.selector)}

	<PayjoinEndpointView
		selection={pageSelection}
	/>
	{/if}
</Page>
