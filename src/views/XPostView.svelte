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
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}



	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(resolvedXPost)}
				{#if resolvedXPost.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={resolvedXPost.text}
					/>
				{:else}
					{entityId.id}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(resolvedXPost)}
				{#if resolvedXPost.text}
					{#if !open}
						<p>
							{resolvedXPost.text}
						</p>
					{/if}
				{/if}
				{#if resolvedXPost.$author}
					<p data-text="muted">
						<a
							href={resolve(
								'/(social)/x/user/[userId]',
								{
									userId: encodeURIComponent(
										resolvedXPost.$author[EntityMetaKey.Id].id,
									),
								},
							)}
						>Author (id {resolvedXPost.$author[EntityMetaKey.Id].id})</a>
					</p>
				{/if}
				<dl data-column-item="center">
						{#if resolvedXPost.text}
							<div>
								<dt>Post id</dt>
								<dd data-text="mono">
									{@render Id()}
								</dd>
							</div>
						{/if}
						{#if open}
							{#if resolvedXPost.text}
								<div>
									<dt>Text</dt>
									<dd>{resolvedXPost.text}</dd>
								</div>
							{/if}
							{#if resolvedXPost.createdAt != null}
								<div>
									<dt>Created at</dt>
									<dd>
										<Timestamp
											timestamp={resolvedXPost.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}
						{/if}
					</dl>
			{/snippet}
		</ResourceBoundary>
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
				{#snippet children(resolvedXPost)}
					{#if (
						!resolvedXPost.text
						&& resolvedXPost.createdAt == null
						&& !resolvedXPost.$author
					)}
						<p data-text="muted">
							Post details are not available yet.
						</p>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>
	{/snippet}
</EntityView>
