<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(social)/(nostr)/nostr/reaction/[eventId]',
			{ eventId: entityId.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrReaction>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const reaction = useEntity(
		EntityType.NostrReaction,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			createdAt: {},
			$author: {},
			$targetNote: {},
			$targetArticle: {},
			content: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrReaction}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.eventId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={reaction}
			placeholderText="Loading reaction…"
		>
			{#snippet children(loadedReaction)}
				{loadedReaction.content ?? '+'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-7 reactions carry emoji or “+” content referencing a target note (<code>e</code>-tag event id) or NIP-23 article (<code>a</code>-tag coordinate).
		</p>
		<p>
			The reaction’s own event id is a 64-character lowercase hex hash distinct from the target document’s id.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if loadedReaction.content}
				<div>
					<dt>Content</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(loadedReaction)}
								{loadedReaction.content}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if loadedReaction.createdAt != null}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(loadedReaction)}
								<Timestamp
									timestamp={loadedReaction.createdAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& reaction.$author
			)}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(loadedReaction)}
								<NostrProfileView
									entityId={loadedReaction.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& reaction.$targetNote
			)}
				<div>
					<dt>Target note</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(loadedReaction)}
								<NostrNoteView
									entityId={loadedReaction.$targetNote[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& reaction.$targetArticle
			)}
				<div>
					<dt>Target article</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(loadedReaction)}
								<NostrArticleView
									entityId={loadedReaction.$targetArticle[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
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
			entityType={EntityType.NostrReaction}
			{entityId}
		/>
	{/snippet}
</EntityView>

