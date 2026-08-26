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

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.ArweaveResource, data.selector, {
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.transactionId ?? '') || 'arweave resource' : pageSelection.entity.canonicalUri || pageSelection.entitySelector.transactionId || 'arweave resource')} • arweave resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'arweave resource'} • arweave resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<ArweaveResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
