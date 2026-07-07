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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<Page>
	<CurrencyView
		href={
			resolve('/(assets)/(currencies)/currency/[iso4217=iso4217]', {
				iso4217: params.iso4217,
			})
		}
		selection={
			select(EntityType.Currency, {
				iso4217: decodeURIComponent(params.iso4217),
			}, {
				sources: [
					Source.Constants_Internal,
				],
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
