<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.IpfsResource, data.selector, {
		sources: [
			Source.Ipfs_Rest,
		],
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (pageSelection.entity == null ? 'IPFS resource' : pageSelection.entity.canonicalUri || 'IPFS resource')} • IPFS resource • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'IPFS resource'} • IPFS resource • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<IpfsResourceView
		selection={pageSelection}
	/>
	{/if}
</Page>
