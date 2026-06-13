<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(assets)/(marketVenues)/market-venue/[marketVenueId=marketVenueId]', {
				marketVenueId: entityId.marketVenueId,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MarketVenue>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const marketVenue = subscribe(EntityType.MarketVenue,
		entityId,
		({ sources: [
				Source.Constants_Internal,
			], fields: { label: true } }),
	)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.MarketVenue}
	{entityId}
	href={href}
	title={entityId.marketVenueId}
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
				{marketVenue.fields.label ?? entityId.marketVenueId}
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
							<code>{entityId.marketVenueId}</code>
						</dd>
					</div>

					<div>
						<dt>Label</dt>
						<dd>
				{marketVenue.fields.label ?? entityId.marketVenueId}
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
			entityFieldReference={{
				entityType: EntityType.MarketVenue,
				entityId,
				fieldName: '$$markets',
			}}
			open={false}
			title="Markets"
		/>
	{/snippet}
</EntityView>
