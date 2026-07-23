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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.CardanoStakePool>
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
				ticker: true,
				poolId: true,
				vrfKeyHash: true,
				$network: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.CardanoStakePool}
			entitySelector={cardanoStakePool[EntityMetaKey.Selector]}
			href={
				(
					cardanoStakePool[EntityMetaKey.Selector] != null && 'poolId' in cardanoStakePool[EntityMetaKey.Selector]
					&& cardanoStakePool[EntityMetaKey.Selector].poolId != null
					&& cardanoStakePool[EntityMetaKey.Selector] != null && '$network' in cardanoStakePool[EntityMetaKey.Selector] ?
						cardanoStakePool[EntityMetaKey.Selector].$network != null && 'caip2' in cardanoStakePool[EntityMetaKey.Selector].$network
						&& cardanoStakePool[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
						poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
						network: String(caip2StringFromValue(cardanoStakePool[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							cardanoStakePool[EntityMetaKey.Selector].$network != null && 'slug' in cardanoStakePool[EntityMetaKey.Selector].$network
							&& cardanoStakePool[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/stake-pool/[poolId=stringSegment]', {
							poolId: String(cardanoStakePool[EntityMetaKey.Selector].poolId ?? ''),
							network: String(cardanoStakePool[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((cardanoStakePoolFields.ticker) ?? ''), String((cardanoStakePoolFields.poolId) ?? '')].filter(Boolean).join(' ') || 'Cardano stake pool'}
			{/snippet}

			{#snippet Value()}
				{[String((cardanoStakePoolFields.vrfKeyHash) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
