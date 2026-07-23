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
		title = 'Asset instances',
		typeAnnotationParagraphs = ['A concrete asset on a specific network or venue, such as a native coin, token, share, or collectible.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'AssetInstances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.AssetInstance>
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
	entityType={EntityType.AssetInstance}
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
				symbol: true,
				name: true,
				kind: true,
				assetKey: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(assetInstances) => [...new Map(assetInstances.values.map((assetInstance) => [assetInstance[EntityMetaKey.SelectorKey], assetInstance])).values()]}
	getKey={(assetInstance) => assetInstance[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Asset instances yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: assetInstance })}
		{@const assetInstanceFields = { ...assetInstance[EntityMetaKey.Selector], ...assetInstance }}
		<EntityView
			entityType={EntityType.AssetInstance}
			entitySelector={assetInstance[EntityMetaKey.Selector]}
			href={
				(
					assetInstance[EntityMetaKey.Selector] != null && 'kind' in assetInstance[EntityMetaKey.Selector]
					&& assetInstance[EntityMetaKey.Selector].kind != null
					&& assetInstance[EntityMetaKey.Selector] != null && 'assetKey' in assetInstance[EntityMetaKey.Selector]
					&& assetInstance[EntityMetaKey.Selector].assetKey != null
					&& assetInstance[EntityMetaKey.Selector] != null && '$network' in assetInstance[EntityMetaKey.Selector] ?
						assetInstance[EntityMetaKey.Selector].$network != null && 'caip2' in assetInstance[EntityMetaKey.Selector].$network
						&& assetInstance[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
						kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
						assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
						network: String(caip2StringFromValue(assetInstance[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							assetInstance[EntityMetaKey.Selector].$network != null && 'slug' in assetInstance[EntityMetaKey.Selector].$network
							&& assetInstance[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/asset/[kind=stringSegment]/[assetKey=stringSegment]', {
							kind: String(assetInstance[EntityMetaKey.Selector].kind ?? ''),
							assetKey: String(assetInstance[EntityMetaKey.Selector].assetKey ?? ''),
							network: String(assetInstance[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{[String((assetInstanceFields.symbol) ?? ''), String((assetInstanceFields.name) ?? '')].filter(Boolean).join(' ') || 'Asset instance'}
			{/snippet}

			{#snippet Value()}
				{[String((assetInstanceFields.symbol) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
