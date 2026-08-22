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

	const pageSelection = $derived(select(EntityType.ArweaveResource, data.selector, {
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import ArweaveResourceView from '$/views/ArweaveResourceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.transactionId ?? '') || 'arweave resource' : pageSelection.entity.canonicalUri || pageSelection.entitySelector.transactionId || 'arweave resource')} • arweave resource • Blockhead</title>
</svelte:head>


<Page>
	<ArweaveResourceView
		selection={pageSelection}
	/>
</Page>
