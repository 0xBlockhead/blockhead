<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.MarketVenue>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const marketVenue = $derived(selection(({ sources: [
				Source.Constants_Internal,
			], fields: { label: true } })))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selection.entitySelector}
	href={href ?? resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
			marketVenueId: selection.entitySelector.marketVenueId,
	})}
	title={selection.entitySelector.marketVenueId}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<ResourceBoundary
			resource={marketVenue}
			placeholderText="Loading market venue…"
		>
			{#snippet children(marketVenue)}
				{marketVenue.fields.label ?? selection.entitySelector.marketVenueId}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={marketVenue}
			placeholderText="Loading market venue…"
		>
			{#snippet children(marketVenue)}
				<dl data-column-item="center">
					<div>
						<dt>Venue id</dt>
						<dd>
							<code>{selection.entitySelector.marketVenueId}</code>
						</dd>
					</div>

					<div>
						<dt>Label</dt>
						<dd>
				{marketVenue.fields.label ?? selection.entitySelector.marketVenueId}
						</dd>
					</div>
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<MarketsView
			href={resolve('/markets')}
			selection={selection.$$markets}

			title="Markets"
		/>
	{/snippet}
</EntityView>
