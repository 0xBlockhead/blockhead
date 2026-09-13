<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetEvent>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Starkscan,
			Source.Voyager,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
	import StarknetContractView from '$/views/StarknetContractView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetEvent}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.eventIndex)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/event/[eventIndex=nonNegativeInteger]',
				{
					network: (
						transaction.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					transactionHash: transaction.transactionHash,
					eventIndex: String(selection.entitySelector.eventIndex),
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
		<NumberValue
			value={selection.entitySelector.eventIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<StarknetTransactionView
			selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$fromContract}
		>
			{#snippet children(starknetContract)}
				{#if starknetContract != null}
					<span data-text="muted">
						<StarknetContractView
							selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StarknetTransactionView
						selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>event index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.eventIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$fromContract}
			>
				{#snippet children(starknetContract)}
					{#if starknetContract != null}
						<div>
							<dt>from contract</dt>
							<dd>
								<StarknetContractView
									selection={select(EntityType.StarknetContract, starknetContract[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>keys</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.keys}
					>
						{#snippet children(keys)}
							{keys.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>data</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.data}
					>
						{#snippet children(data)}
							{data.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
