<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.NostrNote>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.NostrNote>
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
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector]))
	const nostrNote = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			content: true,
			createdAt: true,
			sensitive: true,
			contentWarning: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			kind: true,
			pubkey: true,
			content: true,
			createdAt: true,
			sensitive: true,
			contentWarning: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sensitive === true || String(pendingEntity.contentWarning ?? '').trim() !== '' ? [String(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((pendingEntity.eventId) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((pendingEntity.content) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr note'))
	const viewDomId = $derived('nostr-note-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import Collapsible from '$/components/Collapsible.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrNote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'eventId' in selection.entitySelector
			&& selection.entitySelector.eventId != null ?
				resolve('/nostr/note/[eventId=stringSegment]', {
			eventId: String(selection.entitySelector.eventId ?? ''),
		})
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrNote}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{(resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== '' ? [String(resolvedEntity.contentWarning ?? '').trim() || 'Sensitive content', [String((resolvedEntity.eventId) ?? '')].filter(Boolean).join(' ')].filter(Boolean).join(' ') : [String((resolvedEntity.content) ?? '')].filter(Boolean).join(' ') || title || titleFallback)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrNote}>
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

	{#snippet ContentWarningContent(content)}
		{#if content !== undefined && content !== null && content !== ''}
			<p data-text="long-text">{String((content) ?? '')}</p>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Event ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									eventId: true,
								},
							})
						}
					>
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
							sources: selection.sources,
							fields: {
								createdAt: true,
							},
						})
					}
				>
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
									sources: selection.sources,
									fields: {
										kind: true,
									},
								})
							}
						>
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
									sources: selection.sources,
									fields: {
										pubkey: true,
									},
								})
							}
						>
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
						selection
							.$author({
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
										href={
											(
												nostrProfile[EntityMetaKey.Selector] != null && 'pubkey' in nostrProfile[EntityMetaKey.Selector]
												&& nostrProfile[EntityMetaKey.Selector].pubkey != null ?
													resolve('/nostr/profile/[pubkey=stringSegment]', {
												pubkey: String(nostrProfile[EntityMetaKey.Selector].pubkey ?? ''),
											})
											:
													undefined
											)
										}
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
						selection
							.$replyToNote({
								sources: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							})
					}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null && nostrNote[EntityMetaKey.Selector] != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
										href={
											(
												nostrNote[EntityMetaKey.Selector] != null && 'eventId' in nostrNote[EntityMetaKey.Selector]
												&& nostrNote[EntityMetaKey.Selector].eventId != null ?
													resolve('/nostr/note/[eventId=stringSegment]', {
												eventId: String(nostrNote[EntityMetaKey.Selector].eventId ?? ''),
											})
											:
													undefined
											)
										}
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
						selection
							.$rootNote({
								sources: [
									Source.NostrBand_Rest,
									Source.Primal_Rest,
								],
							})
					}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null && nostrNote[EntityMetaKey.Selector] != null}
							<div>
								<dt>Root note</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
										href={
											(
												nostrNote[EntityMetaKey.Selector] != null && 'eventId' in nostrNote[EntityMetaKey.Selector]
												&& nostrNote[EntityMetaKey.Selector].eventId != null ?
													resolve('/nostr/note/[eventId=stringSegment]', {
												eventId: String(nostrNote[EntityMetaKey.Selector].eventId ?? ''),
											})
											:
													undefined
											)
										}
										layout={EntityLayout.Value}
										open={false}
									/>
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
					sources: selection.sources,
					fields: {
						content: true,
						sensitive: true,
						contentWarning: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const content = resolvedEntity.content}
				{@const contentWarningText = String(resolvedEntity.contentWarning ?? '').trim()}
				{@const hasContentWarning = resolvedEntity.sensitive === true || String(resolvedEntity.contentWarning ?? '').trim() !== ''}
				{#if hasContentWarning}
					<Collapsible
						open={revealedContentWarningSelectorKey === contentWarningSelectorKey}
						ontoggle={(event) => {
							revealedContentWarningSelectorKey = event.currentTarget.open ? contentWarningSelectorKey : undefined
						}}
					>
						{#snippet Summary()}
							<header data-row="align-center gap-3 wrap">
								<strong>{contentWarningText || 'Sensitive content'}</strong>
								<span data-text="annotation">Show content</span>
							</header>
						{/snippet}

						{#if revealedContentWarningSelectorKey === contentWarningSelectorKey}
							{@render ContentWarningContent(content)}
						{/if}
					</Collapsible>
				{:else}
					{@render ContentWarningContent(content)}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
				{@const nostrNoteNostrNotesViewRepliesResource = selection
		.$$replies({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
				<ResourceBoundary
					resource={nostrNoteNostrNotesViewRepliesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NostrNotesView
							selection={nostrNoteNostrNotesViewRepliesResource}
							countResource={nostrNoteNostrNotesViewRepliesResource.count}
							title='Replies'
							id='NostrNotesView-replies'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
				{@const nostrNoteNostrReactionsViewReactionsResource = selection
		.$$reactions({
			sources: [
				Source.Constants_Internal,
				Source.NostrBand_Rest,
			],
		})}
				<ResourceBoundary
					resource={nostrNoteNostrReactionsViewReactionsResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<NostrReactionsView
							selection={nostrNoteNostrReactionsViewReactionsResource}
							countResource={nostrNoteNostrReactionsViewReactionsResource.count}
							title='Reactions'
							id='NostrReactionsView-reactions'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
