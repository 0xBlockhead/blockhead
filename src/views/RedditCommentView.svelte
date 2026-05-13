<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


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
			entityId: EntityId<typeof schema, EntityType.RedditComment>
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
			| 'Heading'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const comment = useEntity(
		EntityType.RedditComment,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
			],
			body: {},
			author: {},
			$link: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading comment…"
		>
			{#snippet children(c)}
				<HeadingComponent>
					{(
						c.body !== undefined && c.body.length > 0 ?
							c.body
						:
							entityId.fullname
					)}
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading comment…"
		>
			{#snippet children(c)}
				{#if c.body.trim() === ''}
					<p data-text="muted">No comment text.</p>
				{:else}
					<p>{c.body}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditComment}
			{entityId}
		>
			<ResourceBoundary
				resource={comment}
				placeholderText="Loading comment…"
			>
				{#snippet children(c)}
					<dl>
						<div>
							<dt>Comment id</dt>
							<dd>
								<span data-text="mono">
									<TruncatedValue
										value={entityId.fullname}
										format={TruncatedValueFormat.Visual}
									/>
								</span>
							</dd>
						</div>
						<div>
							<dt>Author</dt>
							<dd>u/{c.author}</dd>
						</div>
						{#if c.$link !== undefined}
							<div>
								<dt>Post</dt>
								<dd>
									<a
										href={resolve(
											'/(social)/reddit/link/[fullname]',
											{ fullname: encodeURIComponent(c.$link[EntityMetaKey.Id].fullname) },
										)}
									>Post {c.$link[EntityMetaKey.Id].fullname}</a>
								</dd>
							</div>
						{/if}
						<div>
							<dt>Body</dt>
							<dd>{c.body}</dd>
						</div>
					</dl>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
