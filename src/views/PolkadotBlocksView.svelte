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
		title = 'Blocks',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.PolkadotBlock>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
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
					blockNumber: true,
					hash: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(polkadotBlocks)}
			{@const uniquePolkadotBlocks = [...new Map(polkadotBlocks.values.map((polkadotBlock) => [polkadotBlock[EntityMetaKey.SelectorKey], polkadotBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.PolkadotBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={polkadotBlocks.totalCount}
				getKey={(polkadotBlock) => polkadotBlock[EntityMetaKey.SelectorKey]}
				items={uniquePolkadotBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Polkadot blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: polkadotBlock })}
					{@const polkadotBlockFields = { ...polkadotBlock[EntityMetaKey.Selector], ...polkadotBlock }}
					{@const selection = select(EntityType.PolkadotBlock, polkadotBlock[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const polkadotBlockHrefFields = { ...polkadotBlock, ...polkadotBlock[EntityMetaKey.Selector] }}
					<PolkadotBlockView
						selection={selection}
						prefetched={polkadotBlockFields}
						href={
							(polkadotBlockHrefFields.blockNumber !== undefined && polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
								network: String(caip2StringFromValue(polkadotBlockHrefFields.$network.caip2) ?? ''),
							}) : polkadotBlockHrefFields.blockNumber !== undefined && polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
								network: String(polkadotBlockHrefFields.$network.slug ?? ''),
							}) : polkadotBlockHrefFields.blockNumber !== undefined && polkadotBlockHrefFields.hash !== undefined && polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
								hash: String(polkadotBlockHrefFields.hash ?? ''),
								network: String(caip2StringFromValue(polkadotBlockHrefFields.$network.caip2) ?? ''),
							}) : polkadotBlockHrefFields.blockNumber !== undefined && polkadotBlockHrefFields.hash !== undefined && polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
								hash: String(polkadotBlockHrefFields.hash ?? ''),
								network: String(polkadotBlockHrefFields.$network.slug ?? ''),
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
		entityType={EntityType.PolkadotBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
