<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
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


	// Components
	import Page from '$/components/Page.svelte'
	import XrplAmmView from '$/views/XrplAmmView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'XRPL AMM'} • XRPL AMM • Blockhead</title>
</svelte:head>


<Page>
	<XrplAmmView
		selection={pageSelection}
	/>
</Page>
