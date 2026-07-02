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
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title = 'EVM internal transfers',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM internal transfers...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmInternalTransfers-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmInternalTransfer>
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
	import NumberValue from '$/components/NumberValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Native currency sent by internal <code>CALL</code> frames during execution, distinct from the signed envelope <code>value</code>.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					indexInTransaction: true,
					callType: true,
					value: true,
					success: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmInternalTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(evmInternalTransfers)}
			{@const uniqueEvmInternalTransfers = [...new Map(evmInternalTransfers.values.map((evmInternalTransfer) => [evmInternalTransfer[EntityMetaKey.SelectorKey], evmInternalTransfer])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmInternalTransfer}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmInternalTransfers.values.length === uniqueEvmInternalTransfers.length && evmInternalTransfers.totalCount != null && evmInternalTransfers.totalCount >= uniqueEvmInternalTransfers.length ? evmInternalTransfers.totalCount : uniqueEvmInternalTransfers.length}
				getKey={(evmInternalTransfer) => evmInternalTransfer[EntityMetaKey.SelectorKey]}
				items={uniqueEvmInternalTransfers}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM internal transfers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmInternalTransfer }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmInternalTransfer> })}
					<EntityView
						entityType={EntityType.EvmInternalTransfer}
						entitySelector={evmInternalTransfer.entitySelector}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/internal-transfer/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).$transaction.$network.caip2.namespace)}:${String(({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).$transaction.$network.caip2.reference)}`,
								transactionId: String(({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).$transaction.txHash),
								indexInTransaction: String(({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).indexInTransaction),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const indexInTransaction0 = ({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).indexInTransaction}
							Internal #
							<span>Internal #</span>
							{String((indexInTransaction0) ?? '')}
							{@const callType1 = ({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).callType}
							{String((callType1) ?? '')}
							{@const value2 = ({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).value}
							<NumberValue value={Number(value2)} />
						{/snippet}

						{#snippet HeadingAfter()}
							{@const successAfter0 = ({ ...evmInternalTransfer.entitySelector, ...evmInternalTransfer }).success}
							{#if successAfter0 != null}
								<span data-text="muted">
									{String((successAfter0) ?? '')}
								</span>
							{/if}
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmInternalTransfer}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
