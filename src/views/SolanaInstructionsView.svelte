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
		title = 'Instructions',
		typeAnnotationParagraphs = [],
		placeholderText,
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
			selection({
				fields: {
					$transaction: true,
					instructionKind: true,
					indexInTransaction: true,
					indexInInstruction: true,
				},
			})
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
				placeholderText={placeholderText}
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
				totalCount={solanaInstructions.totalCount}
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
					{@const solanaInstructionFields = { ...solanaInstruction[EntityMetaKey.Selector], ...solanaInstruction }}
					{@const solanaInstructionHrefFields = { ...solanaInstruction, ...solanaInstruction[EntityMetaKey.Selector] }}
					<SolanaInstructionView
						selection={select(EntityType.SolanaInstruction, solanaInstruction[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={solanaInstructionFields}
						href={
							(solanaInstruction[EntityMetaKey.Selector].instructionKind !== undefined && solanaInstruction[EntityMetaKey.Selector].instructionKind === 'Instruction' && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.slug !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
								network: String(solanaInstructionHrefFields.$transaction.$network.slug ?? ''),
								transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
								instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
								indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
							}) : solanaInstruction[EntityMetaKey.Selector].instructionKind !== undefined && solanaInstruction[EntityMetaKey.Selector].instructionKind === 'InnerInstruction' && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.slug !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined && solanaInstructionHrefFields.indexInInstruction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
								network: String(solanaInstructionHrefFields.$transaction.$network.slug ?? ''),
								transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
								instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
								indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
								indexInInstruction: String(solanaInstructionHrefFields.indexInInstruction ?? ''),
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
		entityType={EntityType.SolanaInstruction}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
