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
		title = 'Allowances',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Allowances...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmActorCoinAllowances-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmActorCoinAllowance>
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
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection.sources == null ? selection({
				fields: {
					$contract: true,
					$spender: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmActorCoinAllowance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(evmActorCoinAllowances)}
			{@const uniqueEvmActorCoinAllowances = [...new Map(evmActorCoinAllowances.values.map((evmActorCoinAllowance) => [evmActorCoinAllowance[EntityMetaKey.SelectorKey], evmActorCoinAllowance])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmActorCoinAllowance}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmActorCoinAllowances.values.length === uniqueEvmActorCoinAllowances.length && evmActorCoinAllowances.totalCount != null && evmActorCoinAllowances.totalCount >= uniqueEvmActorCoinAllowances.length ? evmActorCoinAllowances.totalCount : uniqueEvmActorCoinAllowances.length}
				getKey={(evmActorCoinAllowance) => evmActorCoinAllowance[EntityMetaKey.SelectorKey]}
				items={uniqueEvmActorCoinAllowances}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No allowances yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmActorCoinAllowance }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmActorCoinAllowance> })}
					<EvmActorCoinAllowanceView
						selection={select(EntityType.EvmActorCoinAllowance, evmActorCoinAllowance.entitySelector)}
						prefetched={evmActorCoinAllowance}
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
		entityType={EntityType.EvmActorCoinAllowance}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
