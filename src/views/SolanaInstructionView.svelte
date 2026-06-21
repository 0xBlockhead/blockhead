<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelectorForSelectorName } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import {
		SolanaInstructionKind,
		SolanaInstructionSelector,
	} from '$/schema/SolanaInstruction.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { select } from '$/routes/+layout.svelte'

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SolanaInstruction> & {
				entitySelector: (
					| EntitySelectorForSelectorName<typeof schema, EntityType.SolanaInstruction, SolanaInstructionSelector.SolanaTransactionInstruction>
					| EntitySelectorForSelectorName<typeof schema, EntityType.SolanaInstruction, SolanaInstructionSelector.SolanaTransactionInnerInstruction>
				) & {
					readonly innerInstructionIndex?: number
				}
			}
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()


	const instructionId = $derived(
		(
			selection.entitySelector.instructionKind === SolanaInstructionKind.InnerInstruction
			&& selection.entitySelector.innerInstructionIndex != null
		) ?
			`${String(selection.entitySelector.instructionIndex)}.${String(selection.entitySelector.innerInstructionIndex)}`
		:
			String(selection.entitySelector.instructionIndex),
	)

	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.instructionKind === SolanaInstructionKind.InnerInstruction ?
		`Inner instruction #${instructionId}`
	:
		`Instruction #${instructionId}`}
	idDragPlainText={instructionId}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{instructionId}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Instruction </span>
			{#if Value}
				{@render Value()}
			{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection( { fields: { $program: true, parsedType: true, data: true, stackHeight: true, $$accounts: true } })}
			placeholderText="Loading Solana Instruction..."
		>
			{#snippet children(solanaInstruction)}
				<dl>
					{#if solanaInstruction.$program != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									selection={select(EntityType.SolanaProgram, solanaInstruction.$program[EntityMetaKey.Selector])}
									layout={EntityLayout.Title}

								/>
							</dd>
						</div>
					{/if}

					{#if solanaInstruction.parsedType != null}
						<div>
							<dt>Parsed Type</dt>
							<dd>{solanaInstruction.parsedType}</dd>
						</div>
					{/if}

					{#if solanaInstruction.data != null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue
									value={solanaInstruction.data}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if solanaInstruction.stackHeight != null}
						<div>
							<dt>Stack Height</dt>
							<dd>{solanaInstruction.stackHeight}</dd>
						</div>
					{/if}

					{#if solanaInstruction.$$accounts != null && solanaInstruction.$$accounts.values.length}
						<div>
							<dt>Accounts</dt>
							<dd>
								<ul>
									{#each solanaInstruction.$$accounts.values as account (account[EntityMetaKey.Selector].pubkey)}
										<li>
											<SolanaAccountView
												selection={select(EntityType.SolanaAccount, account[EntityMetaKey.Selector])}
												layout={EntityLayout.Title}

											/>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
