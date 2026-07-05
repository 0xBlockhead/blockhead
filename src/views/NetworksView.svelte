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
		title = 'Networks',
		typeAnnotationParagraphs = ['A blockchain, ledger, or protocol network with its own identity and supporting metadata.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Networks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Network>
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
	import NetworkView from '$/views/NetworkView.svelte'
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
					$icon: true,
					name: true,
					caip2: true,
					slug: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(networks)}
			{@const uniqueNetworks = [...new Map(networks.values.map((network) => [network[EntityMetaKey.SelectorKey], network])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Network}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={networks.totalCount}
				getKey={(network) => network[EntityMetaKey.SelectorKey]}
				items={uniqueNetworks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Networks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: network }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Network> })}
					{@const networkFields = { ...network[EntityMetaKey.Selector], ...network }}
					{@const networkHrefFields = { ...network, ...network[EntityMetaKey.Selector] }}
					<NetworkView
						selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
						prefetched={networkFields}
						href={
							(networkHrefFields.caip2 !== undefined && networkHrefFields.caip2.namespace !== undefined && networkHrefFields.caip2 !== undefined && networkHrefFields.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(networkHrefFields.caip2.namespace ?? '')}:${String(networkHrefFields.caip2.reference ?? '')}`,
							}) : networkHrefFields.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(networkHrefFields.slug ?? ''),
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
		entityType={EntityType.Network}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
