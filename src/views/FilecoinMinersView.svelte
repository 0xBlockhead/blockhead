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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Filecoin miners',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'FilecoinMiners-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.FilecoinMiner>
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
	entityType={EntityType.FilecoinMiner}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Lotus_JsonRpc,
			],
			fields: {
				minerAddress: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(filecoinMiners) => [...new Map(filecoinMiners.values.map((filecoinMiner) => [filecoinMiner[EntityMetaKey.SelectorKey], filecoinMiner])).values()]}
	getKey={(filecoinMiner) => filecoinMiner[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Filecoin miners yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: filecoinMiner })}
		{@const filecoinMinerFields = { ...filecoinMiner[EntityMetaKey.Selector], ...filecoinMiner }}
		<EntityView
			entityType={EntityType.FilecoinMiner}
			entitySelector={filecoinMiner[EntityMetaKey.Selector]}
			href={
				(
					filecoinMiner[EntityMetaKey.Selector] != null && 'minerAddress' in filecoinMiner[EntityMetaKey.Selector]
					&& filecoinMiner[EntityMetaKey.Selector].minerAddress != null
					&& filecoinMiner[EntityMetaKey.Selector] != null && '$network' in filecoinMiner[EntityMetaKey.Selector] ?
						filecoinMiner[EntityMetaKey.Selector].$network != null && 'caip2' in filecoinMiner[EntityMetaKey.Selector].$network
						&& filecoinMiner[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
						minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
						network: String(caip2StringFromValue(filecoinMiner[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							filecoinMiner[EntityMetaKey.Selector].$network != null && 'slug' in filecoinMiner[EntityMetaKey.Selector].$network
							&& filecoinMiner[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/miner/[minerAddress=stringSegment]', {
							minerAddress: String(filecoinMiner[EntityMetaKey.Selector].minerAddress ?? ''),
							network: String(filecoinMiner[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((filecoinMinerFields.minerAddress) ?? '')].filter(Boolean).join(' ') || 'filecoin miner'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
