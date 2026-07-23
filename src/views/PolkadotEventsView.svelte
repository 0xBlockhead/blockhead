<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.PolkadotEvent>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.PolkadotEvent}
			entitySelector={polkadotEvent[EntityMetaKey.Selector]}
			href={
				(
					polkadotEvent[EntityMetaKey.Selector] != null && 'indexInBlock' in polkadotEvent[EntityMetaKey.Selector]
					&& polkadotEvent[EntityMetaKey.Selector].indexInBlock != null
					&& polkadotEvent[EntityMetaKey.Selector] != null && '$block' in polkadotEvent[EntityMetaKey.Selector]
					&& polkadotEvent[EntityMetaKey.Selector].$block != null && 'blockNumber' in polkadotEvent[EntityMetaKey.Selector].$block
					&& polkadotEvent[EntityMetaKey.Selector].$block.blockNumber != null
					&& polkadotEvent[EntityMetaKey.Selector].$block != null && 'hash' in polkadotEvent[EntityMetaKey.Selector].$block
					&& polkadotEvent[EntityMetaKey.Selector].$block.hash != null
					&& polkadotEvent[EntityMetaKey.Selector].$block != null && '$network' in polkadotEvent[EntityMetaKey.Selector].$block ?
						polkadotEvent[EntityMetaKey.Selector].$block.$network != null && 'caip2' in polkadotEvent[EntityMetaKey.Selector].$block.$network
						&& polkadotEvent[EntityMetaKey.Selector].$block.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
						eventIndex: String(polkadotEvent[EntityMetaKey.Selector].indexInBlock ?? ''),
						blockNumber: String(polkadotEvent[EntityMetaKey.Selector].$block.blockNumber ?? ''),
						hash: String(polkadotEvent[EntityMetaKey.Selector].$block.hash ?? ''),
						network: String(caip2StringFromValue(polkadotEvent[EntityMetaKey.Selector].$block.$network.caip2) ?? ''),
					})
					:
							polkadotEvent[EntityMetaKey.Selector].$block.$network != null && 'slug' in polkadotEvent[EntityMetaKey.Selector].$block.$network
							&& polkadotEvent[EntityMetaKey.Selector].$block.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/event/[eventIndex=nonNegativeInteger]', {
							eventIndex: String(polkadotEvent[EntityMetaKey.Selector].indexInBlock ?? ''),
							blockNumber: String(polkadotEvent[EntityMetaKey.Selector].$block.blockNumber ?? ''),
							hash: String(polkadotEvent[EntityMetaKey.Selector].$block.hash ?? ''),
							network: String(polkadotEvent[EntityMetaKey.Selector].$block.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((polkadotEventFields.eventName) ?? ''), (String((polkadotEventFields.indexInBlock) ?? '') ? 'Event ' + String((polkadotEventFields.indexInBlock) ?? '') : '')].filter(Boolean).join(' ') || 'Polkadot event'}
			{/snippet}

			{#snippet Value()}
				{[String((polkadotEventFields.eventName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((polkadotEventFields.$pallet.palletName) ?? '')].filter(Boolean).join(' ') || 'Polkadot pallet'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
