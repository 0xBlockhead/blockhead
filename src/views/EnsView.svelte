<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EnsName>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Summary'
		>
	> = $props()


	const ensNameIdKey = $derived(
		stringify(entityId),
	)

	const ensNameQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.EnsName] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						ensNameIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => ensNameIdKey],
	)

	const ensNameRow = $derived(
		ensNameQuery.data?.[0]?.row,
	)

	const ensNameField = $derived(
		(() => {
			const bag = ensNameRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const raw = b.textRecords
			if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
				return { textRecords: undefined as Record<string, string> | undefined }
			}
			const textRecords: Record<string, string> = {}
			for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
				if (typeof v === 'string') textRecords[k] = v
			}
			return {
				textRecords: (
					Object.keys(textRecords).length ?
						textRecords
					:	undefined
				),
			}
		})(),
	)

	const textRecordEntries = $derived(
		ensNameField?.textRecords == null ?
			[]
		:	(
				Object.entries(ensNameField.textRecords)
					.toSorted(([a], [b]) => (
						a.localeCompare(b)
					))
			),
	)

	const displayTitle = $derived(
		entityId.name,
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.EnsName}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<dl data-definition-list="vertical">
			<div>
				<dt>Name</dt>
				<dd>
					<TruncatedValue
						value={entityId.name}
						format={TruncatedValueFormat.Visual}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.EnsName}
				{entityId}
			>
				<QueryBoundary
					query={ensNameQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No ENS name row in collections yet (no resolver for this name).
						</p>
					{:else if textRecordEntries.length === 0}
						<p data-text="muted">
							No text records on this name row.
						</p>
					{:else}
						<dl>
							{#each textRecordEntries as [key, value] (key)}
								<div>
									<dt>
										<TruncatedValue
											value={key}
											format={TruncatedValueFormat.Visual}
										/>
									</dt>
									<dd>
										<TruncatedValue
											{value}
											format={TruncatedValueFormat.Visual}
										/>
									</dd>
								</div>
							{/each}
						</dl>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
