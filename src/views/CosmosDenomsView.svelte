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
		title = 'Denoms',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'CosmosDenoms-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.CosmosDenom>
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
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
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
					symbol: true,
					display: true,
					denom: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(cosmosDenoms)}
			{@const uniqueCosmosDenoms = [...new Map(cosmosDenoms.values.map((cosmosDenom) => [cosmosDenom[EntityMetaKey.SelectorKey], cosmosDenom])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.CosmosDenom}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={cosmosDenoms.totalCount}
				getKey={(cosmosDenom) => cosmosDenom[EntityMetaKey.SelectorKey]}
				items={uniqueCosmosDenoms}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Cosmos denoms yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: cosmosDenom }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.CosmosDenom> })}
					{@const cosmosDenomFields = { ...cosmosDenom[EntityMetaKey.Selector], ...cosmosDenom }}
					{@const cosmosDenomHrefFields = { ...cosmosDenom, ...cosmosDenom[EntityMetaKey.Selector] }}
					<CosmosDenomView
						selection={select(EntityType.CosmosDenom, cosmosDenom[EntityMetaKey.Selector])}
						prefetched={cosmosDenomFields}
						href={
							(cosmosDenomHrefFields.$network !== undefined && cosmosDenomHrefFields.$network.caip2 !== undefined && cosmosDenomHrefFields.$network.caip2.namespace !== undefined && cosmosDenomHrefFields.$network !== undefined && cosmosDenomHrefFields.$network.caip2 !== undefined && cosmosDenomHrefFields.$network.caip2.reference !== undefined && cosmosDenomHrefFields.denom !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/denom/[denom]', {
								caip2: `${String(cosmosDenomHrefFields.$network.caip2.namespace ?? '')}:${String(cosmosDenomHrefFields.$network.caip2.reference ?? '')}`,
								denom: String(cosmosDenomHrefFields.denom ?? ''),
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
		entityType={EntityType.CosmosDenom}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
