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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashBcmrMetadata>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashBcmrMetadata}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.registryUrl}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		{selection.entitySelector.registryUrl.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { name: true, description: true, symbol: true, decimals: true } }),
				)}
			placeholderText={`Loading Bitcoin Cash Metadata Registry Entry...`}
		>
			{#snippet children(bitcoinCashBcmrMetadata)}
				{#if bitcoinCashBcmrMetadata.description != null}
					<p>
						<TruncatedValue
							value={bitcoinCashBcmrMetadata.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl>
					{#if bitcoinCashBcmrMetadata.name != null}
						<div>
							<dt>Name</dt>
							<dd>{bitcoinCashBcmrMetadata.name}</dd>
						</div>
					{/if}

					{#if bitcoinCashBcmrMetadata.symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>{bitcoinCashBcmrMetadata.symbol}</dd>
						</div>
					{/if}

					{#if bitcoinCashBcmrMetadata.decimals != null}
						<div>
							<dt>Decimals</dt>
							<dd><NumberValue value={bitcoinCashBcmrMetadata.decimals} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
