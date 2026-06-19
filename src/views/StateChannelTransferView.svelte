<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import { stateChannelTransferStatusByStatus } from '$/constants/StateChannel.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
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
			selection: EntityProxyResource<typeof schema, EntityType.StateChannelTransfer>
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


	const transfer = $derived(selection(
		({ sources: [Source.Local_Internal], fields: { amount: true, turnNum: true, status: true, timestamp: true, $from: true, $to: true, $channel: ({ fields: { $network: true } }) } }),
	))


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
	entitySelector={selection.entitySelector}
	href={href}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{selection.entitySelector.id}
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
					{#if transfer.fields.turnNum !== undefined}
						<span>turn {String(transfer.fields.turnNum)}</span>
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
					{#if showParentChannel && transfer.fields.$channel?.value[EntityMetaKey.Selector].id !== undefined}
						<div>
							<dt>Channel</dt>
							<dd>
								<a
									href={resolve('/(assets)/(channels)/channel/[channelId]', {
										channelId: transfer.fields.$channel.value[EntityMetaKey.Selector].id,
									})}
								>
									{transfer.fields.$channel.value[EntityMetaKey.Selector].id}
								</a>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Amount</dt>
						<dd>
							{#if transfer.fields.amount !== undefined}
								<NumberValue value={transfer.fields.amount} />
							{/if}
						</dd>
					</div>

					{#if transfer.fields.turnNum !== undefined}
						<div>
							<dt>Turn</dt>
							<dd>{String(transfer.fields.turnNum)}</dd>
						</div>
					{/if}

					{#if transfer.fields.status !== undefined}
						<div>
							<dt>Status</dt>
							<dd>{stateChannelTransferStatusByStatus[transfer.fields.status].label}</dd>
						</div>
					{/if}

					{#if transfer.fields.timestamp !== undefined}
						<div>
							<dt>Recorded at</dt>
							<dd>
								<Timestamp
									timestamp={transfer.fields.timestamp}
								/>
							</dd>
						</div>
					{/if}

					{#if transfer.fields.$from?.[EntityMetaKey.Selector].address !== undefined}
						<div>
							<dt>From</dt>
							<dd>
								{#if transfer.fields.$channel?.entity.fields.$network !== undefined}
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: transfer.fields.$channel.entity.fields.$network[EntityMetaKey.Selector],
											$actor: transfer.fields.$from[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Title}

									/>
								{:else}
									<EvmAccountView
										selection={select(EntityType.EvmAccount, transfer.fields.$from[EntityMetaKey.Selector])}
										href={`/account/${transfer.fields.$from[EntityMetaKey.Selector].address}`}
										layout={EntityLayout.Title}

									/>
								{/if}
							</dd>
						</div>
					{/if}

					{#if transfer.fields.$to?.[EntityMetaKey.Selector].address !== undefined}
						<div>
							<dt>To</dt>
							<dd>
								{#if transfer.fields.$channel?.entity.fields.$network !== undefined}
									<EvmNetworkAccountView
										selection={select(EntityType.EvmNetworkAccount, {
											$network: transfer.fields.$channel.entity.fields.$network[EntityMetaKey.Selector],
											$actor: transfer.fields.$to[EntityMetaKey.Selector],
										})}
										layout={EntityLayout.Title}

									/>
								{:else}
									<EvmAccountView
										selection={select(EntityType.EvmAccount, transfer.fields.$to[EntityMetaKey.Selector])}
										href={`/account/${transfer.fields.$to[EntityMetaKey.Selector].address}`}
										layout={EntityLayout.Title}

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
