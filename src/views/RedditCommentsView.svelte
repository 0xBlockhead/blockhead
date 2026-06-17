<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
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



	

	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import RedditCommentView from '$/views/RedditCommentView.svelte'
</script>

<div data-column="gap-2">
	<ResourceBoundary resource={proxy(
			entityFieldReference.entityType,
			entityFieldReference.selector,
			{
				sources: [
					Source.Constants_Internal,
					Source.Reddit_Rest,
				],
			}
		).field(entityFieldReference.fieldName, {
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
		})}>
		{#snippet children(comments)}
			<EntitiesList
				{CollapsibleProps}
				entityType={EntityType.RedditComment}
				{id}
				{title}
				href={href}
				bind:open
				items={comments.entities}
				getKey={(comment) => comment.entitySelector.fullname}
			>
				{#snippet TypeAnnotationTooltip()}
					<p>
						{
							entityFieldReference.fieldName === '$$replies' ?
								'Direct replies nested under this comment in Reddit’s threaded model.'
							:
								'Top-level comments are direct replies to a Reddit submission.'
						}
					</p>
					<p>
						They are specific to Reddit’s data model—not Farcaster feeds or in-app multiplayer chat.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<RedditCommentView
						selector={item.entitySelector}
						layout={EntityLayout.Summary}

						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
</div>
