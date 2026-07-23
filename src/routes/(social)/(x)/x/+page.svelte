<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.XNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			registryName: true,
			relationshipModel: true,
			homeUrl: true,
			docsUrl: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import XNetworkView from '$/views/XNetworkView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'X' : [String((({ ...data.selector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || 'X'))} • X • Blockhead</title>
</svelte:head>


<Page>
	<XNetworkView
		href={resolve('/x')}
		selection={pageSelection}
	/>
</Page>
