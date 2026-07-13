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

	const pageSelection = $derived(select(EntityType.Erc4337Bundler_Timestamp, {
		$bundler: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
		$bundler: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}).source],
		fields: {
			userOperationsCount: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 bundler timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337Bundler_TimestampView from '$/views/Erc4337Bundler_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ERC-4337 bundler timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337Bundler_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
