<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.UtxoTransaction>
			selection?: EntityProxyResource<typeof schema, EntityType.UtxoTransaction>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const transaction = $derived(selection ?? select(
		EntityType.UtxoTransaction,
		selector,
		{
			sources: [
				Source.Esplora_Rest,
				Source.Blockchair_Rest,
				Source.ThreeXpl_Rest,
				Source.BitcoinCore_JsonRpc,
				Source.LitecoinCore_JsonRpc,
				Source.DogecoinCore_JsonRpc,
				Source.Zcashd_JsonRpc,
			],
		},
	))
	
	
	
	
	
	
	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoTransaction}
	entitySelector={selector}
	href={
		'networkSlug' in selector.$network ?
			`/network/${selector.$network.networkSlug}/transactions/${selector.txId}`
		:
			`/network/${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}/transactions/${selector.txId}`
	}
	title={selector.txId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		<TruncatedValue
			value={selector.txId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A UTXO transaction spends previous outputs and creates new outputs; token or shielded extensions remain chain-specific annotations.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl>
			<ResourceBoundary
				resource={transaction.version}
				placeholderText="Loading transaction version…"
			>
				{#snippet children(version)}
					{#if version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={version} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.feeSats}
				placeholderText="Loading fee…"
			>
				{#snippet children(feeSats)}
					{#if feeSats != null}
						<div>
							<dt>Fee</dt>
							<dd>{feeSats.toString()} sats</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.sizeBytes}
				placeholderText="Loading transaction size…"
			>
				{#snippet children(sizeBytes)}
					{#if sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd><NumberValue value={sizeBytes} /> bytes</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.virtualSizeBytes}
				placeholderText="Loading virtual size…"
			>
				{#snippet children(virtualSizeBytes)}
					{#if virtualSizeBytes != null}
						<div>
							<dt>Virtual size</dt>
							<dd><NumberValue value={virtualSizeBytes} /> vB</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.weightUnits}
				placeholderText="Loading weight…"
			>
				{#snippet children(weightUnits)}
					{#if weightUnits != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={weightUnits} /> WU</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.lockTime}
				placeholderText="Loading lock time…"
			>
				{#snippet children(lockTime)}
					{#if lockTime != null}
						<div>
							<dt>Lock time</dt>
							<dd><NumberValue value={lockTime} /></dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={transaction.isCoinbase}
				placeholderText="Loading coinbase status…"
			>
				{#snippet children(isCoinbase)}
					{#if isCoinbase != null}
						<div>
							<dt>Coinbase</dt>
							<dd>{isCoinbase ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
