<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			entityId: EntityId<typeof schema, EntityType.RedditComment>
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
				.from({ row: entityCollectionByEntityType[EntityType.RedditComment] })
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
		const bodyX = rec['body']
		const authorX = rec['author']
		const linkRef = rec['$link']
		const linkId = (
			(typeof linkRef === 'object' && linkRef !== null && !Array.isArray(linkRef)) && EntityMetaKey.Id in linkRef ?
				linkRef[EntityMetaKey.Id]
			:
				undefined
		)
		return {
			body: typeof bodyX === 'string' && bodyX.length ? bodyX : undefined,
			author: typeof authorX === 'string' && authorX.length ? authorX : undefined,
			linkId,
		}
	})

	const displayTitle = $derived.by(() => (
		f?.body !== undefined && f.body.length > 0 ?
			(
				f.body.length > 96 ?
					`${f.body.slice(0, 96)}…`
				:
					f.body
			)
		:
			entityId.fullname
	))


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet Content()}
		<div data-column>
			{#if f !== undefined && f.body !== undefined}
				<p>
					{f.body}
				</p>
			{/if}
			{#if f !== undefined && f.author !== undefined}
				<p data-text="muted">
					u/{f.author}
				</p>
			{/if}
			{#if f !== undefined && f.linkId !== undefined}
				<p data-text="muted">
					<a
						href={resolve(
							'/(social)/reddit/link/[fullname]',
							{ fullname: encodeURIComponent(f.linkId.fullname) },
						)}
					>Post {f.linkId.fullname}</a>
				</p>
			{/if}
			<div data-text="mono muted">
				{entityId.fullname}
			</div>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditComment}
			{entityId}
		>
			<QueryBoundary
				query={rowQuery}
			>
				{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No Reddit comment data in the app for this fullname yet.
						</p>
					{:else}
						<dl>
							<div>
								<dt>Comment id</dt>
								<dd>
									<span data-text="mono">
										{entityId.fullname}
									</span>
								</dd>
							</div>
							{#if f?.author !== undefined}
								<div>
									<dt>Author</dt>
									<dd>u/{f.author}</dd>
								</div>
							{/if}
							{#if f?.linkId !== undefined}
								<div>
									<dt>Post</dt>
									<dd>
										<a
											href={resolve(
												'/(social)/reddit/link/[fullname]',
												{ fullname: encodeURIComponent(f.linkId.fullname) },
											)}
										>Post {f.linkId.fullname}</a>
									</dd>
								</div>
							{/if}
							{#if f?.body !== undefined}
								<div>
									<dt>Body</dt>
									<dd>{f.body}</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
