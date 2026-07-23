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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.PolkadotAccount_Timestamp, {
		$account: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [({
			$account: data.selector,
			timestampMs: Number(params.timestampMs),
			source: params.source,
		}).source],
		fields: {
			freeBalancePlancks: true,
			nonce: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotAccount_TimestampView from '$/views/PolkadotAccount_TimestampView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String(({
		$account: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}.source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp' : [String((({ ...{
		$account: data.selector,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, ...pageSelection.entity }).source) ?? '')].filter(Boolean).join(' ') || 'Polkadot account timestamp'))} • Polkadot account timestamp • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotAccount_TimestampView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				network: params.network,
				accountId: params.accountId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={pageSelection}
	/>
</Page>
