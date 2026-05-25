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
		href = resolve(
			'/(social)/(nostr)/nostr/repost/[eventId]',
			{ eventId: entityId.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrRepost>
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

	const repost = useEntity(
		EntityType.NostrRepost,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			createdAt: {},
			repostedEventId: {},
			$author: {},
			$repostedNote: {
				content: {},
			},
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
	entityType={EntityType.NostrRepost}
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
			resource={repost}
			placeholderText="Loading repost…"
		>
			{#snippet children(loadedRepost)}
				{#if loadedRepost.$repostedNote?.content}
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={loadedRepost.$repostedNote.content}
					/>
				{:else if loadedRepost.repostedEventId}
					<TruncatedValue
						value={loadedRepost.repostedEventId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					<TruncatedValue
						value={entityId.eventId}
						format={TruncatedValueFormat.Visual}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			NIP-18 repost events (kind 6 legacy note reposts, kind 16 generic reposts) reference another event via an <code>e</code>-tag on the signed payload.
		</p>
		<p>
			The repost event id is a 64-character lowercase hex hash of the repost event—not the referenced event’s id.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if loadedRepost.createdAt != null}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(loadedRepost)}
								<Timestamp
									timestamp={loadedRepost.createdAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& repost.$author
			)}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(loadedRepost)}
								<NostrProfileView
									entityId={loadedRepost.$author[EntityMetaKey.Id]}
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
				&& repost.$repostedNote
			)}
				<div>
					<dt>Reposted note</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(loadedRepost)}
								<NostrNoteView
									entityId={loadedRepost.$repostedNote[EntityMetaKey.Id]}
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
			entityType={EntityType.NostrRepost}
			{entityId}
		/>
	{/snippet}
</EntityView>

