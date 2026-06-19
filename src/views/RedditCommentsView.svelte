<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	// State
	let {
		selection,
		id,
		href = '',
		limit = 50,
		open = $bindable(true),
		sortMode = 'api',
		title = 'Top-level comments',
		CollapsibleProps = {},
	}: {
		selection: EntityProxyEntitiesResource<typeof schema, EntityType.RedditComment>
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
	<ResourceBoundary resource={selection({
		sources: [
			Source.Constants_Internal,
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
							selection.fieldName === '$$replies' ?
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
						selection={select(EntityType.RedditComment, item.entitySelector)}
						layout={EntityLayout.Summary}

						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
</div>
