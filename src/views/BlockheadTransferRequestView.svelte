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
	}: EntitySelectionViewProps<EntityType.BlockheadTransferRequest> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadTransferRequest = $derived(viewSelection({
		fields: {
			status: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.id ?? '') || 'blockhead transfer request')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadTransferRequest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.id} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadTransferRequest}>
			{#snippet children(entity)}
				{entity.status || pendingEntity.id || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadTransferRequest}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.createdAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{pendingEntity.id}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>room</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$room}
					>
						{#snippet children(blockheadRoom)}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector])}
								prefetched={blockheadRoom}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$from}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								prefetched={evmAccount}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$to}
					>
						{#snippet children(evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
								prefetched={evmAccount}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadTransferRequest}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>allocations</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									allocations: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.allocations.map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadTransferRequest}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.createdAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>expires AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									expiresAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.expiresAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
