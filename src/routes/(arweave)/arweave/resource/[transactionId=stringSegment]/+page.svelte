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
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ArweaveResource, data.selector, {
				fields: {
					canonicalUri: true,
				},
			})}
		<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.transactionId ?? '') || 'arweave resource' : pageSelection.entity.canonicalUri || pageSelection.entitySelector.transactionId || 'arweave resource')} • arweave resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'arweave resource'} • arweave resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.ArweaveResource, data.selector, {
				fields: {
					canonicalUri: true,
				},
			})}

	<ArweaveResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
