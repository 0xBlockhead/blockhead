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
		title = 'Cardano addresses',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoAddresses-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoAddress>
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
	entityType={EntityType.CardanoAddress}
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
				address: true,
				addressKind: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(cardanoAddresses) => [...new Map(cardanoAddresses.values.map((cardanoAddress) => [cardanoAddress[EntityMetaKey.SelectorKey], cardanoAddress])).values()]}
	getKey={(cardanoAddress) => cardanoAddress[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano addresses yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoAddress })}
		{@const cardanoAddressFields = { ...cardanoAddress[EntityMetaKey.Selector], ...cardanoAddress }}
		<EntityView
			entityType={EntityType.CardanoAddress}
			entitySelector={cardanoAddress[EntityMetaKey.Selector]}
			href={
				(
					cardanoAddress[EntityMetaKey.Selector] != null && 'address' in cardanoAddress[EntityMetaKey.Selector]
					&& cardanoAddress[EntityMetaKey.Selector].address != null
					&& cardanoAddress[EntityMetaKey.Selector] != null && '$network' in cardanoAddress[EntityMetaKey.Selector] ?
						cardanoAddress[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoAddress[EntityMetaKey.Selector].$network
						&& cardanoAddress[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
						accountId: String(cardanoAddress[EntityMetaKey.Selector].address ?? ''),
						network: String(caip2StringFromValue(cardanoAddress[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoAddress[EntityMetaKey.Selector].$network != null && 'slug' in cardanoAddress[EntityMetaKey.Selector].$network
							&& cardanoAddress[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]', {
							accountId: String(cardanoAddress[EntityMetaKey.Selector].address ?? ''),
							network: String(cardanoAddress[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((cardanoAddressFields.address) ?? '')].filter(Boolean).join(' ') || 'Cardano address'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoAddressFields.addressKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
