<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.PolkadotBlock> = $props()

	const network = $derived(selection.entitySelector.$network)
	const polkadotBlock = $derived(selection({
		fields: {
			hash: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import PolkadotExtrinsicsView from '$/views/PolkadotExtrinsicsView.svelte'
	import PolkadotEventsView from '$/views/PolkadotEventsView.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotBlock}
	entitySelector={selection.entitySelector}
	title={title ?? `Block #${selection.entitySelector.blockNumber}`}
	idDragPlainText={String(selection.entitySelector.blockNumber)}
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
							blockNumber: String(selection.entitySelector.blockNumber),
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
							blockNumber: String(selection.entitySelector.blockNumber),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Block </span>
			<span data-badge="small">
				#{selection.entitySelector.blockNumber}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.blockNumber}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={polkadotBlock}>
			{#snippet children(entity)}
				<span data-text="muted">
					<TruncatedValue value={entity.hash} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					{selection.entitySelector.blockNumber}
				</dd>
			</div>

			<div>
				<dt>Hash</dt>
				<dd>
					<ResourceBoundary
						resource={polkadotBlock}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.hash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
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
					selection({
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(polkadotBlock)}
					{#if polkadotBlock != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<PolkadotBlockView
									selection={select(EntityType.PolkadotBlock, polkadotBlock[EntityMetaKey.Selector])}
									prefetched={polkadotBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const extrinsicsResource = selection.$$extrinsics}
		<ResourceBoundary
			resource={extrinsicsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotExtrinsicsView
						selection={extrinsicsResource}
						countResource={extrinsicsResource.count}
						title='Extrinsics'
						id='extrinsics'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const eventsResource = selection.$$events}
		<ResourceBoundary
			resource={eventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<PolkadotEventsView
						selection={eventsResource}
						countResource={eventsResource.count}
						title='Events'
						id='events'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
