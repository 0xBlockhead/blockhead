<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { stateChannelTransferStatusByStatus } from '$/constants/StateChannel.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		showParentChannel = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannelTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			showParentChannel?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const transfer = useEntity(
		EntityType.StateChannelTransfer,
		entityId,
		{
			$: [Source.Local_Internal],
			amount: {},
			turnNum: {},
			status: {},
			timestamp: {},
			$from: {},
			$to: {},
			$channel: {
				$network: {},
			},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannelTransfer}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Transfer </span>
			<ResourceBoundary
				resource={transfer}
				placeholderText="…"
			>
				{#snippet children(loadedTransfer)}
					{#if loadedTransfer.turnNum !== undefined}
						<span>turn {String(transfer.turnNum)}</span>
					{:else}
						{@render Value()}
					{/if}
				{/snippet}
			</ResourceBoundary>
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Directed balance movement between channel participants on a specific turn.
		</p>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={transfer}
				placeholderText="Loading channel transfer…"
			>
				{#snippet children(loadedTransfer)}
					{#if showParentChannel && loadedTransfer.$channel?.[EntityMetaKey.Id].id !== undefined}
						<div>
							<dt>Channel</dt>
							<dd>
								<a
									href={resolve('/(assets)/(channels)/channel/[channelId]', {
										channelId: loadedTransfer.$channel[EntityMetaKey.Id].id,
									})}
								>
									{loadedTransfer.$channel[EntityMetaKey.Id].id}
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Amount</dt>
						<dd>
							{#if loadedTransfer.amount !== undefined}
								<NumberValue value={loadedTransfer.amount} />
							{/if}
						</dd>
					</div>

					{#if loadedTransfer.turnNum !== undefined}
						<div>
							<dt>Turn</dt>
							<dd>{String(transfer.turnNum)}</dd>
						</div>
					{/if}

					{#if loadedTransfer.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{stateChannelTransferStatusByStatus[loadedTransfer.status].label}</dd>
						</div>
					{/if}

					{#if loadedTransfer.timestamp !== undefined}
						<div>
							<dt>Recorded at</dt>
							<dd>
								<Timestamp
									timestamp={loadedTransfer.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedTransfer.$from?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								{#if loadedTransfer.$channel?.[EntityMetaKey.Id].id !== undefined && loadedTransfer.$channel.$network?.[EntityMetaKey.Id].chainId !== undefined}
									<ActorNetworkView
										entityId={{
											$network: loadedTransfer.$channel.$network[EntityMetaKey.Id],
											$actor: loadedTransfer.$from[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
										open={false}
									/>
								{:else}
									<ActorView
										entityId={loadedTransfer.$from[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: loadedTransfer.$from[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if loadedTransfer.$to?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								{#if loadedTransfer.$channel?.[EntityMetaKey.Id].id !== undefined && transfer.$channel.$network?.[EntityMetaKey.Id].chainId !== undefined}
									<ActorNetworkView
										entityId={{
											$network: loadedTransfer.$channel.$network[EntityMetaKey.Id],
											$actor: loadedTransfer.$to[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
										open={false}
									/>
								{:else}
									<ActorView
										entityId={loadedTransfer.$to[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: loadedTransfer.$to[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: _detailsOpen })}
		<EntityDetails
			entityType={EntityType.StateChannelTransfer}
			{entityId}
		/>
	{/snippet}
</EntityView>

