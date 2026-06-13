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
			entityId: EntityId<typeof schema, EntityType.UtxoOutput>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const utxoOutput = subscribe(EntityType.UtxoOutput, entityId, ({ fields: { valueSats: true, scriptPubKeyAsm: true, scriptPubKeyHex: true, scriptPubKeyType: true, $address: true, isSpent: true } }))


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
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
					{#if utxoOutput.fields.valueSats != null}
						<div>
							<dt>Value Sats</dt>
							<dd><NumberValue value={utxoOutput.fields.valueSats} /> sats</dd>
						</div>
					{/if}

					{#if utxoOutput.fields.scriptPubKeyAsm != null}
						<div>
							<dt>Script Pub Key Asm</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.fields.scriptPubKeyAsm}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if utxoOutput.fields.scriptPubKeyHex != null}
						<div>
							<dt>Script Pub Key Hex</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.fields.scriptPubKeyHex}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if utxoOutput.fields.scriptPubKeyType != null}
						<div>
							<dt>Script Pub Key Type</dt>
							<dd>
								<TruncatedValue
									value={utxoOutput.fields.scriptPubKeyType}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if utxoOutput.fields.$address}
						<div>
							<dt>Address</dt>
							<dd>
								<UtxoAddressView
									entityId={utxoOutput.fields.$address[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if utxoOutput.fields.isSpent != null}
						<div>
							<dt>Is Spent</dt>
							<dd>{utxoOutput.fields.isSpent ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
