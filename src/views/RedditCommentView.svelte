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
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading comment…"
		>
			{#snippet children(c)}
				{(
					c.body ?
						c.body
					:
						entityId.fullname
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading comment…"
		>
			{#snippet children(c)}
				{#if !c.body}
					<p data-text="muted">No comment text.</p>
				{:else}
					<p>{c.body}</p>
				{/if}
				<dl data-column-item="center">
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

					{#if open}
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
					{/if}
					{#if open}
						<div>
							<dt>Author</dt>
							<dd>u/{c.author}</dd>
						</div>
					{/if}
					{#if open}
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
					{/if}
					{#if open}
						<div>
							<dt>Body</dt>
							<dd>{c.body}</dd>
						</div>
					{/if}
				</dl>
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
				{#snippet children(_c)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
