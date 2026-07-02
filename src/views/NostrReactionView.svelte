<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.NostrReaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrReaction>>
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

	const nostrReaction = $derived(selection({
		sources: [
			Source.Primal_Rest,
			Source.NostrBand_Rest,
		],
		fields: {
			kind: true,
			pubkey: true,
			createdAt: true,
			content: true,
			$author: true,
			$targetNote: true,
			$targetArticle: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).content) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.eventId) ?? '')].filter(Boolean).join(' ') || 'Nostr reaction')
	const viewDomId = $derived('nostr-reaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrReaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={nostrReaction}
			placeholderText="Loading reaction..."
		>
			{#snippet Pending()}
				<TruncatedValue
					value={String(selection.entitySelector.eventId ?? '')}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}

			{#snippet children(entity)}
				{String(entity.content ?? '') || '+'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={String(selection.entitySelector.eventId ?? '')}
			format={TruncatedValueFormat.Visual}
		/>
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
			<ResourceBoundary resource={nostrReaction}>
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
			A Nostr reaction is a kind-7 event keyed by event id and scoped to the note or article it reacts to.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary resource={nostrReaction}>
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
						<ResourceBoundary resource={nostrReaction}>
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
								<dt>Author</dt>
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
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.NostrNote, false>('$targetNote')}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null}
							<div>
								<dt>Target note</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote.entitySelector)}
										prefetched={nostrNote}
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
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.NostrArticle, false>('$targetArticle')}
				>
					{#snippet children(nostrArticle)}
						{#if nostrArticle != null}
							<div>
								<dt>Target article</dt>
								<dd>
									<NostrArticleView
										selection={select(EntityType.NostrArticle, nostrArticle.entitySelector)}
										prefetched={nostrArticle}
										layout={EntityLayout.Title}
										open={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<ResourceBoundary resource={nostrReaction}>
			{#snippet children(entity)}
				{@const content = entity.content ?? selection.entitySelector.content ?? prefetched.content}
				{#if content === undefined || content === null || content === ''}
					<p data-text="muted">No reaction content available.</p>
				{:else}
					<p>{String((content) ?? '')}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
