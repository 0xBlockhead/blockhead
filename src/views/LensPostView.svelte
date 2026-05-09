<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { default as EntityViewComponent } from '$/components/EntityView.svelte'


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
			entityId: EntityId<typeof schema, EntityType.LensPost>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityViewComponent>,
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

	const rowQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.LensPost] })
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

	const f = $derived.by(() => {
		const bag = rowQuery.data?.[0]?.row?.[EntityMetaKey.Fields]
		if (!(typeof bag === 'object' && bag !== null && !Array.isArray(bag))) return null
		const rec = bag
		const text = rec['text']
		const ts = rec['timestamp']
		const authorRef = rec['$author']
		return {
			text: typeof text === 'string' && text.length ? text : undefined,
			timestamp: typeof ts === 'number' && Number.isFinite(ts) ? ts : undefined,
			authorId: (
				(typeof authorRef === 'object' && authorRef !== null && !Array.isArray(authorRef)) && EntityMetaKey.Id in authorRef ?
					authorRef[EntityMetaKey.Id]
				:
					undefined
			),
		}
	})

	const displayTitle = $derived.by(() => {
		const t = f?.text?.trim()
		if (t !== undefined && t.length) {
			const max = 80
			return t.length <= max ? t : `${t.slice(0, max - 1)}…`
		}
		return entityId.id
	})


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
</script>


<EntityView
	entityType={EntityType.LensPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<div data-column>
			{#if f !== undefined && f.text !== undefined}
				<p>
					{f.text}
				</p>
			{/if}
			<dl>
				{#if f !== undefined && f.authorId !== undefined}
					<div>
						<dt>Author</dt>
						<dd>
							<a
								href={resolve(
									`/lens/account/${f.authorId.address}`,
								)}
							>
								<span data-text="font-monospace">
									{f.authorId.address}
								</span>
							</a>
						</dd>
					</div>
				{/if}
				{#if f !== undefined && f.timestamp !== undefined}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={f.timestamp}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
			</dl>
			<div data-text="mono muted">
				{entityId.id}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.LensPost}
			{entityId}
		>
			<QueryBoundary
				query={rowQuery}
			>
				{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Lens post data in the app for this id yet.
						</p>
					{:else}
						<dl>
							{#if f?.authorId !== undefined}
								<div>
									<dt>Author</dt>
									<dd>
										<a
											href={resolve('/(social)/lens/account/[address]', {
												address: f.authorId.address,
											})}
										>
											<span data-text="mono">
												{f.authorId.address}
											</span>
										</a>
									</dd>
								</div>
							{/if}
							{#if f?.timestamp !== undefined}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={f.timestamp}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
							<div>
								<dt>Post id</dt>
								<dd>
									<span data-text="mono">
										{entityId.id}
									</span>
								</dd>
							</div>
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
