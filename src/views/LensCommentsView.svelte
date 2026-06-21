<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'


	// State
	let {
		selection,
		id = 'comments',
		limit = 50,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		title = 'Comments',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensPost>
			id?: string
			limit?: number
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import LensPostView from '$/views/LensPostView.svelte'
</script>


<EntitiesList
	entityType={EntityType.LensPost}

	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Comments are child publications linked through <code>$$comments</code> on the parent post; each row is a <code>LensPost</code> with <code>$commentOn</code> pointing at the parent id.
		</p>
		<p>
			The thread lensPosts resolves via Lens Protocol GraphQL endpoints—not Reddit, Farcaster, or XMTP message models.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No comments yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
			{#if open}
				<ResourceBoundary resource={selection({
						sources: [Source.Lens_Graphql],
						limit,
					})} placeholderText="Loading Lens comments…">
				{#snippet children(comments)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LensPost}
						id={`${id}-items`}
						{title}
						getKey={(comment) => stringify(comment.entitySelector)}
						getSortValue={(comment) => stringify(comment.entitySelector)}
						items={comments.entities}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No comments yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<LensPostView
								selection={select(EntityType.LensPost, { id: item.entitySelector.id })}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
