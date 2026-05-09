<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityFieldReference } from '$/schema/$EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	// Props
	let {
		title = 'Coin instances',
		href,
		open = $bindable(true),
		entityFieldReference,
		...entitiesListRest
	}: WithRest<
		{
			title?: string
			href: string
			open?: boolean
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.CoinInstance>
		},
		Omit<
			ComponentProps<typeof EntitiesList>,
			'entityType'
		>
	> = $props()


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityFieldCollections } from '$/routes/+layout.svelte'


	// (Derived)
	const coinInstancesQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({
						coinInstanceFieldRow: entityFieldCollections[entityFieldReference.entityType][entityFieldReference.fieldName],
					})
				.where(({ coinInstanceFieldRow }) => (
						eq(
							coinInstanceFieldRow[EntityMetaKey.ParentIdKey],
							stringify(entityFieldReference.entityId),
						)
					))
				.select(({ coinInstanceFieldRow }) => (
						{ value: coinInstanceFieldRow[EntityMetaKey.Value] }
					))
				.distinct()
		),
		[
			() => entityFieldReference.entityType,
			() => entityFieldReference.fieldName,
			() => stringify(entityFieldReference.entityId),
		],
	)

	const coinInstanceRowKey = (
		row: Entity<typeof schema, EntityType.CoinInstance>,
	) => (
		stringify(
			row[EntityMetaKey.Id],
		)
	)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
</script>


<EntitiesList
	{...entitiesListRest}
	bind:open
	entityType={EntityType.CoinInstance}
	{title}
	getKey={coinInstanceRowKey}
	getSortValue={coinInstanceRowKey}
	items={coinInstancesQuery.data?.map(({ value }) => value) ?? []}
	placeholderKeys={new SvelteSet<string | number>()}
	query={coinInstancesQuery}
	UnorderedListProps={{ orientation: ListOrientation.Column }}
>
	{#snippet Empty()}
		<p data-text="muted">
			No coin instances yet.
		</p>
	{/snippet}

	{#snippet Item({ item: row, isPlaceholder })}
		{#if isPlaceholder}
			<span data-placeholder>
				…
			</span>
		{:else if row}
			<CoinInstanceView
				entityId={row[EntityMetaKey.Id]}
				{href}
				id={stringify(row[EntityMetaKey.Id])}
				layout={EntityLayout.Summary}
				open={false}
			/>
		{/if}
	{/snippet}
</EntitiesList>
