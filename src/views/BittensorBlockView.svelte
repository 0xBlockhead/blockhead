<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BittensorBlock>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const block = subscribe(EntityType.BittensorBlock,
		entityId,
		({ sources: [
				Source.Bittensor_JsonRpc,
			], fields: { hash: true, extrinsicCount: true, ...(open && ({ $parent: true, stateRoot: true, extrinsicsRoot: true })) } }),
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorBlock}
	{entityId}
	title={`Block #${entityId.blockNumber.toString()}`}
	idDragPlainText={entityId.blockNumber.toString()}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{entityId.blockNumber.toString()}
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
			resource={block}
			placeholderText="Loading Bittensor block…"
		>
			{#snippet children(block)}
				<dl data-column-item="center">
					{#if entityId.hash != null || block.fields.hash != null}
						<div>
							<dt>Hash</dt>
							<dd>
								<TruncatedValue
									value={entityId.hash ?? block.fields.hash}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if block.fields.extrinsicCount !== undefined}
						<div>
							<dt>Extrinsics</dt>
							<dd><NumberValue value={block.fields.extrinsicCount} /></dd>
						</div>
					{/if}

					{#if open && block.fields.$parent != null}
						<div>
							<dt>Parent</dt>
							<dd>Block #{block.fields.$parent[EntityMetaKey.Id].blockNumber.toString()}</dd>
						</div>
					{/if}

					{#if open && block.fields.stateRoot != null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue
									value={block.fields.stateRoot}
									format={TruncatedValueFormat.Abbr}
								/>
							</dd>
						</div>
					{/if}

					{#if open && block.fields.extrinsicsRoot != null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue
									value={block.fields.extrinsicsRoot}
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
