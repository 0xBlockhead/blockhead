<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	import { subscribe } from '$/routes/+layout.svelte'

	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.SolanaInstruction>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const solanaInstruction = subscribe(EntityType.SolanaInstruction, selector, ({ fields: { $program: true, parsedType: true, data: true, $$accounts: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import SolanaProgramView from '$/views/SolanaProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.SolanaInstruction}
	entitySelector={selector}
	title={`Instruction #${selector.instructionIndex.toString()}`}
	idDragPlainText={selector.instructionIndex.toString()}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.instructionIndex.toString()}
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
									selector={solanaInstruction.fields.$program[EntityMetaKey.Selector]}
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
									{#each solanaInstruction.fields.$$accounts.values as account (account[EntityMetaKey.Selector].pubkey)}
										<li>
											<SolanaAccountView
												selector={account[EntityMetaKey.Selector]}
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
