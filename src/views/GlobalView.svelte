<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Sources.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		title,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType._Global>
			title: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'title'
			| 'href'
			| 'open'
			| 'Details'
		>
	> = $props()


	const globalIdKey = $derived(
		stringify(entityId),
	)

	const globalQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType._Global] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						globalIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => globalIdKey],
	)

	type ExploreShortcut = {
		key: string
		href: string
		label: string
	}

	const exploreShortcutItems = $derived(
		new SvelteSet<ExploreShortcut>(
			[
				{
					key: 'self',
					href,
					label: title,
				},
				{
					key: 'explore',
					href: resolve('/explore'),
					label: 'Explore',
				},
				...(
					href === resolve('/assets') ?
						[
							{
								key: 'assets-coins',
								href: resolve('/coins'),
								label: 'Coins',
							},
							{
								key: 'assets-pools',
								href: resolve('/pools'),
								label: 'Pools',
							},
						]
					:
						[]
				),
				...(
					href === resolve('/~/accounts') ?
						[
							{
								key: 'accounts-balances',
								href: resolve('/~/accounts/balances'),
								label: 'Balances',
							},
						]
					:
						[]
				),
			],
		),
	)


	// Functions
	const fieldNumber = ({
		row,
		fieldName,
	}: {
		row: Record<string, unknown> | undefined
		fieldName: string
	}) => {
		const fields = row?.[EntityMetaKey.Fields]
		const value = (
			typeof fields === 'object'
			&& fields != null ?
				Reflect.get(
					Object(fields),
					fieldName,
				)
			:
				undefined
		)
		return (
			typeof value === 'number' ?
				value
			:
				undefined
		)
	}


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import UnorderedList from '$/components/UnorderedList.svelte'
</script>


<EntityView
	entityType={EntityType._Global}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Details()}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType._Global}
				{entityId}
			>
				<QueryBoundary
					query={globalQuery}
				>

					{#snippet children(rows)}
						{@const globalRow = (
							rows?.find(
								(r) => r.row[EntityMetaKey.Source] === Source._User,
							)?.row
							?? rows?.[0]?.row
						)}
						{@const duneRow = rows?.find(
							(r) => r.row[EntityMetaKey.Source] === Source.Dune,
						)?.row}
						{@const duneCreditsUsed = fieldNumber({
							row: duneRow,
							fieldName: 'duneCreditsUsed',
						})}
						{@const duneCreditsIncluded = fieldNumber({
							row: duneRow,
							fieldName: 'duneCreditsIncluded',
						})}
						{#if globalRow == null}
							<p data-text="muted">
								No global row in collections yet (Local resolver seeds this scope).
							</p>
						{:else}
							<p data-text="muted">
								Global scope row ({String(globalRow[EntityMetaKey.Source])}).
							</p>
						{/if}
						{#if duneCreditsUsed != null || duneCreditsIncluded != null}
							<dl>
								{#if duneCreditsUsed != null}
									<div>
										<dt>Dune credits used</dt>
										<dd>{String(duneCreditsUsed)}</dd>
									</div>
								{/if}
								{#if duneCreditsIncluded != null}
									<div>
										<dt>Dune credits included</dt>
										<dd>{String(duneCreditsIncluded)}</dd>
									</div>
								{/if}
							</dl>
						{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<UnorderedList
				items={exploreShortcutItems}
				getKey={(row) => row.key}
				getSortValue={(row) => row.key}
				placeholderKeys={new SvelteSet()}
				orientation={ListOrientation.Column}
			>
				{#snippet Item({ item: row, isPlaceholder })}
					{#if isPlaceholder}
						<span data-placeholder>
							…
						</span>
					{:else if row}
						<a href={row.href}>
							{row.label}
						</a>
					{/if}
				{/snippet}
			</UnorderedList>
		{/if}
	{/snippet}
</EntityView>
