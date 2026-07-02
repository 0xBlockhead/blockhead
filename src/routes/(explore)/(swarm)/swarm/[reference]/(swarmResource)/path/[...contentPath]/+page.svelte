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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<svelte:head>
	<title>Swarm resource • Blockhead</title>
</svelte:head>


<Page>
	<SwarmResourceView
		href={
			resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
				reference: params.reference,
				contentPath: params.contentPath,
			})
		}
		selection={
			select(EntityType.SwarmResource, data.selector, {
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
					text: true,
				},
			})
		}
	/>
</Page>
