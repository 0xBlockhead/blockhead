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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.IpfsResource, {
		namespace: params.namespace,
		target: params.target,
		contentPath: params.contentPath,
	}, {
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
	<title>{pageSelection.entity == null ? 'IPFS resource' : pageSelection.entity.canonicalUri || 'IPFS resource'} • IPFS resource • Blockhead</title>
</svelte:head>


<Page>
	<IpfsResourceView
		selection={pageSelection}
	/>
</Page>
