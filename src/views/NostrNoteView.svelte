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
			entityId: EntityId<typeof schema, EntityType.NostrNote>
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
			resource={note}
			placeholderText="Loading note…"
		>
			{#snippet children(note)}
				{#if note.content}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={note.content}
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
			placeholderText=""
		>
			{#snippet children(note)}
				{#if note.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={note.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if open}
				{#if note.content}
					<div>
						<dt>Content</dt>
						<dd>
							<ResourceBoundary
								resource={note}
								placeholderText="Loading note…"
							>
								{#snippet children(note)}
									{note.content}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if note.$author}
					<div>
						<dt>Author</dt>
						<dd>
							<ResourceBoundary
								resource={note}
								placeholderText="Loading note…"
							>
								{#snippet children(note)}
									<NostrProfileView
										entityId={note.$author[EntityMetaKey.Id]}
										href={resolve('/nostr/profile/[pubkey]', {
											pubkey: note.$author[EntityMetaKey.Id].pubkey,
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
				{#if note.$replyToNote}
					<div>
						<dt>Reply to</dt>
						<dd>
							<ResourceBoundary
								resource={note}
								placeholderText="Loading note…"
							>
								{#snippet children(note)}
									<NostrNoteView
										entityId={note.$replyToNote[EntityMetaKey.Id]}
										href={resolve('/nostr/note/[eventId]', {
											eventId: note.$replyToNote[EntityMetaKey.Id].eventId,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{:else if note.replyToEventId}
					<div>
						<dt>Reply to</dt>
						<dd>
							<ResourceBoundary
								resource={note}
								placeholderText="Loading note…"
							>
								{#snippet children(note)}
									<a
										data-link
										href={resolve('/nostr/note/[eventId]', {
											eventId: note.replyToEventId,
											})}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={note.replyToEventId}
										/>
									</a>
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Note text"
						href={`#${idKey}:content`}
					>Text</a>
					<a
						data-scroll-marker-label="Reply thread"
						href={`#${idKey}:replies`}
					>Replies</a>
					<a
						data-scroll-marker-label="Reactions"
						href={`#${idKey}:reactions`}
					>Reactions</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Note text">
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
								{#if note.content}
									<p>{note.content}</p>
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
					</section>

					<section data-scroll-marker-label="Reply thread">
						<NostrNotesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNote,
								entityId,
								fieldName: '$$replies',
							}}
							href={resolve('/nostr/note/[eventId]/replies', {
								eventId: entityId.eventId,
							})}
							id={`${idKey}:replies`}
							open={_sectionOpen}
							title="Reply thread"
						/>
					</section>

					<section data-scroll-marker-label="Reactions">
						<NostrReactionsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrNote,
								entityId,
								fieldName: '$$reactions',
							}}
							href={`${resolve('/nostr/reactions')}?note=${entityId.eventId}`}
							id={`${idKey}:reactions`}
							open={_sectionOpen}
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
