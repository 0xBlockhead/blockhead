<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
				marketVenueId: selector.marketVenueId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.MarketVenue>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const marketVenue = $derived(select(EntityType.MarketVenue, selector, ({ sources: [
				Source.Constants_Internal,
			], fields: { label: true } })))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	entitySelector={selector}
	{href}
	title={selector.marketVenueId}
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
				{marketVenue.fields.label ?? selector.marketVenueId}
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
							<code>{selector.marketVenueId}</code>
						</dd>
					</div>

					<div>
						<dt>Label</dt>
						<dd>
				{marketVenue.fields.label ?? selector.marketVenueId}
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
			selection={select(
			EntityType.MarketVenue,
			selector
		).$$markets}

			title="Markets"
		/>
	{/snippet}
</EntityView>
