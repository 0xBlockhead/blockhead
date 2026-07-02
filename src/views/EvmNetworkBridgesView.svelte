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
		placeholderText = 'Loading EVM network bridges...',
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
			selection.sources == null ? selection({
				fields: {
					url: true,
					relationshipType: true,
				},
			}) : selection
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
				totalCount={evmNetworkBridges.values.length === uniqueEvmNetworkBridges.length && evmNetworkBridges.totalCount != null && evmNetworkBridges.totalCount >= uniqueEvmNetworkBridges.length ? evmNetworkBridges.totalCount : uniqueEvmNetworkBridges.length}
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
					<EvmNetworkBridgeView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges/[toCaip2=eip155NetworkCaip2]/[url]', {
								caip2: `${String(({ ...evmNetworkBridge.entitySelector, ...evmNetworkBridge }).$fromNetwork.caip2.namespace)}:${String(({ ...evmNetworkBridge.entitySelector, ...evmNetworkBridge }).$fromNetwork.caip2.reference)}`,
								toCaip2: `${String(({ ...evmNetworkBridge.entitySelector, ...evmNetworkBridge }).$toNetwork.caip2.namespace)}:${String(({ ...evmNetworkBridge.entitySelector, ...evmNetworkBridge }).$toNetwork.caip2.reference)}`,
								url: String(({ ...evmNetworkBridge.entitySelector, ...evmNetworkBridge }).url),
							})
						}
						selection={select(EntityType.EvmNetworkBridge, evmNetworkBridge.entitySelector)}
						prefetched={evmNetworkBridge}
						layout={EntityLayout.Summary}
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
