<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.SuiCoinBalance_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiAccountView from '$/views/SuiAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiCoinBalance_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Sui coin balance timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>account</dt>
				<dd>
					<SuiAccountView
						selection={select(EntityType.SuiAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>coin type</dt>
				<dd>
					{selection.entitySelector.coinType}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalBalance = entity.totalBalance}
					{#if totalBalance != null}
						<div>
							<dt>total balance</dt>
							<dd>
								{totalBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							coinObjectCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coinObjectCount = entity.coinObjectCount}
					{#if coinObjectCount != null}
						<div>
							<dt>coin object count</dt>
							<dd>
								{coinObjectCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
