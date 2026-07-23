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


	// Components
	import Page from '$/components/Page.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge' : [String((({ ...data.selector, ...pageSelection.entity }).url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge'))} • EVM network bridge • Blockhead</title>
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
