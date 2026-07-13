<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EvmNetworkBridge, data.selector, {
		fields: {
			relationshipType: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge')))


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • EVM network bridge • Blockhead</title>
</svelte:head>


<Page>
	<EvmNetworkBridgeView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
				network: params.network,
				toCaip2: params.toCaip2,
				url: params.url,
			})
		}
		selection={pageSelection}
	/>
</Page>
