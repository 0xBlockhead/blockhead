<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.UtxoInput>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	const utxoInput = $derived(selection())


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoInput}
	entitySelector={selection.entitySelector}
	title={`Input #${selection.entitySelector.inputIndex.toString()}`}
	idDragPlainText={selection.entitySelector.inputIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.inputIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Input </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl>
			<ResourceBoundary
				resource={utxoInput.coinbaseScript}
				placeholderText="Loading coinbase script..."
			>
				{#snippet children(coinbaseScript)}
					{#if coinbaseScript != null}
						<div>
							<dt>Coinbase Script</dt>
							<dd>
								<TruncatedValue
									value={coinbaseScript}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoInput.scriptSigAsm}
				placeholderText="Loading script sig asm..."
			>
				{#snippet children(scriptSigAsm)}
					{#if scriptSigAsm != null}
						<div>
							<dt>Script Sig Asm</dt>
							<dd>
								<TruncatedValue
									value={scriptSigAsm}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoInput.sequence}
				placeholderText="Loading sequence..."
			>
				{#snippet children(sequence)}
					{#if sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd><NumberValue value={sequence} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={utxoInput.witness}
				placeholderText="Loading witness..."
			>
				{#snippet children(witness)}
					{#if witness.values.length}
						<div>
							<dt>Witness</dt>
							<dd>
								<ul>
									{#each witness.values as witnessValue (witnessValue)}
										<li>
											<TruncatedValue
												value={witnessValue}
												format={TruncatedValueFormat.Abbr}
											/>
										</li>
									{/each}
								</ul>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
