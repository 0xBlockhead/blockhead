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

	const pageSelection = $derived(select(EntityType.Erc4337Paymaster_Timestamp, {
		$paymaster: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$paymaster: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			userOperationsCount: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster timestamp' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 paymaster timestamp')))


	// Components
	import Page from '$/components/Page.svelte'
	import Erc4337Paymaster_TimestampView from '$/views/Erc4337Paymaster_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ERC-4337 paymaster timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Erc4337Paymaster_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				address: params.address,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
