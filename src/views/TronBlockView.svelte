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
			entityId: EntityId<typeof schema, EntityType.TronBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const block = useEntity(
		EntityType.TronBlock,
		entityId,
		{
			hash: {},
			timestampMs: {},
			transactionCount: {},
			...open && {
				parentHash: {},
				witnessAddress: {},
				txTrieRoot: {},
				version: {},
			},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.TronBlock}
	{entityId}
	title={`Block #${entityId.height.toString()}`}
	idDragPlainText={entityId.height.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.height.toString()}
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			TRON blocks are DPoS-produced ledger blocks; TVM execution is modeled separately as the network execution environment.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading TRON block..."
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.parentHash != null}
						<div>
							<dt>Parent hash</dt>
							<dd>
								<TruncatedValue
									value={block.parentHash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.transactionCount != null}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={block.transactionCount} /></dd>
						</div>
					{/if}

					{#if block.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && block.witnessAddress != null}
						<div>
							<dt>Witness</dt>
							<dd>
								<TruncatedValue
									value={block.witnessAddress}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.version != null}
						<div>
							<dt>Version</dt>
							<dd><NumberValue value={block.version} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
