<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/nostr/note/[eventId]', {
			eventId: entityId.eventId,
		}),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrNote>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const note = useEntity(
		EntityType.NostrNote,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			content: {},
			createdAt: {},
			replyToEventId: {},
			rootEventId: {},
			tags: {},
			$replyToNote: {},
			$author: {},
			...(open ?
				{
					$$replies: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
					$$reactions: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNote}
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
			resource={note}
			placeholderText="Loading note…"
		>
			{#snippet children(loadedNote)}
				{#if loadedNote.content}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={loadedNote.content}
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
			Kind-1 text notes carry a content field and optional NIP-10 <code>e</code>-tag reply markers; <code>$replyToNote</code> links the direct parent.
		</p>
		<p>
			Event ids are 64-character lowercase hex hashes; author pubkeys (64 hex) link to kind-0 profile metadata. Replies and reactions load on <code>$$replies</code> and <code>$$reactions</code> via NostrBand and Primal indexers.
		</p>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={note}
		>
			{#snippet children(loadedNote)}
				{#if loadedNote.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={loadedNote.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if (
				open
				&& note.$author
			)}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								<NostrProfileView
									entityId={loadedNote.$author[EntityMetaKey.Id]}
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
				&& note.$replyToNote
			)}
				<div>
					<dt>Reply to</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								<NostrNoteView
									entityId={loadedNote.$replyToNote[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{:else if open && note.replyToEventId}
				<div>
					<dt>Reply to</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								<a
									data-link
									href={resolve('/nostr/note/[eventId]', {
										eventId: loadedNote.replyToEventId,
									})}
								>
									<TruncatedValue
										endLength={12}
										format={TruncatedValueFormat.Visual}
										startLength={20}
										value={loadedNote.replyToEventId}
									/>
								</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& note.rootEventId
				&& note.rootEventId !== note.replyToEventId
			)}
				<div>
					<dt>Thread root</dt>
					<dd>
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(loadedNote)}
								<a
									data-link
									href={resolve('/nostr/note/[eventId]', {
										eventId: loadedNote.rootEventId,
									})}
								>
									<TruncatedValue
										endLength={12}
										format={TruncatedValueFormat.Visual}
										startLength={20}
										value={loadedNote.rootEventId}
									/>
								</a>
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
		{@const idKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.NostrNote}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-note`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'content', label: 'Note text' },
					{ id: 'replies', label: 'Reply thread' },
					{ id: 'reactions', label: 'Reactions' },
				] as const}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Note thread
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionContent()}
					<ResourceBoundary
						resource={note}
						placeholderText="Loading note…"
					>
						{#snippet children(loadedNote)}
							{#if loadedNote.content}
								<p>{loadedNote.content}</p>
							{:else}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No text yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Note body resolves when NostrBand or Primal returns the signed kind-1 event—not from a WebSocket relay subscription.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Note content"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionReplies()}
					<NostrNotesView
						href={resolve(
			'/(social)/(nostr)/nostr/note/[eventId]/(note)/replies',
			{ eventId: entityId.eventId },
		)}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.NostrNote,
							entityId,
							fieldName: '$$replies',
						}}
						id={`${idKey}:replies`}
						open={true}
						title="Reply thread"
					/>
				{/snippet}

				{#snippet SectionReactions()}
					<NostrReactionsView
						href={resolve('/nostr/reactions')}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.NostrNote,
							entityId,
							fieldName: '$$reactions',
						}}
						id={`${idKey}:reactions`}
						open={true}
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
