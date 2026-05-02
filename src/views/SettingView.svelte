<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Manage',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType._Global>
			title?: string
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

	type ManageShortcut = {
		key: string
		href: string
		label: string
	}

	const manageShortcutItems = $derived(
		new SvelteSet<ManageShortcut>([
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
		]),
	)


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

					{#snippet children(globalRows)}
					{@const globalRow = (
						globalRows?.find(
							(globalRowEnvelope) => globalRowEnvelope.row[EntityMetaKey.Source] === Source.Local_Internal,
						)?.row
						?? globalRows?.[0]?.row
					)}
					{#if globalRow === undefined}
						<p data-text="muted">
							Nothing loaded for this view yet. Try again shortly.
						</p>
					{:else}
						<p data-text="muted">
							Global scope row ({String(globalRow[EntityMetaKey.Source])}).
						</p>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>

			<UnorderedList
				items={manageShortcutItems}
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
