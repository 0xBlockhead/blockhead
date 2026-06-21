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
			'/(social)/(nostr)/nostr/reaction/[eventId]',
			{ eventId: selection.entitySelector.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.NostrReaction>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const reaction = $derived(selection( { sources: [
				Source.NostrBand_Rest,
			], fields: { eventId: true, pubkey: true, createdAt: true, $author: true, $targetNote: true, $targetArticle: true, content: true } }))


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
	entityType={EntityType.NostrReaction}
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
			resource={reaction}
			placeholderText="Loading reaction…"
		>
			{#snippet children(reaction)}
				{reaction.content ?? '+'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-7 reactions carry emoji or “+” content referencing a target note (<code>e</code>-tag event id) or NIP-23 article (<code>a</code>-tag coordinate).
		</p>
		<p>
			The reaction’s own event id is a 64-character lowercase hex hash distinct from the target document’s id.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={reaction}
			placeholderText="Loading reaction…"
		>
			{#snippet children(reaction)}
				{#if reaction.content}
					<p>
						{reaction.content}
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if open}
				<div>
					<dt>Event id</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								{#if reaction.eventId}
									<TruncatedValue
										value={reaction.eventId}
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
						resource={reaction}
						placeholderText="Loading reaction…"
					>
						{#snippet children(reaction)}
							{#if reaction.createdAt != null}
								<Timestamp
									timestamp={reaction.createdAt}
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
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								{#if reaction.$author}
									<NostrProfileView
										selection={select(EntityType.NostrProfile, reaction.$author[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Target note</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								{#if reaction.$targetNote}
									<NostrNoteView
										selection={select(EntityType.NostrNote, reaction.$targetNote[EntityMetaKey.Selector])}
										layout={EntityLayout.Value}

										open={false}
										/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Target article</dt>
					<dd>
						<ResourceBoundary
							resource={reaction}
							placeholderText="Loading reaction…"
						>
							{#snippet children(reaction)}
								{#if reaction.$targetArticle}
									<NostrArticleView
										selection={select(EntityType.NostrArticle, reaction.$targetArticle[EntityMetaKey.Selector])}
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
