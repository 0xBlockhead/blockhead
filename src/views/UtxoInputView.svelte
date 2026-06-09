<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.UtxoInput>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoInput = useEntity(entityCollectionsContext, EntityType.UtxoInput,
		entityId,
		({ fields: { coinbaseScript: true, scriptSigAsm: true, sequence: true, witness: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoInput}
	{entityId}
	title={`Input #${entityId.inputIndex.toString()}`}
	idDragPlainText={entityId.inputIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.inputIndex.toString()}
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
		<ResourceBoundary
			resource={utxoInput}
			placeholderText={`Loading UTXO Input...`}
		>
			{#snippet children(utxoInput)}
				<dl>
					{#if utxoInput.fields.coinbaseScript != null}
						<div>
							<dt>Coinbase Script</dt>
							<dd>
								<TruncatedValue
									value={utxoInput.fields.coinbaseScript}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoInput.fields.scriptSigAsm != null}
						<div>
							<dt>Script Sig Asm</dt>
							<dd>
								<TruncatedValue
									value={utxoInput.fields.scriptSigAsm}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoInput.fields.sequence != null}
						<div>
							<dt>Sequence</dt>
							<dd><NumberValue value={utxoInput.fields.sequence} /></dd>
						</div>
					{/if}

					{#if utxoInput.fields.witness.values.length}
						<div>
							<dt>Witness</dt>
							<dd>
								<ul>
									{#each utxoInput.fields.witness.values as witness (witness)}
										<li>
											<TruncatedValue
												value={witness}
												format={TruncatedValueFormat.Abbr}
											/></li>
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
