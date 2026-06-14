<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
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
			{@const parent = subscribe(entityFieldReference.entityType,
		entityFieldReference.selector,({ sources: [Source.Constants_Internal], fields: { [entityFieldReference.fieldName]: {
				sources: [
					Source.X_Rest,
					Source.X_FxEmbed_Rest,
				],
			},
		} }),
	)}
			{@const posts = derive(
		parent,
		(parent) => {
			const xPosts: readonly Entity<typeof schema, EntityType.XPost>[] = (
				parent.fields[entityFieldReference.fieldName]?.values ?? []
			)
			return (
				xPosts
					.map((value) => ({
						value,
					}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.XPost}
				id={`${id}-items`}
				href={href}
				{title}
				getKey={(row) => stringify(row.value[EntityMetaKey.Selector])}
				getSortValue={(row) => row.value[EntityMetaKey.Selector].id}
				resource={posts}
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
							selector={{ id: item.value[EntityMetaKey.Selector].id }}
							layout={EntityLayout.Summary}
							open={false}
						/>
					{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
