<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BittensorBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
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
	title={title ?? String(selection.entitySelector.blockNumber)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					blockNumber: String(selection.entitySelector.blockNumber),
					hash: selection.entitySelector.hash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.hash} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bittensorBlock}>
			{#snippet children(entity)}
				{@const extrinsicCount = entity.extrinsicCount}
				{#if extrinsicCount != null}
					<span data-text="muted">
						<NumberValue
							value={extrinsicCount}
						/>

						<span> extrinsics</span>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.hash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(bittensorBlock)}
					{#if bittensorBlock != null}
						{@const bittensorBlockInitial = untrack(() => bittensorBlock)}
						<div>
							<dt>Parent</dt>
							<dd>
								<BittensorBlockView
									selection={select(EntityType.BittensorBlock, (bittensorBlock ?? bittensorBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
