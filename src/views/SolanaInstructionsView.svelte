<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		title = 'Instructions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.SolanaInstruction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaInstruction}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$transaction: {
					fields: {
						status: true,
					},
				},
				instructionKind: true,
				indexInTransaction: true,
			},
		})
	}
>
	{#snippet Item({ item: solanaInstruction })}
		{@const solanaInstructionSelector = solanaInstruction[EntityMetaKey.Selector]}
		{@const transaction = solanaInstructionSelector.$transaction}
		<EntityView
			entityType={EntityType.SolanaInstruction}
			entitySelector={solanaInstructionSelector}
			href={
				solanaInstructionSelector.instructionKind === 'InnerInstruction'
				&& 'indexInInstruction' in solanaInstructionSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]/(solanaInstruction)/inner/[indexInInstruction=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							transactionId: transaction.signature,
							instructionKind: solanaInstructionSelector.instructionKind,
							indexInTransaction: String(solanaInstructionSelector.indexInTransaction),
							indexInInstruction: String(solanaInstructionSelector.indexInInstruction),
						}
					)
				:
					solanaInstructionSelector.instructionKind === 'Instruction' ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/instruction/[instructionKind=stringSegment]/[indexInTransaction=nonNegativeInteger]',
							{
								network: (
									'caip2' in transaction.$network ?
										caip2StringFromValue(transaction.$network.caip2)
									:
										transaction.$network.slug
								),
								transactionId: transaction.signature,
								instructionKind: solanaInstructionSelector.instructionKind,
								indexInTransaction: String(solanaInstructionSelector.indexInTransaction),
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{solanaInstructionSelector.$transaction.signature || 'solana transaction'}
			{/snippet}

			{#snippet Value()}
				{solanaInstructionSelector.$transaction.signature || 'solana transaction'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[solanaInstructionSelector.instructionKind, String(solanaInstructionSelector.indexInTransaction)].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
