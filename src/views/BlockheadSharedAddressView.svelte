<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadSharedAddress>, 'prefetched'> = $props()

	const blockheadSharedAddress = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			peerId: true,
			sharedAt: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSharedAddress}
	entitySelector={selection.entitySelector}
	title={title ?? 'blockhead shared address'}
	href={
		href === undefined ?
			resolve(
				'/~/shared-address/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
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
		<ResourceBoundary
			resource={selection.$account}
		>
			{#snippet children(evmAccount)}
				{@const evmAccountInitial = untrack(() => evmAccount)}
				<EvmAccountView
					selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
					href={null}
					layout={EntityLayout.Title}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSharedAddress}>
			{#snippet children(entity)}
				<Timestamp timestamp={entity.sharedAt} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							{@const networkInitial = untrack(() => network)}
							<NetworkView
								selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
								prefetched={network ?? networkInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>room</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$room}
					>
						{#snippet children(blockheadRoom)}
							{@const blockheadRoomInitial = untrack(() => blockheadRoom)}
							<BlockheadRoomView
								selection={select(EntityType.BlockheadRoom, (blockheadRoom ?? blockheadRoomInitial)[EntityMetaKey.Selector])}
								prefetched={blockheadRoom ?? blockheadRoomInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSharedAddress}
					>
						{#snippet children(entity)}
							{entity.peerId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>account</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$account}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>shared AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadSharedAddress}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.sharedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
