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


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM logs',
		typeAnnotationParagraphs = [],
		placeholderText,
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmLogView from '$/views/EvmLogView.svelte'
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
			selection({
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					indexInTransaction: true,
					data: true,
					$transaction: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={evmLogs.totalCount}
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
					{@const evmLogFields = { ...evmLog[EntityMetaKey.Selector], ...evmLog }}
					{@const evmLogHrefFields = { ...evmLog, ...evmLog[EntityMetaKey.Selector] }}
					<EvmLogView
						selection={select(EntityType.EvmLog, evmLog[EntityMetaKey.Selector])}
						prefetched={evmLogFields}
						href={
							(evmLogHrefFields.$transaction !== undefined && evmLogHrefFields.$transaction.$network !== undefined && evmLogHrefFields.$transaction.$network.caip2 !== undefined && evmLogHrefFields.$transaction.$network.caip2.namespace !== undefined && evmLogHrefFields.$transaction !== undefined && evmLogHrefFields.$transaction.$network !== undefined && evmLogHrefFields.$transaction.$network.caip2 !== undefined && evmLogHrefFields.$transaction.$network.caip2.reference !== undefined && evmLogHrefFields.$transaction !== undefined && evmLogHrefFields.$transaction.txHash !== undefined && evmLogHrefFields.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(transactions)/tx/[transactionId=evmTxHash]/log/[indexInTransaction=nonNegativeInteger]', {
								caip2: `${String(evmLogHrefFields.$transaction.$network.caip2.namespace ?? '')}:${String(evmLogHrefFields.$transaction.$network.caip2.reference ?? '')}`,
								transactionId: String(evmLogHrefFields.$transaction.txHash ?? ''),
								indexInTransaction: String(evmLogHrefFields.indexInTransaction ?? ''),
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
		entityType={EntityType.EvmLog}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
