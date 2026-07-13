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
		title = 'Blocks',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'PolkadotBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.PolkadotBlock>
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

				{#snippet Item({ item: polkadotBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.PolkadotBlock> })}
					{@const polkadotBlockFields = { ...polkadotBlock[EntityMetaKey.Selector], ...polkadotBlock }}
					{@const polkadotBlockHrefFields = { ...polkadotBlock, ...polkadotBlock[EntityMetaKey.Selector] }}
					<PolkadotBlockView
						selection={select(EntityType.PolkadotBlock, polkadotBlock[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={polkadotBlockFields}
						href={
							(polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.slug !== undefined && polkadotBlockHrefFields.blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								network: String(polkadotBlockHrefFields.$network.slug ?? ''),
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
							}) : polkadotBlockHrefFields.$network !== undefined && polkadotBlockHrefFields.$network.slug !== undefined && polkadotBlockHrefFields.blockNumber !== undefined && polkadotBlockHrefFields.hash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]/[hash=stringSegment]', {
								network: String(polkadotBlockHrefFields.$network.slug ?? ''),
								blockNumber: String(polkadotBlockHrefFields.blockNumber ?? ''),
								hash: String(polkadotBlockHrefFields.hash ?? ''),
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
