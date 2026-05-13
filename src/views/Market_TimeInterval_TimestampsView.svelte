<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		title = 'OHLC points',
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			open?: boolean
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.Market_TimeInterval_Timestamp
			>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const fieldName = entityFieldReference.fieldName

	const ohlcParentEntity = useEntity(
		entityFieldReference.entityType,
		entityFieldReference.entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.TradingView_Rest,
			],
			[fieldName]: {
				$limit: 4096,
			},
		},
	)

	const points = derive(
		ohlcParentEntity,
		(merged) => (
			(
				merged[fieldName as keyof typeof merged] as (
					Entity<typeof schema, EntityType.Market_TimeInterval_Timestamp>
				)[]
			)
				.toSorted((first, second) => (
					first[EntityMetaKey.Id].timestampNs < second[EntityMetaKey.Id].timestampNs ?
						1
					:
						first[EntityMetaKey.Id].timestampNs > second[EntityMetaKey.Id].timestampNs ?
							-1
						:
							stringify(second[EntityMetaKey.Id]).localeCompare(
								stringify(first[EntityMetaKey.Id]),
							)
				))
				.map((value) => ({
					value,
				}))
		),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Market_TimeInterval_TimestampView from '$/views/Market_TimeInterval_TimestampView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.Market_TimeInterval_Timestamp}
	getKey={(row) => stringify(row.value[EntityMetaKey.Id])}
	getSortValue={(row) => String(row.value[EntityMetaKey.Id].timestampNs)}
	placeholderKeys={new SvelteSet<string>()}
	resource={points}
	{title}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No OHLC points yet.
		</p>
	{/snippet}

	{#snippet Item(props)}
		{#if props.item}
			{@const row = props.item.value}
			<Market_TimeInterval_TimestampView
				entityId={row[EntityMetaKey.Id]}
				href={resolve('/(assets)/coins/market/[marketKey]', {
					marketKey: encodeURIComponent(stringify(row[EntityMetaKey.Id].$market)),
				})}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
