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
	}: Omit<EntitySelectionViewProps<EntityType.NearBlock>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearBlocks_Rest,
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearBlock = $derived(viewSelection({
		fields: {
			hash: true,
			timestampMs: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearChunksView from '$/views/NearChunksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.NearBlock}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.height)}
	href={
		href === undefined ?
			(
				'hash' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]/(selection)/[hash=stringSegment]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(selection.entitySelector.height),
							hash: selection.entitySelector.hash,
						}
					)
				:
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(blocks)/block/[blockNumber=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							blockNumber: String(selection.entitySelector.height),
						}
					)
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
			value={selection.entitySelector.height}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearBlock}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.hash} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearBlock}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
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
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.height}
					/>
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={nearBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(nearBlock)}
					{#if nearBlock != null}
						{@const nearBlockInitial = untrack(() => nearBlock)}
						<div>
							<dt>Parent</dt>
							<dd>
								<NearBlockView
									selection={select(EntityType.NearBlock, (nearBlock ?? nearBlockInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							epochId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const epochId = entity.epochId}
					{#if epochId != null}
						<div>
							<dt>Epoch ID</dt>
							<dd>
								{epochId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nearBlock}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const chunksResource = selection.$$chunks}
		<ResourceBoundary
			resource={chunksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NearChunksView
						selection={chunksResource}
						countResource={chunksResource.count}
						title='Chunks'
						id='chunks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
