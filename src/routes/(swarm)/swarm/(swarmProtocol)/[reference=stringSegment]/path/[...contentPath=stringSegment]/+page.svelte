<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { swarmResourceContentPathFromRouteParam, swarmResourceReferenceFromRouteParam } from '$/lib/swarm.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SwarmResource, {
		reference: swarmResourceReferenceFromRouteParam(params.reference),
		contentPath: swarmResourceContentPathFromRouteParam(params.contentPath),
	}, {
		sources: [
			Source.Swarm_Rest,
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
			text: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<svelte:head>
	<title>{(pageSelection.entity == null ? 'Swarm resource' : String(pageSelection.entity.canonicalUri) || 'Swarm resource')} • Swarm resource • Blockhead</title>
</svelte:head>


<Page>
	<SwarmResourceView
		selection={pageSelection}
	/>
</Page>
