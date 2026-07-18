<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Nostr relays',
		typeAnnotationParagraphs = ['A Nostr relay is a WebSocket endpoint that can publish, store, and serve signed events; relay metadata is optional NIP-11 source data.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'NostrRelays-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.NostrRelay>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.NostrRelay}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: [
				Source.Constants_Internal,
			],
			fields: {
				relayUrl: true,
			},
		})
	}
	getResourceItems={(nostrRelays) => [...new Map(nostrRelays.values.map((nostrRelay) => [nostrRelay[EntityMetaKey.SelectorKey], nostrRelay])).values()]}
	getKey={(nostrRelay) => nostrRelay[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Nostr relays yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: nostrRelay })}
		{@const nostrRelayFields = { ...nostrRelay[EntityMetaKey.Selector], ...nostrRelay }}
		{@const selection = select(EntityType.NostrRelay, nostrRelay[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const nostrRelayHrefFields = { ...nostrRelay, ...nostrRelay[EntityMetaKey.Selector] }}
		<NostrRelayView
			selection={selection}
			prefetched={nostrRelayFields}
			href={
				(nostrRelayHrefFields.relayUrl !== undefined ? resolve('/nostr/relay/[relayKey=stringSegment]', {
					relayKey: encodeURIComponent(String(nostrRelayHrefFields.relayUrl ?? '')),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
