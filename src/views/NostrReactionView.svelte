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


	// Props
	let {
		entityId,
		href,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrReaction>
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
			| 'Content'
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
			content: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrReaction}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.eventId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

		{Title()}
		<ResourceBoundary
			resource={reaction}
			placeholderText="Loading reaction…"
		>
			{#snippet children(reaction)}
				{reaction.content ?? '+'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-7 reactions carry emoji or “+” content referencing a target kind-1 note event id in <code>e</code>-tags.
		</p>
		<p>
			The reaction’s own event id is a 64-character lowercase hex hash distinct from the target note’s event id.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if reaction.content}
				<div>
					<dt>Content</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								{reaction.content}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if reaction.createdAt != null}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								<Timestamp
									timestamp={reaction.createdAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if reaction.$author}
					<div>
						<dt>Author</dt>
						<dd>
							<ResourceBoundary
								resource={reaction}
								placeholderText="Loading reaction…"
							>
								{#snippet children(reaction)}
									<NostrProfileView
										entityId={reaction.$author[EntityMetaKey.Id]}
										href={resolve('/nostr/profile/[pubkey]', {
											pubkey: reaction.$author[EntityMetaKey.Id].pubkey,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if reaction.$targetNote}
					<div>
						<dt>Target note</dt>
						<dd>
							<ResourceBoundary
								resource={reaction}
								placeholderText="Loading reaction…"
							>
								{#snippet children(reaction)}
									<NostrNoteView
										entityId={reaction.$targetNote[EntityMetaKey.Id]}
										href={resolve('/nostr/note/[eventId]', {
											eventId: reaction.$targetNote[EntityMetaKey.Id].eventId,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
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
