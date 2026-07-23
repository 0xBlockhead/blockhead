<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.Erc4337AccountFactory_Timestamp>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.Erc4337AccountFactory_Timestamp}
			entitySelector={erc4337AccountFactoryTimestamp[EntityMetaKey.Selector]}
			href={
				(
					erc4337AccountFactoryTimestamp[EntityMetaKey.Selector] != null && 'timestampMs' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector]
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].timestampMs != null
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector] != null && 'source' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector]
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].source != null
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector] != null && '$factory' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector]
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory != null && 'address' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.address != null
					&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory != null && '$network' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory ?
						erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network != null && 'caip2' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network
						&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
						timestampMs: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
						source: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].source ?? ''),
						address: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.address ?? ''),
						network: String(caip2StringFromValue(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network.caip2) ?? ''),
					})
					:
							erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network != null && 'slug' in erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network
							&& erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/account-factory/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
							timestampMs: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].timestampMs ?? ''),
							source: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].source ?? ''),
							address: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.address ?? ''),
							network: String(erc4337AccountFactoryTimestamp[EntityMetaKey.Selector].$factory.$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((erc4337AccountFactoryTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'ERC-4337 account factory timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((erc4337AccountFactoryTimestampFields.userOperationsCount) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((erc4337AccountFactoryTimestampFields.source) ?? ''), (String((erc4337AccountFactoryTimestampFields.smartAccountsCount) ?? '') ? String((erc4337AccountFactoryTimestampFields.smartAccountsCount) ?? '') + ' smart accounts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
