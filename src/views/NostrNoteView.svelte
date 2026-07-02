<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrNote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrNote>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const nostrNote = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			kind: true,
			pubkey: true,
			content: true,
			createdAt: true,
			$author: true,
			replyToEventId: true,
			rootEventId: true,
			...(open && {
				$$replies: true,
				$$reactions: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).content) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note')
	const viewDomId = $derived('nostr-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNote}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const content0 = ({ ...selection.entitySelector, ...prefetched }).content}
			{#if content0 !== undefined && content0 !== null}
				<span data-text="long-text">{String((content0) ?? '')}</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nostrNote}>
				{#snippet Pending()}
					{@const content0 = ({ ...selection.entitySelector, ...prefetched }).content}
					{#if content0 !== undefined && content0 !== null}
						<span data-text="long-text">{String((content0) ?? '')}</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const content0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).content}
					{#if content0 !== undefined && content0 !== null}
						<span data-text="long-text">{String((content0) ?? '')}</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const createdAt0 = prefetched.createdAt}
			{#if createdAt0 !== undefined && createdAt0 !== null}
				<span data-text="muted">
					<Timestamp timestamp={Number(createdAt0)} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nostrNote}>
				{#snippet Pending()}
					{@const createdAt0 = prefetched.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const createdAt0 = entity.createdAt}
					{#if createdAt0 !== undefined && createdAt0 !== null}
						<span data-text="muted">
							<Timestamp timestamp={Number(createdAt0)} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary resource={nostrNote}>
							{#snippet Pending()}
								{@const kind = prefetched.kind ?? selection.entitySelector.kind}
								{#if kind !== undefined && kind !== null}
									{String((kind) ?? '')}
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const kind = entity.kind ?? selection.entitySelector.kind ?? prefetched.kind}
								{#if kind !== undefined && kind !== null}
									{String((kind) ?? '')}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Author pubkey</dt>
					<dd>
						<ResourceBoundary resource={nostrNote}>
							{#snippet Pending()}
								{@const pubkey = prefetched.pubkey ?? selection.entitySelector.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String(pubkey)} />
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const pubkey = entity.pubkey ?? selection.entitySelector.pubkey ?? prefetched.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String(pubkey)} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.NostrProfile, false>('$author')}
				>
					{#snippet children(nostrProfile)}
						{#if nostrProfile != null}
							<div>
								<dt>Author profile</dt>
								<dd>
									<NostrProfileView
										selection={select(EntityType.NostrProfile, nostrProfile.entitySelector)}
										prefetched={nostrProfile}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrNote}>
					{#snippet Pending()}
						{@const replyToEventId = prefetched.replyToEventId ?? selection.entitySelector.replyToEventId}
						{#if replyToEventId !== undefined && replyToEventId !== null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<TruncatedValue value={String(replyToEventId)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const replyToEventId = entity.replyToEventId ?? selection.entitySelector.replyToEventId ?? prefetched.replyToEventId}
						{#if replyToEventId !== undefined && replyToEventId !== null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<TruncatedValue value={String(replyToEventId)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={nostrNote}>
					{#snippet Pending()}
						{@const rootEventId = prefetched.rootEventId ?? selection.entitySelector.rootEventId}
						{#if rootEventId !== undefined && rootEventId !== null}
							<div>
								<dt>Root note</dt>
								<dd>
									<TruncatedValue value={String(rootEventId)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const rootEventId = entity.rootEventId ?? selection.entitySelector.rootEventId ?? prefetched.rootEventId}
						{#if rootEventId !== undefined && rootEventId !== null}
							<div>
								<dt>Root note</dt>
								<dd>
									<TruncatedValue value={String(rootEventId)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NostrNotesView
				selection={selection[EntityProxyField]<EntityType.NostrNote>('$$replies')}
				title='Replies'
				href={resolve('/(social)/(nostr)/nostr/notes')}
				emptyText='No replies in this source window.'
				id='NostrNotesView-$$replies'
			/>

			<NostrReactionsView
				selection={selection[EntityProxyField]<EntityType.NostrReaction>('$$reactions')}
				title='Reactions'
				href={resolve('/(social)/(nostr)/nostr/reactions')}
				emptyText='No reactions in this source window.'
				id='NostrReactionsView-$$reactions'
			/>
		{/if}
	{/snippet}
</EntityView>
