<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.SolanaInstruction>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				$transaction: {
					fields: {
						status: true,
					},
				},
				instructionKind: true,
				indexInTransaction: true,
				indexInInstruction: true,
			},
		})
	}
	{countResource}
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
		<EntityView
			entityType={EntityType.SolanaInstruction}
			entitySelector={solanaInstruction[EntityMetaKey.Selector]}
			href={
				(
					solanaInstruction[EntityMetaKey.Selector] != null && 'instructionKind' in solanaInstruction[EntityMetaKey.Selector]
					&& solanaInstruction[EntityMetaKey.Selector].instructionKind != null
					&& solanaInstruction[EntityMetaKey.Selector] != null && 'indexInTransaction' in solanaInstruction[EntityMetaKey.Selector]
					&& solanaInstruction[EntityMetaKey.Selector].indexInTransaction != null ?
						solanaInstruction[EntityMetaKey.Selector].indexInTransaction != null
						&& solanaInstruction[EntityMetaKey.Selector] != null && '$transaction' in solanaInstruction[EntityMetaKey.Selector]
						&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && 'signature' in solanaInstruction[EntityMetaKey.Selector].$transaction
						&& solanaInstruction[EntityMetaKey.Selector].$transaction.signature != null
						&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && '$network' in solanaInstruction[EntityMetaKey.Selector].$transaction
						&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in solanaInstruction[EntityMetaKey.Selector].$transaction.$network
						&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
						instructionKind: String(solanaInstruction[EntityMetaKey.Selector].instructionKind ?? ''),
						indexInTransaction: String(solanaInstruction[EntityMetaKey.Selector].indexInTransaction ?? ''),
						transactionId: String(solanaInstruction[EntityMetaKey.Selector].$transaction.signature ?? ''),
						network: String(caip2StringFromValue(solanaInstruction[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
					})
					:
							solanaInstruction[EntityMetaKey.Selector].indexInTransaction != null
							&& solanaInstruction[EntityMetaKey.Selector] != null && '$transaction' in solanaInstruction[EntityMetaKey.Selector]
							&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && 'signature' in solanaInstruction[EntityMetaKey.Selector].$transaction
							&& solanaInstruction[EntityMetaKey.Selector].$transaction.signature != null
							&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && '$network' in solanaInstruction[EntityMetaKey.Selector].$transaction
							&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in solanaInstruction[EntityMetaKey.Selector].$transaction.$network
							&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]', {
							instructionKind: String(solanaInstruction[EntityMetaKey.Selector].instructionKind ?? ''),
							indexInTransaction: String(solanaInstruction[EntityMetaKey.Selector].indexInTransaction ?? ''),
							transactionId: String(solanaInstruction[EntityMetaKey.Selector].$transaction.signature ?? ''),
							network: String(solanaInstruction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
						})
						:
								solanaInstruction[EntityMetaKey.Selector].indexInTransaction != null
								&& solanaInstruction[EntityMetaKey.Selector] != null && 'indexInInstruction' in solanaInstruction[EntityMetaKey.Selector]
								&& solanaInstruction[EntityMetaKey.Selector].indexInInstruction != null
								&& solanaInstruction[EntityMetaKey.Selector] != null && '$transaction' in solanaInstruction[EntityMetaKey.Selector]
								&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && 'signature' in solanaInstruction[EntityMetaKey.Selector].$transaction
								&& solanaInstruction[EntityMetaKey.Selector].$transaction.signature != null
								&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && '$network' in solanaInstruction[EntityMetaKey.Selector].$transaction
								&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in solanaInstruction[EntityMetaKey.Selector].$transaction.$network
								&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
								instructionKind: String(solanaInstruction[EntityMetaKey.Selector].instructionKind ?? ''),
								indexInTransaction: String(solanaInstruction[EntityMetaKey.Selector].indexInTransaction ?? ''),
								indexInInstruction: String(solanaInstruction[EntityMetaKey.Selector].indexInInstruction ?? ''),
								transactionId: String(solanaInstruction[EntityMetaKey.Selector].$transaction.signature ?? ''),
								network: String(caip2StringFromValue(solanaInstruction[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
							})
							:
									solanaInstruction[EntityMetaKey.Selector].indexInTransaction != null
									&& solanaInstruction[EntityMetaKey.Selector] != null && 'indexInInstruction' in solanaInstruction[EntityMetaKey.Selector]
									&& solanaInstruction[EntityMetaKey.Selector].indexInInstruction != null
									&& solanaInstruction[EntityMetaKey.Selector] != null && '$transaction' in solanaInstruction[EntityMetaKey.Selector]
									&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && 'signature' in solanaInstruction[EntityMetaKey.Selector].$transaction
									&& solanaInstruction[EntityMetaKey.Selector].$transaction.signature != null
									&& solanaInstruction[EntityMetaKey.Selector].$transaction != null && '$network' in solanaInstruction[EntityMetaKey.Selector].$transaction
									&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in solanaInstruction[EntityMetaKey.Selector].$transaction.$network
									&& solanaInstruction[EntityMetaKey.Selector].$transaction.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/inner/[indexInInstruction=nonNegativeInteger]', {
									instructionKind: String(solanaInstruction[EntityMetaKey.Selector].instructionKind ?? ''),
									indexInTransaction: String(solanaInstruction[EntityMetaKey.Selector].indexInTransaction ?? ''),
									indexInInstruction: String(solanaInstruction[EntityMetaKey.Selector].indexInInstruction ?? ''),
									transactionId: String(solanaInstruction[EntityMetaKey.Selector].$transaction.signature ?? ''),
									network: String(solanaInstruction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
								})
								:
									undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((solanaInstructionFields.$transaction.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction'].filter(Boolean).join(' ') || 'solana instruction'}
			{/snippet}

			{#snippet Value()}
				{[[String((solanaInstructionFields.$transaction.signature) ?? '')].filter(Boolean).join(' ') || 'solana transaction'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((solanaInstructionFields.instructionKind) ?? ''), String((solanaInstructionFields.indexInTransaction) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
