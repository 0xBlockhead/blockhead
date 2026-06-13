<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.HyperliquidBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const hyperliquidBlock = subscribe(EntityType.HyperliquidBlock,
		entityId,
		({ fields: { hash: true, timestampMs: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


	<EntityView
		entityType={EntityType.HyperliquidBlock}
		{entityId}
		title={'height' in entityId ? `Block #${entityId.height.toString()}` : `Block ${entityId.hash}`}
		idDragPlainText={'height' in entityId ? entityId.height.toString() : entityId.hash}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			{'height' in entityId ? `#${entityId.height.toString()}` : entityId.hash}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={hyperliquidBlock}
			placeholderText="Loading Hyperliquid block…"
		>
			{#snippet children(hyperliquidBlock)}
				<dl>
					{#if hyperliquidBlock.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={hyperliquidBlock.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if hyperliquidBlock.fields.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={hyperliquidBlock.fields.timestampMs} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
