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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SwarmResource, data.selector, {
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
	<title>{(data.title ?? (pageSelection.entity == null ? 'Swarm resource' : [String((({ ...data.selector, ...pageSelection.entity }).canonicalUri) ?? '')].filter(Boolean).join(' ') || 'Swarm resource'))} • Swarm resource • Blockhead</title>
</svelte:head>


<Page>
	<SwarmResourceView
		href={
			resolve('/swarm/[reference=stringSegment]', {
				reference: params.reference,
			})
		}
		selection={pageSelection}
	/>
</Page>
