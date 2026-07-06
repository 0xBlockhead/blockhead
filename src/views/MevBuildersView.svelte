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
		title = 'MEV builders',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'MevBuilders-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.MevBuilder>
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
	import MevBuilderView from '$/views/MevBuilderView.svelte'
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
					builderPubkey: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevBuilder}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(mevBuilders)}
			{@const uniqueMevBuilders = [...new Map(mevBuilders.values.map((mevBuilder) => [mevBuilder[EntityMetaKey.SelectorKey], mevBuilder])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.MevBuilder}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mevBuilders.totalCount}
				getKey={(mevBuilder) => mevBuilder[EntityMetaKey.SelectorKey]}
				items={uniqueMevBuilders}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MEV builders yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mevBuilder }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.MevBuilder> })}
					{@const mevBuilderFields = { ...mevBuilder[EntityMetaKey.Selector], ...mevBuilder }}
					{@const mevBuilderHrefFields = { ...mevBuilder, ...mevBuilder[EntityMetaKey.Selector] }}
					<MevBuilderView
						selection={select(EntityType.MevBuilder, mevBuilder[EntityMetaKey.Selector])}
						prefetched={mevBuilderFields}
						href={
							(mevBuilderHrefFields.$network !== undefined && mevBuilderHrefFields.$network.caip2 !== undefined && mevBuilderHrefFields.$network.caip2.namespace !== undefined && mevBuilderHrefFields.$network !== undefined && mevBuilderHrefFields.$network.caip2 !== undefined && mevBuilderHrefFields.$network.caip2.reference !== undefined && mevBuilderHrefFields.builderPubkey !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/mev/builder/[builderPubkey]', {
								caip2: `${String(mevBuilderHrefFields.$network.caip2.namespace ?? '')}:${String(mevBuilderHrefFields.$network.caip2.reference ?? '')}`,
								builderPubkey: String(mevBuilderHrefFields.builderPubkey ?? ''),
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
		entityType={EntityType.MevBuilder}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
