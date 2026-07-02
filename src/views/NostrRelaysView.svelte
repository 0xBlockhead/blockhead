<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'Nostr relays',
		typeAnnotationParagraphs = ['A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.'],
		placeholderText = 'Loading Nostr relays...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrRelays-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.NostrRelay>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
					relayUrl: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRelay}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(nostrRelays)}
			{@const uniqueNostrRelays = [...new Map(nostrRelays.values.map((nostrRelay) => [nostrRelay[EntityMetaKey.SelectorKey], nostrRelay])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.NostrRelay}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={nostrRelays.values.length === uniqueNostrRelays.length && nostrRelays.totalCount != null && nostrRelays.totalCount >= uniqueNostrRelays.length ? nostrRelays.totalCount : uniqueNostrRelays.length}
				getKey={(nostrRelay) => nostrRelay[EntityMetaKey.SelectorKey]}
				items={uniqueNostrRelays}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Nostr relays yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: nostrRelay }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.NostrRelay> })}
					<EntityView
						entityType={EntityType.NostrRelay}
						entitySelector={nostrRelay.entitySelector}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const name0 = ({ ...nostrRelay.entitySelector, ...nostrRelay }).name}
							{String((name0) ?? '')}
							{@const relayUrl1 = ({ ...nostrRelay.entitySelector, ...nostrRelay }).relayUrl}
							<TruncatedValue value={String(relayUrl1)} />
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.NostrRelay}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
