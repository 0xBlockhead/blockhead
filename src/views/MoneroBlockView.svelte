<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.MoneroBlock>
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

	const block = useEntity(
		EntityType.MoneroBlock,
		entityId,
		{
			$: [
				Source.MoneroDaemonRpc_JsonRpc,
			],
			hash: {},
			timestampMs: {},
			$$transactions: {},
			...open && {
				difficulty: {},
				weightBytes: {},
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
	entityType={EntityType.MoneroBlock}
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
			{@render Value()}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Monero blocks reveal public transaction structure, but not transparent sender, recipient, or account balances.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading Monero block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if entityId.hash != null || block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={entityId.hash ?? block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.$$transactions.length > 0}
						<div>
							<dt>Transactions</dt>
							<dd><NumberValue value={block.$$transactions.length} /></dd>
						</div>
					{/if}

					{#if block.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && block.weightBytes != null}
						<div>
							<dt>Weight</dt>
							<dd><NumberValue value={block.weightBytes} /> bytes</dd>
						</div>
					{/if}

					{#if open && block.difficulty != null}
						<div>
							<dt>Difficulty</dt>
							<dd><NumberValue value={block.difficulty} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
