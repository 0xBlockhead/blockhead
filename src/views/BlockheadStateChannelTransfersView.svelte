<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'State channel transfers',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadStateChannelTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadStateChannelTransfer>
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
	import BlockheadStateChannelTransferView from '$/views/BlockheadStateChannelTransferView.svelte'
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
					amount: true,
					status: true,
					timestamp: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(blockheadStateChannelTransfers)}
			{@const uniqueBlockheadStateChannelTransfers = [...new Map(blockheadStateChannelTransfers.values.map((blockheadStateChannelTransfer) => [blockheadStateChannelTransfer[EntityMetaKey.SelectorKey], blockheadStateChannelTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BlockheadStateChannelTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={blockheadStateChannelTransfers.totalCount}
				getKey={(blockheadStateChannelTransfer) => blockheadStateChannelTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueBlockheadStateChannelTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Blockhead state channel transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: blockheadStateChannelTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BlockheadStateChannelTransfer> })}
					{@const blockheadStateChannelTransferFields = { ...blockheadStateChannelTransfer[EntityMetaKey.Selector], ...blockheadStateChannelTransfer }}
					<BlockheadStateChannelTransferView
						selection={select(EntityType.BlockheadStateChannelTransfer, blockheadStateChannelTransfer[EntityMetaKey.Selector])}
						prefetched={blockheadStateChannelTransferFields}
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
		entityType={EntityType.BlockheadStateChannelTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
