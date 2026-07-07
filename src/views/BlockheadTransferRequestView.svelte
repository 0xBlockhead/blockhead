<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadTransferRequest>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadTransferRequest>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadTransferRequest = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			status: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'blockhead transfer request')
	const viewDomId = $derived('blockhead-transfer-request-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import BlockheadRoomView from '$/views/BlockheadRoomView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadTransferRequest}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadTransferRequest}>
			{#snippet Pending()}
				{@const id0 = selection.entitySelector.id ?? prefetched.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const id0 = resolvedEntity.id}
				{#if id0 !== undefined && id0 !== null}
					<TruncatedValue value={String((id0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadTransferRequest}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || title || 'blockhead transfer request'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.id) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadTransferRequest}>
			{#snippet Pending()}
				{@const createdAt0 = prefetched.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const createdAt0 = resolvedEntity.createdAt}
				{#if createdAt0 !== undefined && createdAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(createdAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>room</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BlockheadRoom, false>('$room')}
					>
						{#snippet children(blockheadRoom)}
							{#if blockheadRoom[EntityMetaKey.Selector] != null}
								<BlockheadRoomView
									selection={select(EntityType.BlockheadRoom, blockheadRoom[EntityMetaKey.Selector])}
									prefetched={blockheadRoom}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>from</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$from')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.EvmAccount, false>('$to')}
					>
						{#snippet children(evmAccount)}
							{#if evmAccount[EntityMetaKey.Selector] != null}
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									href={
										(evmAccount[EntityMetaKey.Selector].address !== undefined ? resolve('/(explore)/account/[address=evmAddress]', {
											address: String(evmAccount[EntityMetaKey.Selector].address ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>allocations</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									allocations: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const allocations = prefetched.allocations}
							{#if allocations !== undefined && allocations !== null}
								{allocations == null ? '' : String(((allocations).map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const allocations = resolvedEntity.allocations}
							{#if allocations !== undefined && allocations !== null}
								{allocations == null ? '' : String(((allocations).map((allocation) => `${allocation.destination}:${allocation.token}:${allocation.amount}`).join(', ')) ?? '')}
							{/if}
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
						resource={
							selection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const createdAt = prefetched.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const createdAt = resolvedEntity.createdAt}
							{#if createdAt !== undefined && createdAt !== null}
								<Timestamp timestamp={Number(createdAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>expires AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									expiresAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const expiresAt = prefetched.expiresAt}
							{#if expiresAt !== undefined && expiresAt !== null}
								<Timestamp timestamp={Number(expiresAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const expiresAt = resolvedEntity.expiresAt}
							{#if expiresAt !== undefined && expiresAt !== null}
								<Timestamp timestamp={Number(expiresAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
