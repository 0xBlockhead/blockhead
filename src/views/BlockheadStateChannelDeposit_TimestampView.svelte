<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.BlockheadStateChannelDeposit_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadStateChannelDepositTimestamp = $derived(viewSelection({
		fields: {
			availableBalance: true,
			lockedBalance: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead state channel deposit timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadStateChannelDepositView from '$/views/BlockheadStateChannelDepositView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadStateChannelDeposit_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.source ?? '') || String(pendingEntity.timestampMs ?? '') || titleFallback}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>deposit</dt>
				<dd>
					<BlockheadStateChannelDepositView
						selection={select(EntityType.BlockheadStateChannelDeposit, selection.entitySelector.$deposit)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
