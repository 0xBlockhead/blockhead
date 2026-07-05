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
		title = 'Polkadot networks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotNetworks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotNetwork>
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
	import PolkadotNetworkView from '$/views/PolkadotNetworkView.svelte'
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
		{#snippet children(polkadotNetworks)}
			{@const uniquePolkadotNetworks = [...new Map(polkadotNetworks.values.map((polkadotNetwork) => [polkadotNetwork[EntityMetaKey.SelectorKey], polkadotNetwork])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotNetwork}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotNetworks.totalCount}
				getKey={(polkadotNetwork) => polkadotNetwork[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotNetwork }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotNetwork> })}
					{@const polkadotNetworkFields = { ...polkadotNetwork[EntityMetaKey.Selector], ...polkadotNetwork }}
					{@const polkadotNetworkHrefFields = { ...polkadotNetwork, ...polkadotNetwork[EntityMetaKey.Selector] }}
					<PolkadotNetworkView
						selection={select(EntityType.PolkadotNetwork, polkadotNetwork[EntityMetaKey.Selector])}
						prefetched={polkadotNetworkFields}
						href={
							(polkadotNetworkHrefFields.$network !== undefined && polkadotNetworkHrefFields.$network.caip2 !== undefined && polkadotNetworkHrefFields.$network.caip2.namespace !== undefined && polkadotNetworkHrefFields.$network !== undefined && polkadotNetworkHrefFields.$network.caip2 !== undefined && polkadotNetworkHrefFields.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(networkByCaip2[String(String(polkadotNetworkHrefFields.$network.caip2.namespace) + ':' + String(polkadotNetworkHrefFields.$network.caip2.reference))].slug ?? ''),
							}) : undefined)
						}
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
		entityType={EntityType.PolkadotNetwork}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
