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
		title = 'Cardano stake pools',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CardanoStakePools-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.CardanoStakePool>
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
	import CardanoStakePoolView from '$/views/CardanoStakePoolView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakePool}
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
				poolId: true,
				vrfKeyHash: true,
				$network: true,
			},
		})
	}
	getResourceItems={(cardanoStakePools) => [...new Map(cardanoStakePools.values.map((cardanoStakePool) => [cardanoStakePool[EntityMetaKey.SelectorKey], cardanoStakePool])).values()]}
	getKey={(cardanoStakePool) => cardanoStakePool[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Cardano stake pools yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: cardanoStakePool })}
		{@const cardanoStakePoolFields = { ...cardanoStakePool[EntityMetaKey.Selector], ...cardanoStakePool }}
		{@const selection = select(EntityType.CardanoStakePool, cardanoStakePool[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const cardanoStakePoolHrefFields = { ...cardanoStakePool, ...cardanoStakePool[EntityMetaKey.Selector] }}
		<CardanoStakePoolView
			selection={selection}
			prefetched={cardanoStakePoolFields}
			href={
				(cardanoStakePoolHrefFields.poolId !== undefined && cardanoStakePoolHrefFields.$network !== undefined && cardanoStakePoolHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
					poolId: String(cardanoStakePoolHrefFields.poolId ?? ''),
					network: String(caip2StringFromValue(cardanoStakePoolHrefFields.$network.caip2) ?? ''),
				}) : cardanoStakePoolHrefFields.poolId !== undefined && cardanoStakePoolHrefFields.$network !== undefined && cardanoStakePoolHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
					poolId: String(cardanoStakePoolHrefFields.poolId ?? ''),
					network: String(cardanoStakePoolHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
