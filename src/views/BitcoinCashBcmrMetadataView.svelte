<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BitcoinCashBcmrMetadata>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const bitcoinCashBcmrMetadata = subscribe(EntityType.BitcoinCashBcmrMetadata,
		selector,
		({ fields: { name: true, description: true, symbol: true, decimals: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashBcmrMetadata}
	entitySelector={selector}
	title={selector.registryUrl}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selector.registryUrl.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bitcoinCashBcmrMetadata}
			placeholderText={`Loading Bitcoin Cash Metadata Registry Entry...`}
		>
			{#snippet children(bitcoinCashBcmrMetadata)}
				{#if bitcoinCashBcmrMetadata.fields.description != null}
					<p>
						<TruncatedValue
							value={bitcoinCashBcmrMetadata.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl>
					{#if bitcoinCashBcmrMetadata.fields.name != null}
						<div>
							<dt>Name</dt>
							<dd>{bitcoinCashBcmrMetadata.fields.name}</dd>
						</div>
					{/if}

					{#if bitcoinCashBcmrMetadata.fields.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{bitcoinCashBcmrMetadata.fields.symbol}</dd>
						</div>
					{/if}

					{#if bitcoinCashBcmrMetadata.fields.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={bitcoinCashBcmrMetadata.fields.decimals} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
