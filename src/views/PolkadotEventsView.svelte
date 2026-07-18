<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Events',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotEvent>
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
	import PolkadotEventView from '$/views/PolkadotEventView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotEvent}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				eventName: true,
				indexInBlock: true,
				$pallet: true,
				$block: true,
			},
		})
	}
	getResourceItems={(polkadotEvents) => [...new Map(polkadotEvents.values.map((polkadotEvent) => [polkadotEvent[EntityMetaKey.SelectorKey], polkadotEvent])).values()]}
	getKey={(polkadotEvent) => polkadotEvent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot events yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotEvent })}
		{@const polkadotEventFields = { ...polkadotEvent[EntityMetaKey.Selector], ...polkadotEvent }}
		{@const selection = select(EntityType.PolkadotEvent, polkadotEvent[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const polkadotEventHrefFields = { ...polkadotEvent, ...polkadotEvent[EntityMetaKey.Selector] }}
		<PolkadotEventView
			selection={selection}
			prefetched={polkadotEventFields}
			href={
				(polkadotEventHrefFields.indexInBlock !== undefined && polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.blockNumber !== undefined && polkadotEventHrefFields.$block.hash !== undefined && polkadotEventHrefFields.$block.$network !== undefined && polkadotEventHrefFields.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
					eventIndex: String(polkadotEventHrefFields.indexInBlock ?? ''),
					blockNumber: String(polkadotEventHrefFields.$block.blockNumber ?? ''),
					hash: String(polkadotEventHrefFields.$block.hash ?? ''),
					network: String(caip2StringFromValue(polkadotEventHrefFields.$block.$network.caip2) ?? ''),
				}) : polkadotEventHrefFields.indexInBlock !== undefined && polkadotEventHrefFields.$block !== undefined && polkadotEventHrefFields.$block.blockNumber !== undefined && polkadotEventHrefFields.$block.hash !== undefined && polkadotEventHrefFields.$block.$network !== undefined && polkadotEventHrefFields.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
					eventIndex: String(polkadotEventHrefFields.indexInBlock ?? ''),
					blockNumber: String(polkadotEventHrefFields.$block.blockNumber ?? ''),
					hash: String(polkadotEventHrefFields.$block.hash ?? ''),
					network: String(polkadotEventHrefFields.$block.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
