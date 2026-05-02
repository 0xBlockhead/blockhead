<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XPost>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityId'
			| 'entityType'
			| 'Heading'
			| 'HeadingAfter'
			| 'Icon'
			| 'href'
			| 'open'
			| 'title'
		>
	> = $props()


	const idKey = $derived(stringify(entityId))

	const postQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.XPost] })
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
		const r = postQuery.data
			?.find((e) => e.row[EntityMetaKey.Source] === Source.X_Rest)
			?.row
			?? postQuery.data?.[0]?.row
		const b = r?.[EntityMetaKey.Fields]
		if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
			return null
		}
		return b as Record<string, unknown>
	})

	const summaryTitle = $derived(
		summaryFields !== undefined
		&& typeof summaryFields['text'] === 'string'
		&& summaryFields['text'].length > 0 ?
			summaryFields['text']
		:
			entityId.id
	)

	const authorUserId = $derived((
		summaryFields?.['$author'] as
			| { [EntityMetaKey.Id]: EntityId<typeof schema, EntityType.XUser> }
			| undefined
	)?.[EntityMetaKey.Id])


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={summaryTitle}
>
	{#if summaryFields !== undefined && typeof summaryFields['text'] === 'string' && summaryFields['text']}
		{@const postText = summaryFields['text']}
		{#snippet Heading()}
			<HeadingComponent>
				{#if href}
					<a href={href}>
						<TruncatedValue
							endLength={8}
							format={TruncatedValueFormat.Visual}
							startLength={88}
							value={postText}
						/>
					</a>
				{:else}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={postText}
					/>
				{/if}
			</HeadingComponent>
		{/snippet}
	{/if}
	{#snippet Content()}
		<div data-column>
			{#if summaryFields !== undefined && typeof summaryFields['text'] === 'string' && summaryFields['text']}
				<p>
					{summaryFields['text']}
				</p>
			{/if}
			{#if authorUserId}
				<p data-text="muted">
					<a
						href={resolve(
							'/(social)/x/user/[userId]',
							{ userId: encodeURIComponent(authorUserId.id) },
						)}
					>Author (id {authorUserId.id})</a>
				</p>
			{/if}
			{#if summaryFields !== undefined && typeof summaryFields['createdAt'] === 'number' && Number.isFinite(summaryFields['createdAt'])}
				<p data-text="muted">
					<Timestamp
						timestamp={summaryFields['createdAt']}
						format={TimestampFormat.Both}
					/>
				</p>
			{/if}
			<div data-text="mono muted">
				{entityId.id}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XPost}
			{entityId}
		>
			<QueryBoundary
				query={postQuery}
			>
				{#snippet children(xApiPostResultRows)}
					{@const detailFields = (() => {
						const r = xApiPostResultRows
							?.find((e) => e.row[EntityMetaKey.Source] === Source.X_Rest)
							?.row
							?? xApiPostResultRows?.[0]?.row
						const b = r?.[EntityMetaKey.Fields]
						if (b === undefined || typeof b !== 'object' || Array.isArray(b)) {
							return null
						}
						return b as Record<string, unknown>
					})()}
					{#if detailFields === undefined}
						<p data-text="muted">
							No post data in the app for this id yet. Try again shortly.
						</p>
					{:else}
						<dl>
							{#if typeof detailFields['text'] === 'string' && detailFields['text']}
								<div>
									<dt>Text</dt>
									<dd>{detailFields['text']}</dd>
								</div>
							{/if}
							{#if typeof detailFields['createdAt'] === 'number' && Number.isFinite(detailFields['createdAt'])}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={detailFields['createdAt']}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
