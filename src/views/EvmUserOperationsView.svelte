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
		title = 'User operations',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading User operations...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmUserOperations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmUserOperation>
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
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#snippet ModelTypeAnnotationTooltip()}
	<p>
		ERC-4337 user operations are intent objects bundlers include in transactions to the entry point.
	</p>
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					hash: true,
					successful: true,
				},
				limit: 16,
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmUserOperation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
			/>
		{/snippet}

		{#snippet children(evmUserOperations)}
			{@const uniqueEvmUserOperations = [...new Map(evmUserOperations.values.map((evmUserOperation) => [evmUserOperation[EntityMetaKey.SelectorKey], evmUserOperation])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmUserOperation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
				totalCount={evmUserOperations.values.length === uniqueEvmUserOperations.length && evmUserOperations.totalCount != null && evmUserOperations.totalCount >= uniqueEvmUserOperations.length ? evmUserOperations.totalCount : uniqueEvmUserOperations.length}
				getKey={(evmUserOperation) => evmUserOperation[EntityMetaKey.SelectorKey]}
				items={uniqueEvmUserOperations}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No user operations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmUserOperation }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmUserOperation> })}
					<EvmUserOperationView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/user-operation/[userOperationHash=userOperationHash]', {
								caip2: `${String(({ ...evmUserOperation.entitySelector, ...evmUserOperation }).$network.caip2.namespace)}:${String(({ ...evmUserOperation.entitySelector, ...evmUserOperation }).$network.caip2.reference)}`,
								userOperationHash: String(({ ...evmUserOperation.entitySelector, ...evmUserOperation }).hash),
							})
						}
						selection={select(EntityType.EvmUserOperation, evmUserOperation.entitySelector)}
						prefetched={evmUserOperation}
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
		entityType={EntityType.EvmUserOperation}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : ModelTypeAnnotationTooltip}
	/>
{/if}
