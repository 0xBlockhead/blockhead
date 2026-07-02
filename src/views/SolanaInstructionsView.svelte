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
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Instructions',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Solana instructions...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaInstructions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SolanaInstruction>
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
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
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
					$transaction: true,
					instructionKind: true,
					indexInTransaction: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaInstruction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(solanaInstructions)}
			{@const uniqueSolanaInstructions = [...new Map(solanaInstructions.values.map((solanaInstruction) => [solanaInstruction[EntityMetaKey.SelectorKey], solanaInstruction])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SolanaInstruction}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={solanaInstructions.values.length === uniqueSolanaInstructions.length && solanaInstructions.totalCount != null && solanaInstructions.totalCount >= uniqueSolanaInstructions.length ? solanaInstructions.totalCount : uniqueSolanaInstructions.length}
				getKey={(solanaInstruction) => solanaInstruction[EntityMetaKey.SelectorKey]}
				items={uniqueSolanaInstructions}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Solana instructions yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: solanaInstruction }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SolanaInstruction> })}
					<SolanaInstructionView
						href={
							(({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.$transaction != null && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.instructionKind != null && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.indexInTransaction != null && String(String(networkByCaip2[String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.$network.caip2)].slug)) !== '' && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.$transaction?.signature != null ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.$network.caip2)].slug),
								signature: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.signature),
								instructionKind: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).instructionKind),
								indexInTransaction: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).indexInTransaction),
							}) : ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.$transaction != null && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.instructionKind != null && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.indexInTransaction != null && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.indexInInstruction != null && String(String(networkByCaip2[String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.$network.caip2)].slug)) !== '' && ({ ...solanaInstruction.entitySelector, ...solanaInstruction })?.$transaction?.signature != null ? resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/tx/[signature]/instruction/[instructionKind]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.$network.caip2)].slug),
								signature: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).$transaction.signature),
								instructionKind: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).instructionKind),
								indexInTransaction: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).indexInTransaction),
								indexInInstruction: String(({ ...solanaInstruction.entitySelector, ...solanaInstruction }).indexInInstruction),
							}) : undefined)
						}
						selection={select(EntityType.SolanaInstruction, solanaInstruction.entitySelector)}
						prefetched={solanaInstruction}
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
		entityType={EntityType.SolanaInstruction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
