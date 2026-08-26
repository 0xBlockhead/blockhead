<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadStateChannelTransfer>, 'prefetched'> = $props()

	const blockheadStateChannelTransfer = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			timestamp: true,
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelView from '$/views/BlockheadStateChannelView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelTransfer}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.amount)}
	href={
		href === undefined ?
			resolve(
				'/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/transfer/[turnNum=nonNegativeInteger]/[fromAddress=evmAddress]/[toAddress=evmAddress]/[amount=nonNegativeBigInt]',
				{
					channelId: selection.entitySelector.$channel.id,
					turnNum: String(selection.entitySelector.turnNum),
					fromAddress: selection.entitySelector.$from.address,
					toAddress: selection.entitySelector.$to.address,
					amount: String(selection.entitySelector.amount),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={blockheadStateChannelTransfer}>
			{#snippet children(entity)}
				{entity.status || String(selection.entitySelector.amount)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadStateChannelTransfer}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.timestamp} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>channel</dt>
				<dd>
					<BlockheadStateChannelView
						selection={select(EntityType.BlockheadStateChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>turn num</dt>
				<dd>
					{selection.entitySelector.turnNum}
				</dd>
			</div>

			<div>
				<dt>from</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$from)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>to</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$to)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>amount</dt>
				<dd>
					{selection.entitySelector.amount}
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTransfer}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelTransfer}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.timestamp} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
