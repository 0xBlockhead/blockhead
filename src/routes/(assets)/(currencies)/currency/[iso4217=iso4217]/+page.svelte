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

	const pageSelection = $derived(select(EntityType.Currency, data.selector, {
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			name: true,
			symbol: true,
			minorUnitExponent: true,
			catalogSortWeight: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.iso4217) ?? '')].filter(Boolean).join(' ') || 'currency' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).iso4217) ?? '')].filter(Boolean).join(' ') || 'currency')))


	// Components
	import Page from '$/components/Page.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • currency • Blockhead</title>
</svelte:head>


<Page>
	<CurrencyView
		href={
			resolve('/currency/[iso4217=iso4217]', {
				iso4217: params.iso4217,
			})
		}
		selection={pageSelection}
	/>
</Page>
