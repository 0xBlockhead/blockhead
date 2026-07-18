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
		title = 'ERC-4337 smart account observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337SmartAccount_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337SmartAccount_Timestamp>
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
	import Erc4337SmartAccount_TimestampView from '$/views/Erc4337SmartAccount_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337SmartAccount_Timestamp}
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
				$account: true,
			},
		})
	}
	getResourceItems={(erc4337SmartAccountTimestamps) => [...new Map(erc4337SmartAccountTimestamps.values.map((erc4337SmartAccountTimestamp) => [erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey], erc4337SmartAccountTimestamp])).values()]}
	getKey={(erc4337SmartAccountTimestamp) => erc4337SmartAccountTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 smart account observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337SmartAccountTimestamp })}
		{@const erc4337SmartAccountTimestampFields = { ...erc4337SmartAccountTimestamp[EntityMetaKey.Selector], ...erc4337SmartAccountTimestamp }}
		{@const selection = select(EntityType.Erc4337SmartAccount_Timestamp, erc4337SmartAccountTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337SmartAccountTimestampHrefFields = { ...erc4337SmartAccountTimestamp, ...erc4337SmartAccountTimestamp[EntityMetaKey.Selector] }}
		<Erc4337SmartAccount_TimestampView
			selection={selection}
			prefetched={erc4337SmartAccountTimestampFields}
			href={
				(erc4337SmartAccountTimestampHrefFields.timestampMs !== undefined && erc4337SmartAccountTimestampHrefFields.source !== undefined && erc4337SmartAccountTimestampHrefFields.$account !== undefined && erc4337SmartAccountTimestampHrefFields.$account.address !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337SmartAccountTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337SmartAccountTimestampHrefFields.source ?? ''),
					address: String(erc4337SmartAccountTimestampHrefFields.$account.address ?? ''),
					network: String(caip2StringFromValue(erc4337SmartAccountTimestampHrefFields.$account.$network.caip2) ?? ''),
				}) : erc4337SmartAccountTimestampHrefFields.timestampMs !== undefined && erc4337SmartAccountTimestampHrefFields.source !== undefined && erc4337SmartAccountTimestampHrefFields.$account !== undefined && erc4337SmartAccountTimestampHrefFields.$account.address !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network !== undefined && erc4337SmartAccountTimestampHrefFields.$account.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/smart-account/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337SmartAccountTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337SmartAccountTimestampHrefFields.source ?? ''),
					address: String(erc4337SmartAccountTimestampHrefFields.$account.address ?? ''),
					network: String(erc4337SmartAccountTimestampHrefFields.$account.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
