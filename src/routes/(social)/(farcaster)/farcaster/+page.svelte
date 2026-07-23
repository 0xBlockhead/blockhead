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

	const pageSelection = $derived(select(EntityType.FarcasterNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
			relationshipModel: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? 'Farcaster' : [String((({ ...data.selector, ...pageSelection.entity }).protocolName) ?? '')].filter(Boolean).join(' ') || 'Farcaster'))} • Farcaster • Blockhead</title>
</svelte:head>


<Page>
	<FarcasterNetworkView
		href={resolve('/farcaster')}
		selection={pageSelection}
	/>
</Page>
