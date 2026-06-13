<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SolanaInstruction>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const solanaInstruction = subscribe(EntityType.SolanaInstruction, entityId, ({ fields: { $program: true, parsedType: true, data: true, $$accounts: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	{entityId}
	title={`Instruction #${entityId.instructionIndex.toString()}`}
	idDragPlainText={entityId.instructionIndex.toString()}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.instructionIndex.toString()}
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
			resource={solanaInstruction}
			placeholderText={`Loading Solana Instruction...`}
		>
			{#snippet children(solanaInstruction)}
				<dl>
					{#if solanaInstruction.fields.$program != null}
						<div>
							<dt>Program</dt>
							<dd>
								<SolanaProgramView
									entityId={solanaInstruction.fields.$program[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if solanaInstruction.fields.parsedType != null}
						<div>
							<dt>Parsed Type</dt>
							<dd>{solanaInstruction.fields.parsedType}</dd>
						</div>
					{/if}

					{#if solanaInstruction.fields.data != null}
						<div>
							<dt>Data</dt>
							<dd>
								<TruncatedValue
									value={solanaInstruction.fields.data}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if solanaInstruction.fields.$$accounts != null && solanaInstruction.fields.$$accounts?.values.length}
						<div>
							<dt>Accounts</dt>
							<dd>
								<ul>
									{#each solanaInstruction.fields.$$accounts.values as account (account[EntityMetaKey.Id].pubkey)}
										<li>
											<SolanaAccountView
												entityId={account[EntityMetaKey.Id]}
												layout={EntityLayout.Title}
												open={false}
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
