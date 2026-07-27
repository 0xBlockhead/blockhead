<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
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
	}: EntitySelectionViewProps<EntityType.NostrRepost> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Primal_Rest,
			Source.NostrBand_Rest,
		],
	}))
	const nostrRepost = $derived(viewSelection({
		fields: {
			kind: true,
			pubkey: true,
			createdAt: true,
			repostedEventId: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.repostedEventId ?? '') || 'Nostr repost')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRepost}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(nostr)/nostr/(globalNostrNetwork)/repost/[eventId=stringSegment]',
			{
				eventId: String(selection.entitySelector.eventId),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nostrRepost}>
			{#snippet children(entity)}
				{@const repostedEventId0 = entity.repostedEventId}
				{#if repostedEventId0 != null}
					<TruncatedValue value={repostedEventId0} />
				{/if}
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
		<ResourceBoundary resource={nostrRepost}>
			{#snippet children(entity)}
				{@const createdAt0 = entity.createdAt}
				{#if createdAt0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr repost is a kind-6 or kind-16 event keyed by event id and linked to the reposted note or article.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.eventId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={nostrRepost}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<div>
					<dt>Kind</dt>
					<dd>
						<ResourceBoundary
							resource={nostrRepost}
						>
							{#snippet children(entity)}
								{String(entity.kind)}
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
							resource={nostrRepost}
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
								<dt>Author</dt>
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
					resource={nostrRepost}
				>
					{#snippet children(entity)}
						{@const repostedEventId = entity.repostedEventId}
						{#if repostedEventId != null}
							<div>
								<dt>Reposted event ID</dt>
								<dd>
									<TruncatedValue value={repostedEventId} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={selection.$repostedNote}
				>
					{#snippet children(nostrNote)}
						{#if nostrNote != null}
							<div>
								<dt>Reposted note</dt>
								<dd>
									<NostrNoteView
										selection={select(EntityType.NostrNote, nostrNote[EntityMetaKey.Selector])}
										prefetched={nostrNote}
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
					resource={selection.$repostedArticle}
				>
					{#snippet children(nostrArticle)}
						{#if nostrArticle != null}
							<div>
								<dt>Reposted article</dt>
								<dd>
									<NostrArticleView
										selection={select(EntityType.NostrArticle, nostrArticle[EntityMetaKey.Selector])}
										prefetched={nostrArticle}
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
	{/snippet}
</EntityView>
