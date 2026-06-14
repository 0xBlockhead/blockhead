<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		title = 'Derivative observations',
		open = $bindable(true),
		collapsible = true,
		entityFieldReference,
		...EntitiesListProps
	}: WithRest<
		{
			title?: string
			open?: boolean
			collapsible?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.Market_Derivative_Timestamp>
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()

	import { subscribe } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Market_Derivative_TimestampView from '$/views/Market_Derivative_TimestampView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.Market_Derivative_Timestamp}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Funding, open interest, basis, and derivative lifecycle fields are timestamped observations rather than stable market fields.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No derivative observations yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const market = subscribe(entityFieldReference.entityType,
				entityFieldReference.selector,({ fields: {
					[entityFieldReference.fieldName]: {
						sources: [
							Source.Coingecko_OpenApi,
						],
						limit: 64,
					},
				} }),
			)}
			{@const timestamps = derive(
				market,
				(market) => {
					const marketDerivativeTimestamps: readonly Entity<typeof schema, EntityType.Market_Derivative_Timestamp>[] = market.fields[entityFieldReference.fieldName]?.values ?? []
					return marketDerivativeTimestamps.map((value) => ({
						value,
					}))
				},
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				{...EntitiesListProps}
				entityType={EntityType.Market_Derivative_Timestamp}
				getKey={(row) => stringify(row.value[EntityMetaKey.Selector])}
				getSortValue={(row) => String(row.value[EntityMetaKey.Selector].timestampMs)}
				placeholderKeys={new SvelteSet<string>()}
				resource={timestamps}
				{title}
				open={true}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No derivative observations yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const row = item.value}
					<Market_Derivative_TimestampView
						selector={row[EntityMetaKey.Selector]}
						id={stringify(row[EntityMetaKey.Selector])}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
