<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { swarmResourceReferenceFromRouteParam, swarmResourceContentPathFromRouteParam } from '$/lib/swarm.ts'
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
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<Page>
	<SwarmResourceView
		href={
			resolve('/(explore)/(swarm)/swarm/[reference]/(swarmResource)/path/[...contentPath]', {
				reference: params.reference,
				contentPath: params.contentPath,
			})
		}
		selection={
			select(EntityType.SwarmResource, {
				reference: swarmResourceReferenceFromRouteParam(decodeURIComponent(params.reference)),
				contentPath: swarmResourceContentPathFromRouteParam(decodeURIComponent(params.contentPath)),
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
			})
		}
	/>
</Page>
