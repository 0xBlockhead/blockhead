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
			selector: EntitySelector<typeof schema, EntityType.ZeroGDataBlob>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const dataBlob = subscribe(EntityType.ZeroGDataBlob,
		selector,
		({ fields: { sizeBytes: true, erasureCodingScheme: true, aggregatedSignature: true } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataBlob}
	entitySelector={selector}
	title={selector.dataRoot}
	idDragPlainText={selector.dataRoot}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selector.dataRoot}
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
					{#if dataBlob.fields.sizeBytes != null}
						<div>
							<dt>Size</dt>
							<dd>{dataBlob.fields.sizeBytes.toString()} bytes</dd>
						</div>
					{/if}

					{#if dataBlob.fields.erasureCodingScheme != null}
						<div>
							<dt>Encoding</dt>
							<dd>{dataBlob.fields.erasureCodingScheme}</dd>
						</div>
					{/if}

					{#if dataBlob.fields.aggregatedSignature != null}
						<div>
							<dt>DA signature</dt>
							<dd>
								<TruncatedValue
									value={dataBlob.fields.aggregatedSignature}
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
