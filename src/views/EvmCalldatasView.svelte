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
		title = 'EVM calldata',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading EVM calldata...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmCalldatas-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmCalldata>
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
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
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
					hex: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmCalldata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(evmCalldatas)}
			{@const uniqueEvmCalldatas = [...new Map(evmCalldatas.values.map((evmCalldata) => [evmCalldata[EntityMetaKey.SelectorKey], evmCalldata])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmCalldata}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmCalldatas.values.length === uniqueEvmCalldatas.length && evmCalldatas.totalCount != null && evmCalldatas.totalCount >= uniqueEvmCalldatas.length ? evmCalldatas.totalCount : uniqueEvmCalldatas.length}
				getKey={(evmCalldata) => evmCalldata[EntityMetaKey.SelectorKey]}
				items={uniqueEvmCalldatas}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM calldata yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmCalldata }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmCalldata> })}
					<EvmCalldataView
						href={
							(({ ...evmCalldata.entitySelector, ...evmCalldata })?.hex != null ? resolve('/(explore)/(evm)/evm/(calldata)/calldata') : ({ ...evmCalldata.entitySelector, ...evmCalldata })?.hex != null ? resolve('/(explore)/(evm)/evm/(calldata)/calldata/[hex]', {
								hex: String(({ ...evmCalldata.entitySelector, ...evmCalldata }).hex),
							}) : undefined)
						}
						selection={select(EntityType.EvmCalldata, evmCalldata.entitySelector)}
						prefetched={evmCalldata}
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
		entityType={EntityType.EvmCalldata}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
