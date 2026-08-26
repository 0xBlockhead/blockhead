<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.SuiBalanceChange>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
	import SuiCoinTypeView from '$/views/SuiCoinTypeView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiBalanceChange}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui balance change'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/balance-change/[changeIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network.$network ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					digest: transaction.digest,
					changeIndex: String(selection.entitySelector.changeIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>change index</dt>
				<dd>
					{selection.entitySelector.changeIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinType = entity.coinType}
					{#if coinType != null}
						<div>
							<dt>coin type</dt>
							<dd>
								{coinType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$coinType}
			>
				{#snippet children(suiCoinType)}
					{#if suiCoinType != null}
						{@const suiCoinTypeInitial = untrack(() => suiCoinType)}
						<div>
							<dt>coin type</dt>
							<dd>
								<SuiCoinTypeView
									selection={select(EntityType.SuiCoinType, (suiCoinType ?? suiCoinTypeInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>amount delta</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									amountDelta: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.amountDelta}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
