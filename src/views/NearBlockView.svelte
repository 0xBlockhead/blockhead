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
			entityId: EntityId<typeof schema, EntityType.NearBlock>
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
		EntityType.NearBlock,
		entityId,
		{
			$: [
				Source.NearRpc_JsonRpc,
			],
			hash: {},
			timestampMs: {},
			$$chunks: {},
			...open && {
				epochId: {},
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
	entityType={EntityType.NearBlock}
	{entityId}
	title={`Block #${entityId.height.toString()}`}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			NEAR blocks contain shard chunks; transactions and receipts are separate execution objects.
		</p>
	{/snippet}

	{#snippet Title()}
		Block #{entityId.height.toString()}
	{/snippet}

	{#snippet Heading()}
		Block #{entityId.height.toString()}
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={block}
			placeholderText="Loading NEAR block…"
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

					{#if block.$$chunks.length > 0}
						<div>
							<dt>Chunks</dt>
							<dd><NumberValue value={block.$$chunks.length} /></dd>
						</div>
					{/if}

					{#if block.timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd><Timestamp timestamp={block.timestampMs} /></dd>
						</div>
					{/if}

					{#if open && block.epochId != null}
						<div>
							<dt>Epoch ID</dt>
							<dd>
								<TruncatedValue
									value={block.epochId}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
