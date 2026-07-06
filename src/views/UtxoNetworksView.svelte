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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'UTXO networks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'UtxoNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.UtxoNetwork>
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
	import UtxoNetworkView from '$/views/UtxoNetworkView.svelte'
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
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(utxoNetworks)}
			{@const uniqueUtxoNetworks = [...new Map(utxoNetworks.values.map((utxoNetwork) => [utxoNetwork[EntityMetaKey.SelectorKey], utxoNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.UtxoNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={utxoNetworks.totalCount}
				getKey={(utxoNetwork) => utxoNetwork[EntityMetaKey.SelectorKey]}
				items={uniqueUtxoNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No UTXO networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: utxoNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.UtxoNetwork> })}
					{@const utxoNetworkFields = { ...utxoNetwork[EntityMetaKey.Selector], ...utxoNetwork }}
					{@const utxoNetworkHrefFields = { ...utxoNetwork, ...utxoNetwork[EntityMetaKey.Selector] }}
					<UtxoNetworkView
						selection={select(EntityType.UtxoNetwork, utxoNetwork[EntityMetaKey.Selector])}
						prefetched={utxoNetworkFields}
						href={
							(utxoNetworkHrefFields.$network !== undefined && utxoNetworkHrefFields.$network.caip2 !== undefined && utxoNetworkHrefFields.$network.caip2.namespace !== undefined && utxoNetworkHrefFields.$network !== undefined && utxoNetworkHrefFields.$network.caip2 !== undefined && utxoNetworkHrefFields.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(networkByCaip2[String(String(utxoNetworkHrefFields.$network.caip2.namespace) + ':' + String(utxoNetworkHrefFields.$network.caip2.reference))].slug ?? ''),
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
		entityType={EntityType.UtxoNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
