<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(nostr)/nostr/note/[eventId]', {
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
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const note = subscribe(EntityType.NostrNote,
		entityId,
		({ sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			], fields: { eventId: true, pubkey: true, content: true, createdAt: true, replyToEventId: true, rootEventId: true, tags: true, $replyToNote: true, $author: true, ...(open ? ({ $$replies: ({ sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						] }), $$reactions: ({ sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						] }) }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
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
			{#snippet children(note)}
				{#if note.fields.content}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={note.fields.content}
					/>
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={note}
		>
			{#snippet children(note)}
				{#if note.fields.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={note.fields.createdAt}
						/>
					</span>
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

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if open}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(note)}
						{#if note.fields.eventId}
							<div>
								<dt>Event id</dt>
								<dd>
									<TruncatedValue
										value={note.fields.eventId}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
						{#if note.fields.$author}
				<div>
					<dt>Author</dt>
					<dd>
								<NostrProfileView
									entityId={note.fields.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Value}
									open={false}
								/>
					</dd>
				</div>
			{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
						<ResourceBoundary
							resource={note}
							placeholderText="Loading note…"
						>
							{#snippet children(note)}
						{#if note.fields.$replyToNote || note.fields.replyToEventId}
				<div>
					<dt>Reply to</dt>
					<dd>
								{#if note.fields.$replyToNote}
										<svelte:self
										entityId={note.fields.$replyToNote[EntityMetaKey.Id]}
										layout={EntityLayout.Value}
											open={false}
									/>
								{:else if note.fields.replyToEventId}
									<a
										data-link
										href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
											eventId: note.fields.replyToEventId,
										})}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={note.fields.replyToEventId}
										/>
									</a>
								{/if}
					</dd>
				</div>
			{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if open}
				<ResourceBoundary
					resource={note}
					placeholderText="Loading note…"
				>
					{#snippet children(note)}
						{#if (
							note.fields.rootEventId
							&& note.fields.rootEventId !== note.fields.replyToEventId
						)}
							<div>
								<dt>Thread root</dt>
								<dd>
									<a
										data-link
										href={resolve('/(social)/(nostr)/nostr/note/[eventId]', {
											eventId: note.fields.rootEventId,
										})}
									>
										<TruncatedValue
											endLength={12}
											format={TruncatedValueFormat.Visual}
											startLength={20}
											value={note.fields.rootEventId}
										/>
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idKey = stringify(entityId)}
		<CollapsibleTabs
			id={`${idKey}:carousel-note`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'content', label: 'Note text' },
				{ id: 'replies', label: 'Reply thread' },
				{ id: 'reactions', label: 'Reactions' },
			])}
			data-card
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
					{#snippet children(note)}
						{#if note.fields.content}
							<p>{note.fields.content}</p>
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
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(social)/(nostr)/nostr/note/[eventId]/(note)/replies',
						{ eventId: entityId.eventId },
					)}
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
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/nostr/reactions')}
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
	{/snippet}
</EntityView>
