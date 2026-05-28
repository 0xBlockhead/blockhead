<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BitcoinCashBcmrMetadata>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bitcoinCashBcmrMetadata = useEntity(
		EntityType.BitcoinCashBcmrMetadata,
		entityId,
		{
			name: {},
			description: {},
			symbol: {},
			decimals: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashBcmrMetadata}
	{entityId}
	title={entityId.registryUrl}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{entityId.registryUrl.toString()}
	{/snippet}

	{#snippet Heading()}
		{entityId.registryUrl.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bitcoinCashBcmrMetadata}
			placeholderText={`Loading Bitcoin Cash Metadata Registry Entry...`}
		>
			{#snippet children(bitcoinCashBcmrMetadata)}
				<dl>
					{#if bitcoinCashBcmrMetadata.name != null}
						<div>
							<dt>Name</dt>
							<dd>{bitcoinCashBcmrMetadata.name}</dd>
						</div>
					{/if}

					{#if bitcoinCashBcmrMetadata.description != null}
						<div>
							<dt>Description</dt>
							<dd>
								<TruncatedValue
									value={bitcoinCashBcmrMetadata.description}
									format={TruncatedValueFormat.Abbr}
								/></dd>
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
