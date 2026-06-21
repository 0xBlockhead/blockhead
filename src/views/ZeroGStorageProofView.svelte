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
			selection: EntityProxyResource<typeof schema, EntityType.ZeroGStorageProof>
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
	entityType={EntityType.ZeroGStorageProof}
	entitySelector={selection.entitySelector}
	title={selection.entitySelector.proofId}
	idDragPlainText={selection.entitySelector.proofId}
	bind:open
	{...EntityViewProps}
>

	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.proofId}
			format={TruncatedValueFormat.Abbr}
		/>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Storage proof </span>
			{#if Value}
			{@render Value()}
					{/if}
		</span>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ fields: { proofKind: true, verifiedAtBlock: true } }),
				)}
			placeholderText={`Loading 0G storage proof...`}
		>
			{#snippet children(zeroGStorageProof)}
				<dl>
					{#if zeroGStorageProof.proofKind != null}
						<div>
							<dt>Proof Kind</dt>
							<dd>
								<TruncatedValue
									value={zeroGStorageProof.proofKind}
									format={TruncatedValueFormat.Abbr}
								/></dd>
						</div>
					{/if}

					{#if zeroGStorageProof.verifiedAtBlock != null}
						<div>
							<dt>Verified At Block</dt>
							<dd><NumberValue value={zeroGStorageProof.verifiedAtBlock} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
