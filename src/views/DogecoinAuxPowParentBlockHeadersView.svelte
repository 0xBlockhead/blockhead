<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Dogecoin aux pow parent block headers',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinAuxPowParentBlockHeaders-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.DogecoinAuxPowParentBlockHeader>
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

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import DogecoinAuxPowParentBlockHeaderView from '$/views/DogecoinAuxPowParentBlockHeaderView.svelte'
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
					$auxPow: true,
					merkleRoot: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DogecoinAuxPowParentBlockHeader}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(dogecoinAuxPowParentBlockHeaders)}
			{@const uniqueDogecoinAuxPowParentBlockHeaders = [...new Map(dogecoinAuxPowParentBlockHeaders.values.map((dogecoinAuxPowParentBlockHeader) => [dogecoinAuxPowParentBlockHeader[EntityMetaKey.SelectorKey], dogecoinAuxPowParentBlockHeader])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DogecoinAuxPowParentBlockHeader}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={dogecoinAuxPowParentBlockHeaders.totalCount}
				getKey={(dogecoinAuxPowParentBlockHeader) => dogecoinAuxPowParentBlockHeader[EntityMetaKey.SelectorKey]}
				items={uniqueDogecoinAuxPowParentBlockHeaders}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Dogecoin aux pow parent block headers yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: dogecoinAuxPowParentBlockHeader })}
					{@const dogecoinAuxPowParentBlockHeaderFields = { ...dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector], ...dogecoinAuxPowParentBlockHeader }}
					{@const selection = select(EntityType.DogecoinAuxPowParentBlockHeader, dogecoinAuxPowParentBlockHeader[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					<DogecoinAuxPowParentBlockHeaderView
						selection={selection}
						prefetched={dogecoinAuxPowParentBlockHeaderFields}
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
		entityType={EntityType.DogecoinAuxPowParentBlockHeader}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
