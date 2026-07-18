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

	const pageSelection = $derived(select(EntityType.XrplAmm, data.selector, {
		fields: {
			assetCurrency: true,
			assetIssuer: true,
			asset2Currency: true,
			asset2Issuer: true,
			lpTokenCurrency: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? 'XRPL AMM' : 'XRPL AMM')))


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmmView from '$/views/XrplAmmView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • XRPL AMM • Blockhead</title>
</svelte:head>


<Page>
	<XrplAmmView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/amm/[ammAccount=stringSegment]', {
				network: params.network,
				ammAccount: params.ammAccount,
			})
		}
		selection={pageSelection}
	/>
</Page>
