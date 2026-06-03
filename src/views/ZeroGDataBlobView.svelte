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
			entityId: EntityId<typeof schema, EntityType.ZeroGDataBlob>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const dataBlob = useEntity(
		EntityType.ZeroGDataBlob,
		entityId,
		{
			sizeBytes: {},
			erasureCodingScheme: {},
			aggregatedSignature: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataBlob}
	{entityId}
	title={entityId.dataRoot}
	idDragPlainText={entityId.dataRoot}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={entityId.dataRoot}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Data blob </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A 0G data blob is a committed payload represented by a data root, with DA and storage metadata attached separately.
		</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={dataBlob}
			placeholderText="Loading 0G data blob…"
		>
			{#snippet children(dataBlob)}
				<dl>
					{#if dataBlob.sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd>{dataBlob.sizeBytes.toString()} bytes</dd>
						</div>
					{/if}

					{#if dataBlob.erasureCodingScheme != null}
						<div>
							<dt>Encoding</dt>
							<dd>{dataBlob.erasureCodingScheme}</dd>
						</div>
					{/if}

					{#if dataBlob.aggregatedSignature != null}
						<div>
							<dt>DA signature</dt>
							<dd>
								<TruncatedValue
									value={dataBlob.aggregatedSignature}
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
