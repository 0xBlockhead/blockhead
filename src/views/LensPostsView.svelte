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


	// State
	let {
		selection,
		id,
		limit = 25,
		open = $bindable(true),
		collapsible = true,
		title = 'Lens v3 publications',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LensPost>
			id: string
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
	bind:open
	{title}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens publications are recorded on-chain.
		</p>
		<p>
			They are not generic off-chain mirrors unless the protocol itself points at one.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
					sources: [Source.Lens_Graphql],
					limit,
				})}
				placeholderText="Loading Lens network…"
			>
				{#snippet children(posts)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.LensPost}
						id={`${id}-items`}
						{title}
						open={true}
						items={posts.entities}
						getKey={(post) => post.entitySelector.id}
						getSortValue={(post) => post.entitySelector.id}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No Lens publications in this slice yet.
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
