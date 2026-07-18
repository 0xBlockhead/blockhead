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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmNetworkBridge>
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
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
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
		{@const selection = select(EntityType.EvmNetworkBridge, evmNetworkBridge[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmNetworkBridgeHrefFields = { ...evmNetworkBridge, ...evmNetworkBridge[EntityMetaKey.Selector] }}
		<EvmNetworkBridgeView
			selection={selection}
			prefetched={evmNetworkBridgeFields}
			href={
				(evmNetworkBridgeHrefFields.$toNetwork !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.url !== undefined && evmNetworkBridgeHrefFields.$fromNetwork !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
					toCaip2: String(caip2StringFromValue(evmNetworkBridgeHrefFields.$toNetwork.caip2) ?? ''),
					url: encodeURIComponent(String(evmNetworkBridgeHrefFields.url ?? '')),
					network: String(caip2StringFromValue(evmNetworkBridgeHrefFields.$fromNetwork.caip2) ?? ''),
				}) : evmNetworkBridgeHrefFields.$toNetwork !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.url !== undefined && evmNetworkBridgeHrefFields.$fromNetwork !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
					toCaip2: String(caip2StringFromValue(evmNetworkBridgeHrefFields.$toNetwork.caip2) ?? ''),
					url: encodeURIComponent(String(evmNetworkBridgeHrefFields.url ?? '')),
					network: String(evmNetworkBridgeHrefFields.$fromNetwork.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
