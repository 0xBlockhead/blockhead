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


	// Components
	import Page from '$/components/Page.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<svelte:head>
	<title>currency • Blockhead</title>
</svelte:head>


<Page>
	<CurrencyView
		href={
			resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
				iso4217: params.iso4217,
			})
		}
		selection={
			select(EntityType.Currency, data.selector, {
				fields: {
					name: true,
					symbol: true,
					minorUnitExponent: true,
					catalogSortWeight: true,
				},
			})
		}
	/>
</Page>
