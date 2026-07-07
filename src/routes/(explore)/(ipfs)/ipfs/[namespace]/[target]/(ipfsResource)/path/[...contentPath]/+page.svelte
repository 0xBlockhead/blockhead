<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ipfsResourceAddressFromRouteParams } from '$/lib/ipfs.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IpfsResourceView from '$/views/IpfsResourceView.svelte'
</script>


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
			select(EntityType.IpfsResource, ipfsResourceAddressFromRouteParams({
				namespace: decodeURIComponent(params.namespace),
				target: decodeURIComponent(params.target),
				contentPath: decodeURIComponent(params.contentPath),
			}), {
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
			})
		}
	/>
</Page>
