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
			'/(social)/(nostr)/nostr/reaction/[eventId]',
			{ eventId: selector.eventId },
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NostrReaction>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const reaction = subscribe(EntityType.NostrReaction,
		selector,
		({ sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			], fields: { eventId: true, pubkey: true, createdAt: true, $author: true, $targetNote: true, $targetArticle: true, content: true } }),
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
	entityType={EntityType.NostrReaction}
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
			resource={reaction}
			placeholderText="Loading reaction…"
		>
			{#snippet children(reaction)}
				{reaction.fields.content ?? '+'}
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
				{#if reaction.fields.content}
					<p>
						{reaction.fields.content}
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
								{#if reaction.fields.eventId}
									<TruncatedValue
										value={reaction.fields.eventId}
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
							{#if reaction.fields.createdAt != null}
								<Timestamp
									timestamp={reaction.fields.createdAt}
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
								{#if reaction.fields.$author}
									<NostrProfileView
										selector={reaction.fields.$author[EntityMetaKey.Selector]}
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
								{#if reaction.fields.$targetNote}
									<NostrNoteView
										selector={reaction.fields.$targetNote[EntityMetaKey.Selector]}
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
								{#if reaction.fields.$targetArticle}
									<NostrArticleView
										selector={reaction.fields.$targetArticle[EntityMetaKey.Selector]}
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
