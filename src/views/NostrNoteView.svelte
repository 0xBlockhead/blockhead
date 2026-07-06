<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
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
		},
	}))
	const titleFallback = $derived([String((prefetched.content) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.eventId ?? prefetched.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note')
	const viewDomId = $derived('nostr-note-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrNote}>
			{#snippet Pending()}
				{@const content0 = prefetched.content}
				{#if content0 !== undefined && content0 !== null}
					<span data-text="long-text">{String((content0) ?? '')}</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content0 = resolvedEntity.content}
				{#if content0 !== undefined && content0 !== null}
					<span data-text="long-text">{String((content0) ?? '')}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr text note is a kind-1 event addressed by event id; author, reply, root, reaction, and relay facets remain separate fields.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Event ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventId = selection.entitySelector.eventId ?? prefetched.eventId}
							{#if eventId !== undefined && eventId !== null}
								<TruncatedValue value={String((eventId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventId = resolvedEntity.eventId}
							{#if eventId !== undefined && eventId !== null}
								<TruncatedValue value={String((eventId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
							fields: {
								createdAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const createdAt = prefetched.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const createdAt = resolvedEntity.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
										Source.NostrBand_Rest,
									],
									fields: {
										kind: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const kind = prefetched.kind}
								{#if kind !== undefined && kind !== null}
									{String((kind) ?? '')}
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const kind = resolvedEntity.kind}
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
						<ResourceBoundary
							resource={
								selection({
									sources: [
										Source.Constants_Internal,
										Source.NostrBand_Rest,
									],
									fields: {
										pubkey: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const pubkey = prefetched.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String((pubkey) ?? '')} />
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const pubkey = resolvedEntity.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String((pubkey) ?? '')} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection[EntityProxyField]<EntityType.NostrProfile, false>('$author', {
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				>
					{#snippet children(nostrProfile)}
						{#if nostrProfile != null && nostrProfile[EntityMetaKey.Selector] != null}
							<div>
								<dt>Author profile</dt>
								<dd>
									<NostrProfileView
										selection={select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector])}
										prefetched={nostrProfile}
										layout={EntityLayout.Value}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
							],
							fields: {
								replyToEventId: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const replyToEventId = prefetched.replyToEventId}
						{#if replyToEventId !== undefined && replyToEventId !== null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<TruncatedValue value={String((replyToEventId) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const replyToEventId = resolvedEntity.replyToEventId}
						{#if replyToEventId !== undefined && replyToEventId !== null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<TruncatedValue value={String((replyToEventId) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.NostrBand_Rest,
							],
							fields: {
								rootEventId: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const rootEventId = prefetched.rootEventId}
						{#if rootEventId !== undefined && rootEventId !== null}
							<div>
								<dt>Root note</dt>
								<dd>
									<TruncatedValue value={String((rootEventId) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const rootEventId = resolvedEntity.rootEventId}
						{#if rootEventId !== undefined && rootEventId !== null}
							<div>
								<dt>Root note</dt>
								<dd>
									<TruncatedValue value={String((rootEventId) ?? '')} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<ResourceBoundary
			resource={
				selection({
					sources: [
						Source.Constants_Internal,
						Source.NostrBand_Rest,
					],
					fields: {
						content: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{#if content !== undefined && content !== null && content !== ''}
					<p data-text="long-text">{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NostrNotesView
				selection={
						selection[EntityProxyField]<EntityType.NostrNote>('$$replies', {
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Replies'
				href={resolve('/(social)/(nostr)/nostr/notes')}
				emptyText='No replies in this source window.'
				id='NostrNotesView-$$replies'
			/>

			<NostrReactionsView
				selection={
						selection[EntityProxyField]<EntityType.NostrReaction>('$$reactions', {
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
						})
					}
				title='Reactions'
				href={resolve('/(social)/(nostr)/nostr/reactions')}
				emptyText='No reactions in this source window.'
				id='NostrReactionsView-$$reactions'
			/>
		{/if}
	{/snippet}
</EntityView>
