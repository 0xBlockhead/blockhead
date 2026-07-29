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
	}: EntitySelectionViewProps<EntityType.StellarClaimableBalance> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarClaimableBalance}
	entitySelector={selection.entitySelector}
	title={title ?? 'stellar claimable balance'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		stellar claimable balance
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>claimable balance ID</dt>
				<dd>
					{selection.entitySelector.claimableBalanceId}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
