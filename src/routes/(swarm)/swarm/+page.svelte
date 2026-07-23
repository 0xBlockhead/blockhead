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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.SwarmProtocol, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			relationshipModel: true,
			registryName: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmProtocolView from '$/views/SwarmProtocolView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Swarm protocol' : [String((({ ...data.selector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || 'Swarm protocol'))} • Swarm protocol • Blockhead</title>
</svelte:head>


<Page>
	<SwarmProtocolView
		href={resolve('/swarm')}
		selection={pageSelection}
	/>
</Page>
