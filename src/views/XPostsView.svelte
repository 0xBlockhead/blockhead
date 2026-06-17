<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		entityFieldReference,
		id,
		href = '',
		open = $bindable(true),
		title = 'X posts',
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.XPost>
			id: string
			href?: string
			open?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import XPostView from '$/views/XPostView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	entityType={EntityType.XPost}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
			<p>
				Public posts on X (Twitter).
			</p>
			<p>
				Not Reddit threads, blob storage, pools, candle data, chats, or logs. Live lookup depends on OAuth or bearer credentials and X developer API availability.
			</p>
		{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [Source.Constants_Internal],
					}
				).field(entityFieldReference.fieldName, {
					sources: [Source.X_Rest, Source.X_FxEmbed_Rest],
				})} placeholderText={`Loading ${title.toLowerCase()}…`}>
				{#snippet children(posts)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.XPost}
						id={`${id}-items`}
						href={href}
						{title}
						getKey={(row) => stringify(row.entitySelector)}
						getSortValue={(row) => row.entitySelector.id}
						items={posts.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No X posts in this xPosts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<XPostView
								selector={{ id: item.entitySelector.id }}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
