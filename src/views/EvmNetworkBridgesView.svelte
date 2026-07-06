<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM network bridges',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmNetworkBridges-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmNetworkBridge>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmNetworkBridgeView from '$/views/EvmNetworkBridgeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					url: true,
					relationshipType: true,
					$fromNetwork: true,
					$toNetwork: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkBridge}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmNetworkBridges)}
			{@const uniqueEvmNetworkBridges = [...new Map(evmNetworkBridges.values.map((evmNetworkBridge) => [evmNetworkBridge[EntityMetaKey.SelectorKey], evmNetworkBridge])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmNetworkBridge}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmNetworkBridges.totalCount}
				getKey={(evmNetworkBridge) => evmNetworkBridge[EntityMetaKey.SelectorKey]}
				items={uniqueEvmNetworkBridges}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM network bridges yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmNetworkBridge }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmNetworkBridge> })}
					{@const evmNetworkBridgeFields = { ...evmNetworkBridge[EntityMetaKey.Selector], ...evmNetworkBridge }}
					{@const evmNetworkBridgeHrefFields = { ...evmNetworkBridge, ...evmNetworkBridge[EntityMetaKey.Selector] }}
					<EvmNetworkBridgeView
						selection={select(EntityType.EvmNetworkBridge, evmNetworkBridge[EntityMetaKey.Selector])}
						prefetched={evmNetworkBridgeFields}
						href={
							(evmNetworkBridgeHrefFields.$fromNetwork !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.caip2.namespace !== undefined && evmNetworkBridgeHrefFields.$fromNetwork !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.$fromNetwork.caip2.reference !== undefined && evmNetworkBridgeHrefFields.$toNetwork !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2.namespace !== undefined && evmNetworkBridgeHrefFields.$toNetwork !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2 !== undefined && evmNetworkBridgeHrefFields.$toNetwork.caip2.reference !== undefined && evmNetworkBridgeHrefFields.url !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges/[toCaip2=eip155NetworkCaip2]/[url]', {
								caip2: `${String(evmNetworkBridgeHrefFields.$fromNetwork.caip2.namespace ?? '')}:${String(evmNetworkBridgeHrefFields.$fromNetwork.caip2.reference ?? '')}`,
								toCaip2: `${String(evmNetworkBridgeHrefFields.$toNetwork.caip2.namespace ?? '')}:${String(evmNetworkBridgeHrefFields.$toNetwork.caip2.reference ?? '')}`,
								url: String(evmNetworkBridgeHrefFields.url ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmNetworkBridge}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
