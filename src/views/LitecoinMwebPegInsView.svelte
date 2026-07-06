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
		title = 'Litecoin MWEB peg ins',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'LitecoinMwebPegIns-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.LitecoinMwebPegIn>
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
	import LitecoinMwebPegInView from '$/views/LitecoinMwebPegInView.svelte'
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
					pegInIndex: true,
					$transparentOutput: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LitecoinMwebPegIn}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(litecoinMwebPegIns)}
			{@const uniqueLitecoinMwebPegIns = [...new Map(litecoinMwebPegIns.values.map((litecoinMwebPegIn) => [litecoinMwebPegIn[EntityMetaKey.SelectorKey], litecoinMwebPegIn])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.LitecoinMwebPegIn}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={litecoinMwebPegIns.totalCount}
				getKey={(litecoinMwebPegIn) => litecoinMwebPegIn[EntityMetaKey.SelectorKey]}
				items={uniqueLitecoinMwebPegIns}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Litecoin MWEB peg ins yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: litecoinMwebPegIn }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.LitecoinMwebPegIn> })}
					{@const litecoinMwebPegInFields = { ...litecoinMwebPegIn[EntityMetaKey.Selector], ...litecoinMwebPegIn }}
					<LitecoinMwebPegInView
						selection={select(EntityType.LitecoinMwebPegIn, litecoinMwebPegIn[EntityMetaKey.Selector])}
						prefetched={litecoinMwebPegInFields}
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
		entityType={EntityType.LitecoinMwebPegIn}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
