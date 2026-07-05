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
		title = 'Dogecoin aux pow merkle branches',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'DogecoinAuxPowMerkleBranches-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.DogecoinAuxPowMerkleBranch>
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
	import DogecoinAuxPowMerkleBranchView from '$/views/DogecoinAuxPowMerkleBranchView.svelte'
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
					branchKind: true,
					$auxPow: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(dogecoinAuxPowMerkleBranches)}
			{@const uniqueDogecoinAuxPowMerkleBranches = [...new Map(dogecoinAuxPowMerkleBranches.values.map((dogecoinAuxPowMerkleBranch) => [dogecoinAuxPowMerkleBranch[EntityMetaKey.SelectorKey], dogecoinAuxPowMerkleBranch])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.DogecoinAuxPowMerkleBranch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={dogecoinAuxPowMerkleBranches.totalCount}
				getKey={(dogecoinAuxPowMerkleBranch) => dogecoinAuxPowMerkleBranch[EntityMetaKey.SelectorKey]}
				items={uniqueDogecoinAuxPowMerkleBranches}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Dogecoin aux pow merkle branches yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: dogecoinAuxPowMerkleBranch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.DogecoinAuxPowMerkleBranch> })}
					{@const dogecoinAuxPowMerkleBranchFields = { ...dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector], ...dogecoinAuxPowMerkleBranch }}
					<DogecoinAuxPowMerkleBranchView
						selection={select(EntityType.DogecoinAuxPowMerkleBranch, dogecoinAuxPowMerkleBranch[EntityMetaKey.Selector])}
						prefetched={dogecoinAuxPowMerkleBranchFields}
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
		entityType={EntityType.DogecoinAuxPowMerkleBranch}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
