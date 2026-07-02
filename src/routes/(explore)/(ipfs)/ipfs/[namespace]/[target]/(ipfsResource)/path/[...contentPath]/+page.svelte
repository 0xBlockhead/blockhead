<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


<svelte:head>
	<title>IPFS resource • Blockhead</title>
</svelte:head>


<Page>
	<IpfsResourceView
		href={
			resolve('/(explore)/(ipfs)/ipfs/[namespace]/[target]/(ipfsResource)/path/[...contentPath]', {
				namespace: params.namespace,
				target: params.target,
				contentPath: params.contentPath,
			})
		}
		selection={
			select(EntityType.IpfsResource, data.selector, {
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
			})
		}
	/>
</Page>
