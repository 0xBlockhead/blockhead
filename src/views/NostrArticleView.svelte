<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.NostrArticle> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrArticleEventsView from '$/views/NostrArticleEventsView.svelte'
	import NostrArticleEventView from '$/views/NostrArticleEventView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.identifier || 'Nostr article')}
	href={
		href === undefined ?
			(
				selection.entitySelector.kind === 30023 ?
					resolve(
						'/(social)/(nostr)/nostr/(globalNostrNetwork)/article/[pubkey=stringSegment]/[identifier=stringSegment]',
						{
							pubkey: selection.entitySelector.pubkey,
							identifier: selection.entitySelector.identifier,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$latestEvent}
		>
			{#snippet children(nostrArticleEvent)}
				{#if nostrArticleEvent != null}
					<NostrArticleEventView
						selection={select(EntityType.NostrArticleEvent, nostrArticleEvent[EntityMetaKey.Selector])}
						prefetched={nostrArticleEvent}
						href={null}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{selection.entitySelector.identifier}
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.pubkey} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<span>kind </span>
			{selection.entitySelector.kind}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr long-form article is a replaceable kind-30023 event addressed by author public key and identifier.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Identifier</dt>
				<dd>
					{selection.entitySelector.identifier}
				</dd>
			</div>

			<div>
				<dt>Author pubkey</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.pubkey} />
				</dd>
			</div>

			<div>
				<dt>Kind</dt>
				<dd>
					<span>kind </span>
					{selection.entitySelector.kind}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$latestEvent}
			>
				{#snippet children(nostrArticleEvent)}
					{#if nostrArticleEvent != null}
						<div>
							<dt>Latest signed version</dt>
							<dd>
								<NostrArticleEventView
									selection={select(EntityType.NostrArticleEvent, nostrArticleEvent[EntityMetaKey.Selector])}
									prefetched={nostrArticleEvent}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const eventsResource = selection.$$events}
		<ResourceBoundary
			resource={eventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrArticleEventsView
						selection={eventsResource}
						countResource={eventsResource.count}
						title='Signed version history'
						id='events'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
