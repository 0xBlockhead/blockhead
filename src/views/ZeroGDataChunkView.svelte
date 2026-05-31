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
			entityId: EntityId<typeof schema, EntityType.ZeroGDataChunk>
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

	const zeroGDataChunk = useEntity(
		EntityType.ZeroGDataChunk,
		entityId,
		{
			chunkRoot: {},
			sizeBytes: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataChunk}
	{entityId}
	title={`Data chunk #${entityId.chunkIndex.toString()}`}
	idDragPlainText={entityId.chunkIndex.toString()}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<span data-badge="small">
			#{entityId.chunkIndex.toString()}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Data chunk </span>
			{@render Value()}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={zeroGDataChunk}
			placeholderText={`Loading 0G data chunk...`}
		>
			{#snippet children(zeroGDataChunk)}
				<dl>
					{#if zeroGDataChunk.chunkRoot != null}
						<div>
							<dt>Chunk Root</dt>
							<dd>
								<TruncatedValue
									value={zeroGDataChunk.chunkRoot}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGDataChunk.sizeBytes != null}
						<div>
							<dt>Size Bytes</dt>
							<dd><NumberValue value={zeroGDataChunk.sizeBytes} /> bytes</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
