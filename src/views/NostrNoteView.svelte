<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.NostrNote> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	let revealedContentWarningSelectorKey = $state<string>()
	const contentWarningSelectorKey = $derived(stringify(selection.entitySelector))
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.NostrBand_Rest,
			Source.Primal_Rest,
		],
	}))
	const nostrNote = $derived(viewSelection({
		fields: {
			kind: true,
			pubkey: true,
			content: true,
			createdAt: true,
			sensitive: true,
			contentWarning: true,
		},
	}))
	const titleFallback = $derived((
		pendingEntity.sensitive === true || (pendingEntity.contentWarning ?? '').trim() !== '' ?
			[(pendingEntity.contentWarning ?? '').trim() || 'Sensitive content', (pendingEntity.eventId ?? '')].filter(Boolean).join(' ')
		:
			(prefetched.content ?? '') || selection.entitySelector.eventId || 'Nostr note'
	))


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/note/[eventId=stringSegment]',
				{
					eventId: selection.entitySelector.eventId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrNote}>
			{#snippet children(entity)}
				{
					entity.sensitive === true || (entity.contentWarning ?? '').trim() !== '' ?
							[(entity.contentWarning ?? '').trim() || 'Sensitive content', (pendingEntity.eventId ?? '')].filter(Boolean).join(' ')
						:
							(entity.content ?? '') || title || titleFallback
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrNote}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet ContentWarningContent(content)}
		{#if content != null && content !== ''}
			<p data-text="long-text">{content}</p>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.eventId} />
				</dd>
			</div>

			{#if contentOpen}
				<ResourceBoundary
					resource={nostrNote}
				>
					{#snippet children(entity)}
						{@const createdAt = entity.createdAt}
						{#if createdAt != null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={createdAt} />
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
							resource={nostrNote}
						>
							{#snippet children(entity)}
								{entity.kind}
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
							resource={nostrNote}
						>
							{#snippet children(entity)}
								<TruncatedValue value={entity.pubkey} />
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$author}
				>
					{#snippet children(nostrProfile)}
						{#if nostrProfile != null}
							<div>
								<dt>Author profile</dt>
								<dd>
									<NostrProfileView
										selection={select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector])}
										prefetched={nostrProfile}
										layout={EntityLayout.Value}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$replyToNote}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null}
							<div>
								<dt>Reply to</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
										layout={EntityLayout.Value}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$rootNote}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null}
							<div>
								<dt>Root note</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
										layout={EntityLayout.Value}
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
				viewSelection({
					fields: {
						content: true,
						sensitive: true,
						contentWarning: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const content = entity.content}
				{@const contentWarningText = (entity.contentWarning ?? '').trim()}
				{#if entity.sensitive === true || contentWarningText !== ''}
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
		{@const repliesResource = selection.$$replies}
		<ResourceBoundary
			resource={repliesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrNotesView
						selection={repliesResource}
						countResource={repliesResource.count}
						title='Replies'
						id='replies'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const reactionsResource = selection.$$reactions}
		<ResourceBoundary
			resource={reactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrReactionsView
						selection={reactionsResource}
						countResource={reactionsResource.count}
						title='Reactions'
						id='reactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
