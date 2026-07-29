<!-- Generated from APP.ts. Do not edit by hand. -->

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

	const pageSelection = $derived(select(EntityType.IpfsResource, data.selector, {
		sources: [
			Source.Ipfs_Rest,
		],
		fields: {
			canonicalUri: true,
			contentType: true,
			displayType: true,
			gatewayUrl: true,
			gatewayOrigin: true,
			fileName: true,
			extension: true,
			contentLength: true,
			isContentTypeInferred: true,
			$media: true,
			cidVersion: true,
			cidMultibase: true,
			cidMulticodecCode: true,
			cidMultihashCode: true,
			cidMultihashDigestHex: true,
			isCidSubdomainSafe: true,
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'IPFS resource' : pageSelection.entity.canonicalUri || 'IPFS resource')} • IPFS resource • Blockhead</title>
</svelte:head>


<Page>
	<IpfsResourceView
		selection={pageSelection}
	/>
</Page>
