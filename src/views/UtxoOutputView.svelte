<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.UtxoOutput>
			open?: boolean
		},
		Pick<ComponentProps<typeof EntityView>, 'layout' | 'showTypeAnnotation'>
	> = $props()

	const utxoOutput = $derived(select(
		EntityType.UtxoOutput,
		selector,
	))
	
	
	
	
	
	



	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoOutput}
	entitySelector={selector}
	title={`Output #${selector.outputIndex.toString()}`}
	idDragPlainText={selector.outputIndex.toString()}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selector.outputIndex.toString()}
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
		<dl>
			<ResourceBoundary resource={utxoOutput.valueSats} placeholderText="Loading output value...">
				{#snippet children(valueSats)}
					{#if valueSats != null}
						<div>
							<dt>Value Sats</dt>
							<dd><NumberValue value={valueSats} /> sats</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput.scriptPubKeyAsm} placeholderText="Loading script pub key asm...">
				{#snippet children(scriptPubKeyAsm)}
					{#if scriptPubKeyAsm != null}
						<div>
							<dt>Script Pub Key Asm</dt>
							<dd><TruncatedValue value={scriptPubKeyAsm} format={TruncatedValueFormat.Abbr} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput.scriptPubKeyHex} placeholderText="Loading script pub key hex...">
				{#snippet children(scriptPubKeyHex)}
					{#if scriptPubKeyHex != null}
						<div>
							<dt>Script Pub Key Hex</dt>
							<dd><TruncatedValue value={scriptPubKeyHex} format={TruncatedValueFormat.Abbr} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput.scriptPubKeyType} placeholderText="Loading script pub key type...">
				{#snippet children(scriptPubKeyType)}
					{#if scriptPubKeyType != null}
						<div>
							<dt>Script Pub Key Type</dt>
							<dd><TruncatedValue value={scriptPubKeyType} format={TruncatedValueFormat.Abbr} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput.$address} placeholderText="Loading output address...">
				{#snippet children(address)}
					{#if address}
						<div>
							<dt>Address</dt>
							<dd>
								<UtxoAddressView selector={address.entitySelector} layout={EntityLayout.Title} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={utxoOutput.isSpent} placeholderText="Loading spent status...">
				{#snippet children(isSpent)}
					{#if isSpent != null}
						<div>
							<dt>Is Spent</dt>
							<dd>{isSpent ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
