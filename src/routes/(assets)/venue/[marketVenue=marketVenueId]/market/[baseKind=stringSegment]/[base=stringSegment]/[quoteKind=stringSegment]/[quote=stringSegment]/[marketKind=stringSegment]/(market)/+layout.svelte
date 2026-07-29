<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


{#key [params.marketVenue, params.baseKind, params.base, params.quoteKind, params.quote, params.marketKind].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
				{
					marketVenue: params.marketVenue,
					baseKind: params.baseKind,
					base: params.base,
					quoteKind: params.quoteKind,
					quote: params.quote,
					marketKind: params.marketKind,
				}
			)
		}
	>
		{#snippet Summary()}
			<MarketView
				selection={select(EntityType.Market, data.selector)}
				href={
					resolve(
						'/(assets)/venue/[marketVenue=marketVenueId]/market/[baseKind=stringSegment]/[base=stringSegment]/[quoteKind=stringSegment]/[quote=stringSegment]/[marketKind=stringSegment]',
						{
							marketVenue: params.marketVenue,
							baseKind: params.baseKind,
							base: params.base,
							quoteKind: params.quoteKind,
							quote: params.quote,
							marketKind: params.marketKind,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
