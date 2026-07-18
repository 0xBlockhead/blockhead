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

	const pageSelection = $derived(select(EntityType.XrplTrustline, data.selector, {
		fields: {
			$account: true,
			$issuerAccount: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? 'XRPL trustline' : 'XRPL trustline')))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplTrustlineView from '$/views/XrplTrustlineView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • XRPL trustline • Blockhead</title>
</svelte:head>


<Page>
	<XrplTrustlineView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]', {
				network: params.network,
				account: params.account,
				currency: params.currency,
				issuer: params.issuer,
			})
		}
		selection={pageSelection}
	/>
</Page>
