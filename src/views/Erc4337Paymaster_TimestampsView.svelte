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
		title = 'ERC-4337 paymaster observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Paymaster_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337Paymaster_Timestamp>
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
	import Erc4337Paymaster_TimestampView from '$/views/Erc4337Paymaster_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Paymaster_Timestamp}
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
				$paymaster: true,
			},
		})
	}
	getResourceItems={(erc4337PaymasterTimestamps) => [...new Map(erc4337PaymasterTimestamps.values.map((erc4337PaymasterTimestamp) => [erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey], erc4337PaymasterTimestamp])).values()]}
	getKey={(erc4337PaymasterTimestamp) => erc4337PaymasterTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 paymaster observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337PaymasterTimestamp })}
		{@const erc4337PaymasterTimestampFields = { ...erc4337PaymasterTimestamp[EntityMetaKey.Selector], ...erc4337PaymasterTimestamp }}
		{@const selection = select(EntityType.Erc4337Paymaster_Timestamp, erc4337PaymasterTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337PaymasterTimestampHrefFields = { ...erc4337PaymasterTimestamp, ...erc4337PaymasterTimestamp[EntityMetaKey.Selector] }}
		<Erc4337Paymaster_TimestampView
			selection={selection}
			prefetched={erc4337PaymasterTimestampFields}
			href={
				(erc4337PaymasterTimestampHrefFields.timestampMs !== undefined && erc4337PaymasterTimestampHrefFields.source !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.address !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337PaymasterTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337PaymasterTimestampHrefFields.source ?? ''),
					address: String(erc4337PaymasterTimestampHrefFields.$paymaster.address ?? ''),
					network: String(caip2StringFromValue(erc4337PaymasterTimestampHrefFields.$paymaster.$network.caip2) ?? ''),
				}) : erc4337PaymasterTimestampHrefFields.timestampMs !== undefined && erc4337PaymasterTimestampHrefFields.source !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.address !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network !== undefined && erc4337PaymasterTimestampHrefFields.$paymaster.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337PaymasterTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337PaymasterTimestampHrefFields.source ?? ''),
					address: String(erc4337PaymasterTimestampHrefFields.$paymaster.address ?? ''),
					network: String(erc4337PaymasterTimestampHrefFields.$paymaster.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
