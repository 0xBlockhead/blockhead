<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Instructions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SolanaInstructions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SolanaInstruction>
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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import SolanaInstructionView from '$/views/SolanaInstructionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaInstruction}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				$transaction: true,
				instructionKind: true,
				indexInTransaction: true,
				indexInInstruction: true,
			},
		})
	}
	getResourceItems={(solanaInstructions) => [...new Map(solanaInstructions.values.map((solanaInstruction) => [solanaInstruction[EntityMetaKey.SelectorKey], solanaInstruction])).values()]}
	getKey={(solanaInstruction) => solanaInstruction[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Solana instructions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: solanaInstruction })}
		{@const solanaInstructionFields = { ...solanaInstruction[EntityMetaKey.Selector], ...solanaInstruction }}
		{@const selection = select(EntityType.SolanaInstruction, solanaInstruction[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const solanaInstructionHrefFields = { ...solanaInstruction, ...solanaInstruction[EntityMetaKey.Selector] }}
		<SolanaInstructionView
			selection={selection}
			prefetched={solanaInstructionFields}
			href={
				(solanaInstruction[EntityMetaKey.Selector].instructionKind === 'Instruction' && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
					instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
					indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
					transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
					network: String(caip2StringFromValue(solanaInstructionHrefFields.$transaction.$network.caip2) ?? ''),
				}) : solanaInstruction[EntityMetaKey.Selector].instructionKind === 'Instruction' && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
					instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
					indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
					transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
					network: String(solanaInstructionHrefFields.$transaction.$network.slug ?? ''),
				}) : solanaInstruction[EntityMetaKey.Selector].instructionKind === 'InnerInstruction' && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined && solanaInstructionHrefFields.indexInInstruction !== undefined && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
					instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
					indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
					indexInInstruction: String(solanaInstructionHrefFields.indexInInstruction ?? ''),
					transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
					network: String(caip2StringFromValue(solanaInstructionHrefFields.$transaction.$network.caip2) ?? ''),
				}) : solanaInstruction[EntityMetaKey.Selector].instructionKind === 'InnerInstruction' && solanaInstructionHrefFields.instructionKind !== undefined && solanaInstructionHrefFields.indexInTransaction !== undefined && solanaInstructionHrefFields.indexInInstruction !== undefined && solanaInstructionHrefFields.$transaction !== undefined && solanaInstructionHrefFields.$transaction.signature !== undefined && solanaInstructionHrefFields.$transaction.$network !== undefined && solanaInstructionHrefFields.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
					instructionKind: String(solanaInstructionHrefFields.instructionKind ?? ''),
					indexInTransaction: String(solanaInstructionHrefFields.indexInTransaction ?? ''),
					indexInInstruction: String(solanaInstructionHrefFields.indexInInstruction ?? ''),
					transactionId: String(solanaInstructionHrefFields.$transaction.signature ?? ''),
					network: String(solanaInstructionHrefFields.$transaction.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
