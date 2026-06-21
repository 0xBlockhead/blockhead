<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorBlock>
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
	entityType={EntityType.BittensorBlock}
	entitySelector={selection.entitySelector}
	title={`Block #${selection.entitySelector.blockNumber.toString()}`}
	idDragPlainText={selection.entitySelector.blockNumber.toString()}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.blockNumber.toString()}
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
		<p>Bittensor blocks are Subtensor runtime blocks containing extrinsics and consensus digests.</p>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={selection(
					({ sources: [
							Source.Bittensor_JsonRpc,
						], fields: { hash: true, extrinsicCount: true, ...(open && ({ $parent: true, stateRoot: true, extrinsicsRoot: true })) } }),
				)}
			placeholderText="Loading Bittensor block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if selection.entitySelector.hash != null || block.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={selection.entitySelector.hash ?? block.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.extrinsicCount !== undefined}
						<div>
							<dt>Extrinsics</dt>
							<dd><NumberValue value={block.extrinsicCount} /></dd>
						</div>
					{/if}

					{#if open && block.$parent != null}
						<div>
							<dt>Parent</dt>
							<dd>Block #{block.$parent[EntityMetaKey.Selector].blockNumber.toString()}</dd>
						</div>
					{/if}

					{#if open && block.stateRoot != null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue
									value={block.stateRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.extrinsicsRoot != null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue
									value={block.extrinsicsRoot}
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
