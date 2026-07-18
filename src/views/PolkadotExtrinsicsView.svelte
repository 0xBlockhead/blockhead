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
		title = 'Extrinsics',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotExtrinsics-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotExtrinsic>
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
	import PolkadotExtrinsicView from '$/views/PolkadotExtrinsicView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PolkadotExtrinsic}
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
				indexInBlock: true,
				callName: true,
				success: true,
				$block: true,
			},
		})
	}
	getResourceItems={(polkadotExtrinsics) => [...new Map(polkadotExtrinsics.values.map((polkadotExtrinsic) => [polkadotExtrinsic[EntityMetaKey.SelectorKey], polkadotExtrinsic])).values()]}
	getKey={(polkadotExtrinsic) => polkadotExtrinsic[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Polkadot extrinsics yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: polkadotExtrinsic })}
		{@const polkadotExtrinsicFields = { ...polkadotExtrinsic[EntityMetaKey.Selector], ...polkadotExtrinsic }}
		{@const selection = select(EntityType.PolkadotExtrinsic, polkadotExtrinsic[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const polkadotExtrinsicHrefFields = { ...polkadotExtrinsic, ...polkadotExtrinsic[EntityMetaKey.Selector] }}
		<PolkadotExtrinsicView
			selection={selection}
			prefetched={polkadotExtrinsicFields}
			href={
				(polkadotExtrinsicHrefFields.indexInBlock !== undefined && polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.blockNumber !== undefined && polkadotExtrinsicHrefFields.$block.hash !== undefined && polkadotExtrinsicHrefFields.$block.$network !== undefined && polkadotExtrinsicHrefFields.$block.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
					extrinsicIndex: String(polkadotExtrinsicHrefFields.indexInBlock ?? ''),
					blockNumber: String(polkadotExtrinsicHrefFields.$block.blockNumber ?? ''),
					hash: String(polkadotExtrinsicHrefFields.$block.hash ?? ''),
					network: String(caip2StringFromValue(polkadotExtrinsicHrefFields.$block.$network.caip2) ?? ''),
				}) : polkadotExtrinsicHrefFields.indexInBlock !== undefined && polkadotExtrinsicHrefFields.$block !== undefined && polkadotExtrinsicHrefFields.$block.blockNumber !== undefined && polkadotExtrinsicHrefFields.$block.hash !== undefined && polkadotExtrinsicHrefFields.$block.$network !== undefined && polkadotExtrinsicHrefFields.$block.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]/extrinsic/[extrinsicIndex=nonNegativeInteger]', {
					extrinsicIndex: String(polkadotExtrinsicHrefFields.indexInBlock ?? ''),
					blockNumber: String(polkadotExtrinsicHrefFields.$block.blockNumber ?? ''),
					hash: String(polkadotExtrinsicHrefFields.$block.hash ?? ''),
					network: String(polkadotExtrinsicHrefFields.$block.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
