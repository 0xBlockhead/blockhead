<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XUser>
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
			| 'Icon'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const userQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XUser] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						idKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => idKey],
	)

	const summaryFields = $derived.by((): Record<string, unknown> | null => {
		const r = userQuery.data
			?.find((e) => e.row[EntityMetaKey.Source] === Source.X_Rest)
			?.row
			?? userQuery.data?.[0]?.row
		const b = r?.[EntityMetaKey.Fields]
		if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
			return null
		}
		return b as Record<string, unknown>
	})

	const displayTitle = $derived(
		(summaryFields !== undefined && typeof summaryFields['name'] === 'string' && summaryFields['name']
			? summaryFields['name']
			:	undefined)
		?? (summaryFields !== undefined && typeof summaryFields['username'] === 'string' ? summaryFields['username'] : undefined)
		?? entityId.id
	)


	// Components
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
</script>


<EntityView
	entityType={EntityType.XUser}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Icon()}
		{@const s = summaryFields}
		{@const a = s !== undefined && typeof s['profileImageUrl'] === 'string' ? s['profileImageUrl'] : null}
		{#if a}
			<Icon
				alt={(
					(s !== undefined && typeof s['name'] === 'string' && s['name'])
					?? (s !== undefined && typeof s['username'] === 'string' && s['username'])
					?? ''
				)}
				shape={IconShape.Circle}
				src={a}
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{@const s = summaryFields}
		{@const u = s !== undefined && typeof s['username'] === 'string' && s['username'] !== displayTitle ? s['username'] : null}
		{#if u}
			<span data-text="muted">
				@{u}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		{#if summaryFields !== undefined && typeof summaryFields['description'] === 'string' && summaryFields['description']}
			<p data-text="muted">
				{summaryFields['description']}
			</p>
		{/if}
		<div data-text="mono muted">
			{entityId.id}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XUser}
			{entityId}
		>
			<QueryBoundary
				query={userQuery}
			>
				{#snippet children(xApiUserResultRows)}
					{@const detailFields = (() => {
						const r = xApiUserResultRows
							?.find((e) => e.row[EntityMetaKey.Source] === Source.X_Rest)
							?.row
							?? xApiUserResultRows?.[0]?.row
						const b = r?.[EntityMetaKey.Fields]
						if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
							return null
						}
						return b as Record<string, unknown>
					})()}
					{#if detailFields === undefined}
						<p data-text="muted">
							No user data in the app for this id yet. Try again shortly, or check your X API credentials and
							rate limits.
						</p>
					{:else}
						<dl>
							{#if typeof detailFields['name'] === 'string' && detailFields['name']}
								<div>
									<dt>Name</dt>
									<dd>{detailFields['name']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['username'] === 'string' && detailFields['username']}
								<div>
									<dt>Username</dt>
									<dd>{detailFields['username']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['description'] === 'string' && detailFields['description']}
								<div>
									<dt>Description</dt>
									<dd>{detailFields['description']}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
