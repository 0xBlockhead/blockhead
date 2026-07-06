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
		title = 'EVM rollups',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmRollups-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmRollup>
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
	import EvmRollupView from '$/views/EvmRollupView.svelte'
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
					name: true,
					projectId: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmRollup}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(evmRollups)}
			{@const uniqueEvmRollups = [...new Map(evmRollups.values.map((evmRollup) => [evmRollup[EntityMetaKey.SelectorKey], evmRollup])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EvmRollup}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={evmRollups.totalCount}
				getKey={(evmRollup) => evmRollup[EntityMetaKey.SelectorKey]}
				items={uniqueEvmRollups}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EVM rollups yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: evmRollup }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EvmRollup> })}
					{@const evmRollupFields = { ...evmRollup[EntityMetaKey.Selector], ...evmRollup }}
					{@const evmRollupHrefFields = { ...evmRollup, ...evmRollup[EntityMetaKey.Selector] }}
					<EvmRollupView
						selection={select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector])}
						prefetched={evmRollupFields}
						href={
							(evmRollupHrefFields.$network !== undefined && evmRollupHrefFields.$network.caip2 !== undefined && evmRollupHrefFields.$network.caip2.namespace !== undefined && evmRollupHrefFields.$network !== undefined && evmRollupHrefFields.$network.caip2 !== undefined && evmRollupHrefFields.$network.caip2.reference !== undefined && evmRollupHrefFields.projectId !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
								caip2: `${String(evmRollupHrefFields.$network.caip2.namespace ?? '')}:${String(evmRollupHrefFields.$network.caip2.reference ?? '')}`,
								projectId: String(evmRollupHrefFields.projectId ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.EvmRollup}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
