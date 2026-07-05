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
		title = 'ERC-4337 account factories',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337AccountFactories-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337AccountFactory>
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
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
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
					address: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(erc4337AccountFactories)}
			{@const uniqueErc4337AccountFactories = [...new Map(erc4337AccountFactories.values.map((erc4337AccountFactory) => [erc4337AccountFactory[EntityMetaKey.SelectorKey], erc4337AccountFactory])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337AccountFactory}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337AccountFactories.totalCount}
				getKey={(erc4337AccountFactory) => erc4337AccountFactory[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337AccountFactories}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 account factories yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337AccountFactory }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337AccountFactory> })}
					{@const erc4337AccountFactoryFields = { ...erc4337AccountFactory[EntityMetaKey.Selector], ...erc4337AccountFactory }}
					{@const erc4337AccountFactoryHrefFields = { ...erc4337AccountFactory, ...erc4337AccountFactory[EntityMetaKey.Selector] }}
					<Erc4337AccountFactoryView
						selection={select(EntityType.Erc4337AccountFactory, erc4337AccountFactory[EntityMetaKey.Selector])}
						prefetched={erc4337AccountFactoryFields}
						href={
							(erc4337AccountFactoryHrefFields.$network !== undefined && erc4337AccountFactoryHrefFields.$network.caip2 !== undefined && erc4337AccountFactoryHrefFields.$network.caip2.namespace !== undefined && erc4337AccountFactoryHrefFields.$network !== undefined && erc4337AccountFactoryHrefFields.$network.caip2 !== undefined && erc4337AccountFactoryHrefFields.$network.caip2.reference !== undefined && erc4337AccountFactoryHrefFields.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]', {
								caip2: `${String(erc4337AccountFactoryHrefFields.$network.caip2.namespace ?? '')}:${String(erc4337AccountFactoryHrefFields.$network.caip2.reference ?? '')}`,
								address: String(erc4337AccountFactoryHrefFields.address ?? ''),
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
		entityType={EntityType.Erc4337AccountFactory}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
