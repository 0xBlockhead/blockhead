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
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/channels'),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(
			layout === EntityLayout.SummaryDetails,
		),
		collapsible = true,
		showParentChannel = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.StateChannelTransfer>
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
			showParentChannel?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

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
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.StateChannelTransfer}
	{entityId}
	href={href}
	{layout}
	bind:open
	{collapsible}
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
				{#snippet children(transfer)}
					{#if transfer.turnNum !== undefined}
						<span>turn {String(transfer.turnNum)}</span>
					{:else}
						{#if Value}
						{@render Value()}
					{/if}
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
				{#snippet children(transfer)}
					{#if showParentChannel && transfer.$channel?.[EntityMetaKey.Id].id !== undefined}
						<div>
							<dt>Channel</dt>
							<dd>
								<a
									href={resolve('/(assets)/(channels)/channel/[channelId]', {
										channelId: transfer.$channel[EntityMetaKey.Id].id,
									})}
								>
									{transfer.$channel[EntityMetaKey.Id].id}
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Amount</dt>
						<dd>
							{#if transfer.amount !== undefined}
								<NumberValue value={transfer.amount} />
							{/if}
						</dd>
					</div>

					{#if transfer.turnNum !== undefined}
						<div>
							<dt>Turn</dt>
							<dd>{String(transfer.turnNum)}</dd>
						</div>
					{/if}

					{#if transfer.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{stateChannelTransferStatusByStatus[transfer.status].label}</dd>
						</div>
					{/if}

					{#if transfer.timestamp !== undefined}
						<div>
							<dt>Recorded at</dt>
							<dd>
								<Timestamp
									timestamp={transfer.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.$from?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
									{#if transfer.$channel?.[EntityMetaKey.Id].id !== undefined && transfer.$channel.$network !== undefined}
										<EvmNetworkAccountView
											entityId={{
												$network: transfer.$channel.$network[EntityMetaKey.Id],
											$actor: transfer.$from[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
											open={false}
									/>
								{:else}
									<EvmAccountView
										entityId={transfer.$from[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: transfer.$from[EntityMetaKey.Id].address,
										})}
										layout={EntityLayout.Title}
										open={false}
									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if transfer.$to?.[EntityMetaKey.Id].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
									{#if transfer.$channel?.[EntityMetaKey.Id].id !== undefined && transfer.$channel.$network !== undefined}
										<EvmNetworkAccountView
											entityId={{
												$network: transfer.$channel.$network[EntityMetaKey.Id],
											$actor: transfer.$to[EntityMetaKey.Id],
										}}
										layout={EntityLayout.Title}
											open={false}
									/>
								{:else}
									<EvmAccountView
										entityId={transfer.$to[EntityMetaKey.Id]}
										href={resolve('/account/[address]', {
											address: transfer.$to[EntityMetaKey.Id].address,
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
</EntityView>
