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
	}: EntitySelectionViewProps<EntityType.BnbValidator> = $props()

	const bnbValidator = $derived(selection({
		fields: {
			moniker: true,
			consensusAddress: true,
		},
	}))
	const titleFallback = $derived((prefetched.moniker ?? '') || selection.entitySelector.operatorAddress || 'bnb validator')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbValidator_TimestampsView from '$/views/BnbValidator_TimestampsView.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbValidator}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bnbValidator}>
			{#snippet children(entity)}
				{(entity.moniker ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbValidator}>
			{#snippet children(entity)}
				{(entity.consensusAddress ?? '') || (entity.moniker ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operator address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.operatorAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={bnbValidator}
			>
				{#snippet children(entity)}
					{@const consensusAddress = entity.consensusAddress}
					{#if consensusAddress != null}
						<div>
							<dt>consensus address</dt>
							<dd>
								<TruncatedValue value={consensusAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={bnbValidator}
			>
				{#snippet children(entity)}
					{@const moniker = entity.moniker}
					{#if moniker != null}
						<div>
							<dt>moniker</dt>
							<dd>
								{moniker}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BnbValidator_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
