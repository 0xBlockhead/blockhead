<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(nostr)/nostr/repost/[eventId]',
			{ eventId: selector.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NostrRepost>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const repost = subscribe(EntityType.NostrRepost,
		selector,
		({ sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			], fields: { eventId: true, pubkey: true, createdAt: true, repostedEventId: true, $author: true, $repostedArticle: true, $repostedNote: ({ fields: { content: true } }) } }),
	)


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
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.eventId}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={repost}
			placeholderText="Loading repost…"
		>
			{#snippet children(repost)}
				{#if repost.fields.$repostedNote?.content}
					<TruncatedValue
						endLength={16}
						format={TruncatedValueFormat.Visual}
						startLength={64}
						value={repost.fields.$repostedNote.content}
					/>
				{:else if repost.fields.$repostedArticle}
					<NostrArticleView
						selector={repost.fields.$repostedArticle[EntityMetaKey.Selector]}
						layout={EntityLayout.Title}
						open={false}
					/>
				{:else if repost.fields.repostedEventId}
					<TruncatedValue
						value={repost.fields.repostedEventId}
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
								{#if repost.fields.eventId}
									<TruncatedValue
										value={repost.fields.eventId}
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
							{#if repost.fields.createdAt != null}
								<Timestamp
									timestamp={repost.fields.createdAt}
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
								{#if repost.fields.$author}
									<NostrProfileView
										selector={repost.fields.$author[EntityMetaKey.Selector]}
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
								{#if repost.fields.$repostedNote}
									<NostrNoteView
										selector={repost.fields.$repostedNote[EntityMetaKey.Selector]}
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
								{#if repost.fields.$repostedArticle}
									<NostrArticleView
										selector={repost.fields.$repostedArticle[EntityMetaKey.Selector]}
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

	{#snippet Details({
		open: _open,
	})}
	{/snippet}
</EntityView>
