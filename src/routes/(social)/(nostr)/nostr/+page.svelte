<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType._GlobalNostrNetwork, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			registryName: true,
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			relationshipModel: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? ('Nostr'))} • Nostr • Blockhead</title>
</svelte:head>


<Page>
	<GlobalNostrNetworkView
		selection={pageSelection}
	/>
</Page>
