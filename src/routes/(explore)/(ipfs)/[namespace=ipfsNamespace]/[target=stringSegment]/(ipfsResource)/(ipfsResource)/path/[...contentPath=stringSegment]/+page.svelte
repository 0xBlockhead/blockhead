<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.IpfsResource, {
		namespace: params.namespace,
		target: params.target,
		contentPath: decodeURIComponent(params.contentPath),
	}, {
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
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.canonicalUri) ?? '')].filter(Boolean).join(' ') || 'IPFS resource' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).canonicalUri) ?? '')].filter(Boolean).join(' ') || 'IPFS resource'))


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • IPFS resource • Blockhead</title>
</svelte:head>


<Page>
	<IpfsResourceView
		href={
			resolve('/[namespace=ipfsNamespace]/[target=stringSegment]/path/[...contentPath=stringSegment]', {
				namespace: params.namespace,
				target: params.target,
				contentPath: params.contentPath,
			})
		}
		selection={pageSelection}
	/>
</Page>
