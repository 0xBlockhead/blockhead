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
		title = 'ERC-4337 bundler observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Erc4337Bundler_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.Erc4337Bundler_Timestamp>
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
	import Erc4337Bundler_TimestampView from '$/views/Erc4337Bundler_TimestampView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.Erc4337Bundler_Timestamp}
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
				$bundler: true,
			},
		})
	}
	getResourceItems={(erc4337BundlerTimestamps) => [...new Map(erc4337BundlerTimestamps.values.map((erc4337BundlerTimestamp) => [erc4337BundlerTimestamp[EntityMetaKey.SelectorKey], erc4337BundlerTimestamp])).values()]}
	getKey={(erc4337BundlerTimestamp) => erc4337BundlerTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No ERC-4337 bundler observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: erc4337BundlerTimestamp })}
		{@const erc4337BundlerTimestampFields = { ...erc4337BundlerTimestamp[EntityMetaKey.Selector], ...erc4337BundlerTimestamp }}
		{@const selection = select(EntityType.Erc4337Bundler_Timestamp, erc4337BundlerTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const erc4337BundlerTimestampHrefFields = { ...erc4337BundlerTimestamp, ...erc4337BundlerTimestamp[EntityMetaKey.Selector] }}
		<Erc4337Bundler_TimestampView
			selection={selection}
			prefetched={erc4337BundlerTimestampFields}
			href={
				(erc4337BundlerTimestampHrefFields.timestampMs !== undefined && erc4337BundlerTimestampHrefFields.source !== undefined && erc4337BundlerTimestampHrefFields.$bundler !== undefined && erc4337BundlerTimestampHrefFields.$bundler.address !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337BundlerTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337BundlerTimestampHrefFields.source ?? ''),
					address: String(erc4337BundlerTimestampHrefFields.$bundler.address ?? ''),
					network: String(caip2StringFromValue(erc4337BundlerTimestampHrefFields.$bundler.$network.caip2) ?? ''),
				}) : erc4337BundlerTimestampHrefFields.timestampMs !== undefined && erc4337BundlerTimestampHrefFields.source !== undefined && erc4337BundlerTimestampHrefFields.$bundler !== undefined && erc4337BundlerTimestampHrefFields.$bundler.address !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network !== undefined && erc4337BundlerTimestampHrefFields.$bundler.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/bundler/[address=evmAddress]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(erc4337BundlerTimestampHrefFields.timestampMs ?? ''),
					source: String(erc4337BundlerTimestampHrefFields.source ?? ''),
					address: String(erc4337BundlerTimestampHrefFields.$bundler.address ?? ''),
					network: String(erc4337BundlerTimestampHrefFields.$bundler.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
