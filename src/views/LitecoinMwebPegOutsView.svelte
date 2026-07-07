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
		title = 'Litecoin MWEB peg outs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebPegOuts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LitecoinMwebPegOut>
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
	import LitecoinMwebPegOutView from '$/views/LitecoinMwebPegOutView.svelte'
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
					$transaction: true,
					pegOutIndex: true,
					$transparentOutput: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LitecoinMwebPegOut}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(litecoinMwebPegOuts)}
			{@const uniqueLitecoinMwebPegOuts = [...new Map(litecoinMwebPegOuts.values.map((litecoinMwebPegOut) => [litecoinMwebPegOut[EntityMetaKey.SelectorKey], litecoinMwebPegOut])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LitecoinMwebPegOut}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={litecoinMwebPegOuts.totalCount}
				getKey={(litecoinMwebPegOut) => litecoinMwebPegOut[EntityMetaKey.SelectorKey]}
				items={uniqueLitecoinMwebPegOuts}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Litecoin MWEB peg outs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: litecoinMwebPegOut }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LitecoinMwebPegOut> })}
					{@const litecoinMwebPegOutFields = { ...litecoinMwebPegOut[EntityMetaKey.Selector], ...litecoinMwebPegOut }}
					<LitecoinMwebPegOutView
						selection={select(EntityType.LitecoinMwebPegOut, litecoinMwebPegOut[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={litecoinMwebPegOutFields}
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
		entityType={EntityType.LitecoinMwebPegOut}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
