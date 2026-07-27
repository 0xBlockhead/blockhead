<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BittensorBlock> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Bittensor_JsonRpc,
		],
	}))
	const bittensorBlock = $derived(viewSelection({
		fields: {
			extrinsicCount: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.blockNumber ?? '') || 'Bittensor block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BittensorBlockView from '$/views/BittensorBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BittensorBlock}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.hash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bittensorBlock}>
			{#snippet children(entity)}
				{@const extrinsicCount0 = entity.extrinsicCount}
				{#if extrinsicCount0 != null}
					<span data-text="muted">
						<NumberValue
							value={extrinsicCount0}
						/>

						<span> extrinsics</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={pendingEntity.blockNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.hash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(bittensorBlock)}
					{#if bittensorBlock != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<BittensorBlockView
									selection={select(EntityType.BittensorBlock, bittensorBlock[EntityMetaKey.Selector])}
									prefetched={bittensorBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stateRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateRoot = entity.stateRoot}
					{#if stateRoot != null}
						<div>
							<dt>State root</dt>
							<dd>
								<TruncatedValue value={stateRoot} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							extrinsicsRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const extrinsicsRoot = entity.extrinsicsRoot}
					{#if extrinsicsRoot != null}
						<div>
							<dt>Extrinsics root</dt>
							<dd>
								<TruncatedValue value={extrinsicsRoot} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bittensorBlock}
			>
				{#snippet children(entity)}
					{@const extrinsicCount = entity.extrinsicCount}
					{#if extrinsicCount != null}
						<div>
							<dt>Extrinsics</dt>
							<dd>
								<NumberValue
									value={extrinsicCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
