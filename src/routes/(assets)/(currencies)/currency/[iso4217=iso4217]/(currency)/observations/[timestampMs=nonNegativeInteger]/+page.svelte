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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Currency_Timestamp, {
		$currency: {
			iso4217: decodeURIComponent(params.iso4217),
		},
		timestampMs: Number(params.timestampMs),
	}, {
		fields: {
			marketCap: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? 'currency timestamp' : 'currency timestamp'))


	// Components
	import Page from '$/components/Page.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • currency timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Currency_TimestampView
		href={
			resolve('/currency/[iso4217=iso4217]/observations/[timestampMs=nonNegativeInteger]', {
				iso4217: params.iso4217,
				timestampMs: params.timestampMs,
			})
		}
		selection={pageSelection}
	/>
</Page>
