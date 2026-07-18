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
		title = 'ERC-4337 account factory observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337AccountFactory_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337AccountFactory_Timestamp>
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
	import Erc4337AccountFactory_TimestampView from '$/views/Erc4337AccountFactory_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337AccountFactory_Timestamp}
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
				timestampMs: true,
				userOperationsCount: true,
				source: true,
				smartAccountsCount: true,
				$factory: true,
			},
		})
	}
	getResourceItems={(erc4337AccountFactoryTimestamps) => [...new Map(erc4337AccountFactoryTimestamps.values.map((erc4337AccountFactoryTimestamp) => [erc4337AccountFactoryTimestamp[EntityMetaKey.SelectorKey], erc4337AccountFactoryTimestamp])).values()]}
	getKey={(erc4337AccountFactoryTimestamp) => erc4337AccountFactoryTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 account factory observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337AccountFactoryTimestamp })}
		{@const erc4337AccountFactoryTimestampFields = { ...erc4337AccountFactoryTimestamp[EntityMetaKey.Selector], ...erc4337AccountFactoryTimestamp }}
		{@const selection = select(EntityType.Erc4337AccountFactory_Timestamp, erc4337AccountFactoryTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337AccountFactoryTimestampHrefFields = { ...erc4337AccountFactoryTimestamp, ...erc4337AccountFactoryTimestamp[EntityMetaKey.Selector] }}
		<Erc4337AccountFactory_TimestampView
			selection={selection}
			prefetched={erc4337AccountFactoryTimestampFields}
			href={
				(erc4337AccountFactoryTimestampHrefFields.timestampMs !== undefined && erc4337AccountFactoryTimestampHrefFields.source !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.address !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337AccountFactoryTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337AccountFactoryTimestampHrefFields.source ?? ''),
					address: String(erc4337AccountFactoryTimestampHrefFields.$factory.address ?? ''),
					network: String(caip2StringFromValue(erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2) ?? ''),
				}) : erc4337AccountFactoryTimestampHrefFields.timestampMs !== undefined && erc4337AccountFactoryTimestampHrefFields.source !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.address !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337AccountFactoryTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337AccountFactoryTimestampHrefFields.source ?? ''),
					address: String(erc4337AccountFactoryTimestampHrefFields.$factory.address ?? ''),
					network: String(erc4337AccountFactoryTimestampHrefFields.$factory.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
