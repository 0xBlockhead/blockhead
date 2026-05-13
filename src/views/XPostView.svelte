<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const post = useEntity(
		EntityType.XPost,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XPost]?.map((r) => r.source)
				?? [Source.Local_Internal]
			),
			text: {},
			createdAt: {},
			$author: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(row)}
				<HeadingComponent>
					{#if href}
						<a href={href}>
							<TruncatedValue
								endLength={8}
								format={TruncatedValueFormat.Visual}
								startLength={88}
								value={row.text ?? entityId.id}
							/>
						</a>
					{:else}
						<TruncatedValue
							endLength={8}
							format={TruncatedValueFormat.Visual}
							startLength={88}
							value={row.text ?? entityId.id}
						/>
					{/if}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(row)}
				{#if row.text}
					<p>
						{row.text}
					</p>
				{/if}
				{#if row.$author}
					<p data-text="muted">
						<a
							href={resolve(
								'/(social)/x/user/[userId]',
								{
									userId: encodeURIComponent(
										row.$author[EntityMetaKey.Id].id,
									),
								},
							)}
						>Author (id {row.$author[EntityMetaKey.Id].id})</a>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
		<div data-text="mono muted">
			{entityId.id}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.XPost}
			{entityId}
		>
			<ResourceBoundary
				resource={post}
				placeholderText="Loading post…"
			>
				{#snippet children(row)}
					{#if (
						row.text === undefined
						&& row.createdAt === undefined
						&& row.$author === undefined
					)}
						<p data-text="muted">
							Post details are not available yet.
						</p>
					{:else}
						<dl>
							{#if row.$author}
								<div>
									<dt>Author id</dt>
									<dd>{row.$author[EntityMetaKey.Id].id}</dd>
								</div>
							{/if}
							{#if row.text}
								<div>
									<dt>Text</dt>
									<dd>{row.text}</dd>
								</div>
							{/if}
							{#if row.createdAt !== undefined}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={row.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						</dl>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
