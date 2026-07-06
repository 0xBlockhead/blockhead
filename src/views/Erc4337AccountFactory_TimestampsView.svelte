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
		title = 'ERC-4337 account factory observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337AccountFactory_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Erc4337AccountFactory_Timestamp>
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
	import Erc4337AccountFactory_TimestampView from '$/views/Erc4337AccountFactory_TimestampView.svelte'
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
					timestampMs: true,
					userOperationsCount: true,
					source: true,
					smartAccountsCount: true,
					$factory: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337AccountFactory_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(erc4337AccountFactoryTimestamps)}
			{@const uniqueErc4337AccountFactoryTimestamps = [...new Map(erc4337AccountFactoryTimestamps.values.map((erc4337AccountFactoryTimestamp) => [erc4337AccountFactoryTimestamp[EntityMetaKey.SelectorKey], erc4337AccountFactoryTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Erc4337AccountFactory_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={erc4337AccountFactoryTimestamps.totalCount}
				getKey={(erc4337AccountFactoryTimestamp) => erc4337AccountFactoryTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueErc4337AccountFactoryTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No ERC-4337 account factory observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: erc4337AccountFactoryTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Erc4337AccountFactory_Timestamp> })}
					{@const erc4337AccountFactoryTimestampFields = { ...erc4337AccountFactoryTimestamp[EntityMetaKey.Selector], ...erc4337AccountFactoryTimestamp }}
					{@const erc4337AccountFactoryTimestampHrefFields = { ...erc4337AccountFactoryTimestamp, ...erc4337AccountFactoryTimestamp[EntityMetaKey.Selector] }}
					<Erc4337AccountFactory_TimestampView
						selection={select(EntityType.Erc4337AccountFactory_Timestamp, erc4337AccountFactoryTimestamp[EntityMetaKey.Selector])}
						prefetched={erc4337AccountFactoryTimestampFields}
						href={
							(erc4337AccountFactoryTimestampHrefFields.$factory !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2 !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2.namespace !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2 !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2.reference !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory !== undefined && erc4337AccountFactoryTimestampHrefFields.$factory.address !== undefined && erc4337AccountFactoryTimestampHrefFields.timestampMs !== undefined && erc4337AccountFactoryTimestampHrefFields.source !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source]', {
								caip2: `${String(erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2.namespace ?? '')}:${String(erc4337AccountFactoryTimestampHrefFields.$factory.$network.caip2.reference ?? '')}`,
								address: String(erc4337AccountFactoryTimestampHrefFields.$factory.address ?? ''),
								timestampMs: String(erc4337AccountFactoryTimestampHrefFields.timestampMs ?? ''),
								source: String(erc4337AccountFactoryTimestampHrefFields.source ?? ''),
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
		entityType={EntityType.Erc4337AccountFactory_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
