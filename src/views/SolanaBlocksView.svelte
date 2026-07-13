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
		id = 'SolanaBlocks-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaBlock>
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
	import SolanaBlockView from '$/views/SolanaBlockView.svelte'
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
					slot: true,
					blockHeight: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(solanaBlocks)}
			{@const uniqueSolanaBlocks = [...new Map(solanaBlocks.values.map((solanaBlock) => [solanaBlock[EntityMetaKey.SelectorKey], solanaBlock])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaBlock}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaBlocks.totalCount}
				getKey={(solanaBlock) => solanaBlock[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaBlocks}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana blocks yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaBlock }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaBlock> })}
					{@const solanaBlockFields = { ...solanaBlock[EntityMetaKey.Selector], ...solanaBlock }}
					{@const solanaBlockHrefFields = { ...solanaBlock, ...solanaBlock[EntityMetaKey.Selector] }}
					<SolanaBlockView
						selection={select(EntityType.SolanaBlock, solanaBlock[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaBlockFields}
						href={
							(solanaBlockHrefFields.$network !== undefined && solanaBlockHrefFields.$network.slug !== undefined && solanaBlockHrefFields.slot !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/block/[blockNumber=nonNegativeBigInt]', {
								network: String(solanaBlockHrefFields.$network.slug ?? ''),
								blockNumber: String(solanaBlockHrefFields.slot ?? ''),
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
		entityType={EntityType.SolanaBlock}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
