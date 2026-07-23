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
		title = 'EVM network bridges',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkBridges-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmNetworkBridge>
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
	entityType={EntityType.EvmNetworkBridge}
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
				url: true,
				relationshipType: true,
				$toNetwork: true,
				$fromNetwork: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmNetworkBridges) => [...new Map(evmNetworkBridges.values.map((evmNetworkBridge) => [evmNetworkBridge[EntityMetaKey.SelectorKey], evmNetworkBridge])).values()]}
	getKey={(evmNetworkBridge) => evmNetworkBridge[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM network bridges yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmNetworkBridge })}
		{@const evmNetworkBridgeFields = { ...evmNetworkBridge[EntityMetaKey.Selector], ...evmNetworkBridge }}
		<EntityView
			entityType={EntityType.EvmNetworkBridge}
			entitySelector={evmNetworkBridge[EntityMetaKey.Selector]}
			href={
				(
					evmNetworkBridge[EntityMetaKey.Selector] != null && '$toNetwork' in evmNetworkBridge[EntityMetaKey.Selector]
					&& evmNetworkBridge[EntityMetaKey.Selector].$toNetwork != null && 'caip2' in evmNetworkBridge[EntityMetaKey.Selector].$toNetwork
					&& evmNetworkBridge[EntityMetaKey.Selector].$toNetwork.caip2 != null
					&& evmNetworkBridge[EntityMetaKey.Selector] != null && 'url' in evmNetworkBridge[EntityMetaKey.Selector]
					&& evmNetworkBridge[EntityMetaKey.Selector].url != null
					&& evmNetworkBridge[EntityMetaKey.Selector] != null && '$fromNetwork' in evmNetworkBridge[EntityMetaKey.Selector] ?
						evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork != null && 'caip2' in evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork
						&& evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
						toCaip2: String(caip2StringFromValue(evmNetworkBridge[EntityMetaKey.Selector].$toNetwork.caip2) ?? ''),
						url: encodeURIComponent(String(evmNetworkBridge[EntityMetaKey.Selector].url ?? '')),
						network: String(caip2StringFromValue(evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork.caip2) ?? ''),
					})
					:
							evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork != null && 'slug' in evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork
							&& evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
							toCaip2: String(caip2StringFromValue(evmNetworkBridge[EntityMetaKey.Selector].$toNetwork.caip2) ?? ''),
							url: encodeURIComponent(String(evmNetworkBridge[EntityMetaKey.Selector].url ?? '')),
							network: String(evmNetworkBridge[EntityMetaKey.Selector].$fromNetwork.slug ?? ''),
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
				{[String((evmNetworkBridgeFields.url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge'}
			{/snippet}

			{#snippet Value()}
				{[String((evmNetworkBridgeFields.url) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((evmNetworkBridgeFields.relationshipType) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
