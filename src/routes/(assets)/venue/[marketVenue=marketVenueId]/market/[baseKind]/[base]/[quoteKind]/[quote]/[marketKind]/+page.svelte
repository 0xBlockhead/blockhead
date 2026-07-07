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


	// Components
	import Page from '$/components/Page.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<Page>
	<MarketView
		href={
			resolve('/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind]/[base]/[quoteKind]/[quote]/[marketKind]', {
				marketVenue: params.marketVenue,
				baseKind: params.baseKind,
				base: params.base,
				quoteKind: params.quoteKind,
				quote: params.quote,
				marketKind: params.marketKind,
			})
		}
		selection={
			select(EntityType.Market, {
				$base: (
				params.baseKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.base),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.base),
						},
					}
				),
				$quote: (
				params.quoteKind === 'coin' ?
					{
						kind: 'Coin',
						$coin: {
							coinId: decodeURIComponent(params.quote),
						},
					}
				:
					{
						kind: 'Currency',
						$currency: {
							iso4217: decodeURIComponent(params.quote),
						},
					}
				),
				$marketVenue: {
					marketVenueId: decodeURIComponent(params.marketVenue),
				},
				marketKind: decodeURIComponent(params.marketKind),
			})
		}
	/>
</Page>
