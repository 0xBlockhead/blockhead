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
		title = 'ERC-4337 account factories',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337AccountFactories-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337AccountFactory>
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
	import Erc4337AccountFactoryView from '$/views/Erc4337AccountFactoryView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337AccountFactory}
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
				address: true,
				$network: true,
			},
		})
	}
	getResourceItems={(erc4337AccountFactories) => [...new Map(erc4337AccountFactories.values.map((erc4337AccountFactory) => [erc4337AccountFactory[EntityMetaKey.SelectorKey], erc4337AccountFactory])).values()]}
	getKey={(erc4337AccountFactory) => erc4337AccountFactory[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 account factories yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337AccountFactory })}
		{@const erc4337AccountFactoryFields = { ...erc4337AccountFactory[EntityMetaKey.Selector], ...erc4337AccountFactory }}
		{@const selection = select(EntityType.Erc4337AccountFactory, erc4337AccountFactory[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337AccountFactoryHrefFields = { ...erc4337AccountFactory, ...erc4337AccountFactory[EntityMetaKey.Selector] }}
		<Erc4337AccountFactoryView
			selection={selection}
			prefetched={erc4337AccountFactoryFields}
			href={
				(erc4337AccountFactoryHrefFields.address !== undefined && erc4337AccountFactoryHrefFields.$network !== undefined && erc4337AccountFactoryHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
					address: String(erc4337AccountFactoryHrefFields.address ?? ''),
					network: String(caip2StringFromValue(erc4337AccountFactoryHrefFields.$network.caip2) ?? ''),
				}) : erc4337AccountFactoryHrefFields.address !== undefined && erc4337AccountFactoryHrefFields.$network !== undefined && erc4337AccountFactoryHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]', {
					address: String(erc4337AccountFactoryHrefFields.address ?? ''),
					network: String(erc4337AccountFactoryHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
