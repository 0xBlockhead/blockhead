<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadStateChannelDeposit_Timestamp>, 'prefetched'> = $props()

	const deposit = $derived(selection.entitySelector.$deposit)
	const blockheadStateChannelDepositTimestamp = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
		fields: {
			availableBalance: true,
			lockedBalance: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/channel/[channelId=stringSegment]/(blockheadStateChannel)/deposit/[accountAddress=evmAddress]/(blockheadStateChannelDeposit)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					channelId: deposit.$channel.id,
					accountAddress: deposit.$account.address,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.source || String(selection.entitySelector.timestampMs)}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadStateChannelDepositTimestamp}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.availableBalance}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>deposit</dt>
				<dd>
					<BlockheadStateChannelDepositView
						selection={select(EntityType.BlockheadStateChannelDeposit, selection.entitySelector.$deposit)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>available balance</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelDepositTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.availableBalance}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>locked balance</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadStateChannelDepositTimestamp}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.lockedBalance}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
