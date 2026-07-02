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
		title = 'EVM logs',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM logs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmLogs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmLog>
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
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		Each row is one <code>LOG</code> opcode captured on the parent transaction receipt: emitter address, topics, and data payload.
	</p>

	<p>
		Topic 0 often fingerprints an ABI log declaration; additional topics carry indexed arguments when the emitter used ABI-style indexing.
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
					data: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmLog}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(evmLogs)}
			{@const uniqueEvmLogs = [...new Map(evmLogs.values.map((evmLog) => [evmLog[EntityMetaKey.SelectorKey], evmLog])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmLog}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmLogs.values.length === uniqueEvmLogs.length && evmLogs.totalCount != null && evmLogs.totalCount >= uniqueEvmLogs.length ? evmLogs.totalCount : uniqueEvmLogs.length}
				getKey={(evmLog) => evmLog[EntityMetaKey.SelectorKey]}
				items={uniqueEvmLogs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM logs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmLog }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmLog> })}
					<EntityView
						entityType={EntityType.EvmLog}
						entitySelector={evmLog.entitySelector}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(({ ...evmLog.entitySelector, ...evmLog }).$transaction.$network.caip2.namespace)}:${String(({ ...evmLog.entitySelector, ...evmLog }).$transaction.$network.caip2.reference)}`,
								transactionId: String(({ ...evmLog.entitySelector, ...evmLog }).$transaction.txHash),
								indexInTransaction: String(({ ...evmLog.entitySelector, ...evmLog }).indexInTransaction),
							})
						}
						layout={EntityLayout.Summary}
						open={false}
					>
						{#snippet Title()}
							{@const indexInTransaction0 = ({ ...evmLog.entitySelector, ...evmLog }).indexInTransaction}
							Log #
							<span>Log #</span>
							{String((indexInTransaction0) ?? '')}
							{@const data1 = ({ ...evmLog.entitySelector, ...evmLog }).data}
							<TruncatedValue value={String(data1)} />
						{/snippet}
					</EntityView>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmLog}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
