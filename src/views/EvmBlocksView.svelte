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
		title = 'EVM blocks',
		typeAnnotationParagraphs = ['A block in an EVM-compatible execution chain.'],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmBlock>
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
	import EvmBlockView from '$/views/EvmBlockView.svelte'
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
				entityType={EntityType.EvmBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmBlocks)}
			{@const uniqueEvmBlocks = [...new Map(evmBlocks.values.map((evmBlock) => [evmBlock[EntityMetaKey.SelectorKey], evmBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmBlocks.totalCount}
				getKey={(evmBlock) => evmBlock[EntityMetaKey.SelectorKey]}
				items={uniqueEvmBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmBlock> })}
					{@const evmBlockFields = { ...evmBlock[EntityMetaKey.Selector], ...evmBlock }}
					{@const evmBlockHrefFields = { ...evmBlock, ...evmBlock[EntityMetaKey.Selector] }}
					<EvmBlockView
						selection={select(EntityType.EvmBlock, evmBlock[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={evmBlockFields}
						href={
							(evmBlockHrefFields.$network !== undefined && evmBlockHrefFields.$network.slug !== undefined && evmBlockHrefFields.blockNumber !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								network: String(evmBlockHrefFields.$network.slug ?? ''),
								blockNumber: String(evmBlockHrefFields.blockNumber ?? ''),
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
		entityType={EntityType.EvmBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
