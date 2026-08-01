<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Currency_TimestampView from '$/views/Currency_TimestampView.svelte'
</script>


<svelte:head>
	<title>{'currency timestamp'} • currency timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Currency_TimestampView
		selection={
			select(EntityType.Currency_Timestamp, {
				$currency: {
					iso4217: params.iso4217,
				},
				timestampMs: Number(params.timestampMs),
			}, {
				fields: {
					marketCap: true,
				},
			})
		}
	/>
</Page>
