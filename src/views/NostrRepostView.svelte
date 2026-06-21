<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
			'/(social)/(nostr)/nostr/repost/[eventId]',
			{ eventId: selection.entitySelector.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrRepost>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const repost = $derived(selection( { sources: [
				Source.NostrBand_Rest,
			], fields: { eventId: true, pubkey: true, createdAt: true, repostedEventId: true, $author: true, $repostedArticle: true, $repostedNote: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrRepost}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.eventId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={repost}
			placeholderText="Loading repost…"
		>
			{#snippet children(repost)}
				{#if repost.$repostedArticle}
					<NostrArticleView
						selection={select(EntityType.NostrArticle, repost.$repostedArticle[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}

						open={false}
						/>
				{:else if repost.repostedEventId}
					<TruncatedValue
						value={repost.repostedEventId}
						format={TruncatedValueFormat.Visual}
					/>
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			NIP-18 repost events (kind 6 legacy note reposts, kind 16 generic reposts) reference another event via an <code>e</code>-tag on the signed payload.
		</p>
		<p>
			The repost event id is a 64-character lowercase hex hash of the repost event—not the referenced event’s id.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Event id</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.eventId}
									<TruncatedValue
										value={repost.eventId}
										format={TruncatedValueFormat.Visual}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={repost}
						placeholderText="Loading repost…"
					>
						{#snippet children(repost)}
							{#if repost.createdAt != null}
								<Timestamp
									timestamp={repost.createdAt}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$author}
									<NostrProfileView
										selection={select(EntityType.NostrProfile, repost.$author[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reposted note</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$repostedNote}
									<NostrNoteView
										selection={select(EntityType.NostrNote, repost.$repostedNote[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Reposted article</dt>
					<dd>
						<ResourceBoundary
							resource={repost}
							placeholderText="Loading repost…"
						>
							{#snippet children(repost)}
								{#if repost.$repostedArticle}
									<NostrArticleView
										selection={select(EntityType.NostrArticle, repost.$repostedArticle[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}
</EntityView>
