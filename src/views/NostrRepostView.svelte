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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
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
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

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
			$repostedArticle: {},
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
	import NostrArticleView from '$/views/NostrArticleView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRepost}
	{entityId}
	href={href}
	bind:open
	{collapsible}
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
			{#snippet children(repost)}
				{#if repost.$repostedNote?.content}
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={repost.$repostedNote.content}
					/>
				{:else if repost.$repostedArticle}
					<NostrArticleView
						entityId={repost.$repostedArticle[EntityMetaKey.Id]}
						layout={EntityLayout.Title}
						open={false}
					/>
				{:else if repost.repostedEventId}
					<TruncatedValue
						value={repost.repostedEventId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
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

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={repost}
						placeholderText="Loading repost…"
					>
						{#snippet children(repost)}
							{#if repost.createdAt != null}
								<Timestamp
									timestamp={repost.createdAt}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$author}
									<NostrProfileView
										entityId={repost.$author[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reposted note</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$repostedNote}
									<NostrNoteView
										entityId={repost.$repostedNote[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reposted article</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$repostedArticle}
									<NostrArticleView
										entityId={repost.$repostedArticle[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
										open={false}
									/>
								{/if}
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
	{/snippet}
</EntityView>
