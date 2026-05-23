<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'

	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.RedditComment>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				{(
					comment.body ?
						comment.body
					:
						entityId.fullname
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit organizes posts with nested threaded replies anchored on a submission.
		</p>
		<p>
			It is unrelated to realtime collaboration rooms here or casts on other networks.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if !open}
				<div>
					<dt>Comment</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading Reddit comment…"
						>
							{#snippet children(comment)}
								{#if !comment.body}
									<p data-text="muted">No comment text.</p>
								{:else}
									<p>{comment.body}</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if open}
				<div>
					<dt>Reddit fullname</dt>
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
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading Reddit comment…"
						>
							{#snippet children(comment)}
								u/{comment.author}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>Submission</dt>
					<dd>
						<ResourceBoundary
							resource={comment}
							placeholderText="Loading Reddit comment…"
						>
							{#snippet children(comment)}
								{#if comment.$link !== undefined}
									<a
										href={resolve(
											'/(social)/reddit/link/[fullname]',
											{ fullname: encodeURIComponent(comment.$link[EntityMetaKey.Id].fullname) },
										)}
									>{comment.$link[EntityMetaKey.Id].fullname}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
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
				placeholderText="Loading Reddit comment…"
			>
				{#snippet children(comment)}
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
