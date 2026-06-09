<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'
	// State
	let {
		entityFieldReference,
		id,
		href = '',
		limit = 50,
		open = $bindable(true),
		sortMode = 'api',
		title = 'Top-level comments',
		CollapsibleProps = {},
	}: {
		entityFieldReference: EntityFieldReference<typeof schema, EntityType.RedditComment>
		id: string
		href?: string
		limit?: number
		open?: boolean
		sortMode?: 'api' | 'createdAtAsc' | 'createdAtDesc'
		title?: string
		CollapsibleProps?: ComponentProps<typeof EntitiesList>['CollapsibleProps']
	} = $props()

	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>


<div data-column="gap-2">
	<EntitiesList
	{CollapsibleProps}
		entityType={EntityType.RedditComment}
	{id}
		{title}
		bind:open
>
	{#snippet TypeAnnotationTooltip()}
				<p>
					{(
						entityFieldReference.fieldName === '$$replies' ?
							'Direct replies nested under this comment in Reddit’s threaded model.'
						:
							'Top-level comments are direct replies to a Reddit submission.'
					)}
				</p>
				<p>
					They are specific to Reddit’s data model—not Farcaster feeds or in-app multiplayer chat.
				</p>
			{/snippet}

	{#snippet body()}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
		entityFieldReference.entityType,
		entityFieldReference.entityId,({ sources: [
				Source.Constants_Internal,
				Source.Reddit_Rest,
			], fields: { [entityFieldReference.fieldName]: {
				sources: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				],
				limit,
				...(sortMode !== 'api' && {
					fields: {
						createdAt: true,
					},
				}),
			},
		} }),
	)}
			{@const comments = derive(
		parent,
		(parent) => {
			const redditComments: readonly Entity<typeof schema, EntityType.RedditComment>[] = parent.fields[entityFieldReference.fieldName]?.values ?? []
			return (
				redditComments.map((comment, index) => ({
					comment,
					sortKey: (
						sortMode === 'api' ?
							index
						: sortMode === 'createdAtAsc' ?
							comment.createdAt ?? Number.POSITIVE_INFINITY
						:
							-(comment.createdAt ?? Number.NEGATIVE_INFINITY)
					),
				}))
			)
		},
	)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.RedditComment}
				id={`${id}-items`}
				href={href}
				{title}
				resource={comments}
				placeholderText="Loading comment thread…"
				getKey={(comment) => comment.comment[EntityMetaKey.Id].fullname}
				getSortValue={(comment) => comment.sortKey}
				placeholderKeys={new SvelteSet<string>()}
				open={true}
			>
				{#snippet Empty()}
							<p data-text="muted">
								{(
									entityFieldReference.fieldName === '$$replies' ?
										'No replies yet.'
									:
										'No comments yet.'
								)}
							</p>
						{/snippet}

				{#snippet Item({
							item: comment,
						})}
							<RedditCommentView
								entityId={comment.comment[EntityMetaKey.Id]}
								layout={EntityLayout.Summary}
								open={false}
							/>
						{/snippet}

			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
</div>
