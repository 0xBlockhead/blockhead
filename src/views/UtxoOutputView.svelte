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
			entityId: EntityId<typeof schema, EntityType.UtxoOutput>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const utxoOutput = useEntity(
		EntityType.UtxoOutput,
		entityId,
		{
			valueSats: {},
			scriptPubKeyAsm: {},
			scriptPubKeyHex: {},
			scriptPubKeyType: {},
			address: {},
			isSpent: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoOutput}
	{entityId}
	title={`Output #${entityId.outputIndex.toString()}`}
	idDragPlainText={entityId.outputIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.outputIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Output </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={utxoOutput}
			placeholderText={`Loading UTXO Output...`}
		>
			{#snippet children(utxoOutput)}
				<dl>
					{#if utxoOutput.valueSats != null}
						<div>
							<dt>Value Sats</dt>
							<dd><NumberValue value={utxoOutput.valueSats} /> sats</dd>
						</div>
					{/if}

					{#if utxoOutput.scriptPubKeyAsm != null}
						<div>
							<dt>Script Pub Key Asm</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.scriptPubKeyAsm}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoOutput.scriptPubKeyHex != null}
						<div>
							<dt>Script Pub Key Hex</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.scriptPubKeyHex}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoOutput.scriptPubKeyType != null}
						<div>
							<dt>Script Pub Key Type</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.scriptPubKeyType}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoOutput.address != null}
						<div>
							<dt>Address</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.address}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if utxoOutput.isSpent != null}
						<div>
							<dt>Is Spent</dt>
							<dd>{utxoOutput.isSpent ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
