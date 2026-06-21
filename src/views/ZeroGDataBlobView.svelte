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
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGDataBlob>
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
</script>


<EntityView
	entityType={EntityType.ZeroGDataBlob}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.dataRoot}
	idDragPlainText={selection.entitySelector.dataRoot}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.dataRoot}
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
			resource={selection({
				sources: [Source.ZeroGStorageScan_Rest],
				fields: { sizeBytes: true },
			})}
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
