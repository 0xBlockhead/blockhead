<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.SolanaInstruction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const solanaInstruction = useEntity(
		EntityType.SolanaInstruction,
		entityId,
		{
			programId: {},
			parsedType: {},
			data: {},
			accounts: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
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
					{#if solanaInstruction.programId != null}
						<div>
							<dt>Program ID</dt>
							<dd>
								<TruncatedValue
									value={solanaInstruction.programId}
									format={TruncatedValueFormat.Abbr}
								/></dd>
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
								/></dd>
						</div>
					{/if}

					{#if solanaInstruction.accounts != null}
						<div>
							<dt>Accounts</dt>
							<dd>
								<ul>
									{#each solanaInstruction.accounts as accounts (accounts)}
										<li>{accounts}</li>
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
