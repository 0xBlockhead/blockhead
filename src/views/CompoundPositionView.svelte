<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.CompoundPosition> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Compound_Rest,
		],
	}))
	const compoundPosition = $derived(viewSelection({
		fields: {
			baseTokenSymbol: true,
			suppliedBalance: true,
			borrowedBalance: true,
		},
	}))
	const titleFallback = $derived((prefetched.baseTokenSymbol ?? '') || 'Compound position')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CompoundPositionCollateralsView from '$/views/CompoundPositionCollateralsView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import CompoundCometView from '$/views/CompoundCometView.svelte'
</script>


<EntityView
	entityType={EntityType.CompoundPosition}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={compoundPosition}>
			{#snippet children(entity)}
				<CompoundCometView
					selection={select(EntityType.CompoundComet, selection.entitySelector.$comet)}
					layout={EntityLayout.Title}
				/>
				{entity.baseTokenSymbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={compoundPosition}>
			{#snippet children(entity)}
				{[(entity.suppliedBalance ?? ''), (entity.borrowedBalance ?? '')].filter(Boolean).join(' ') || entity.baseTokenSymbol || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						selection={select(EntityType.EvmNetworkAccount, selection.entitySelector.$account)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Comet</dt>
				<dd>
					<CompoundCometView
						selection={select(EntityType.CompoundComet, selection.entitySelector.$comet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Base token symbol</dt>
				<dd>
					<ResourceBoundary
						resource={compoundPosition}
					>
						{#snippet children(entity)}
							{entity.baseTokenSymbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Base token address</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									baseTokenAddress: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.baseTokenAddress} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={compoundPosition}
			>
				{#snippet children(entity)}
					{@const suppliedBalance = entity.suppliedBalance}
					{#if suppliedBalance != null}
						<div>
							<dt>Supplied balance</dt>
							<dd>
								{suppliedBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={compoundPosition}
			>
				{#snippet children(entity)}
					{@const borrowedBalance = entity.borrowedBalance}
					{#if borrowedBalance != null}
						<div>
							<dt>Borrowed balance</dt>
							<dd>
								{borrowedBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const collateralsResource = selection.$$collaterals}
		<ResourceBoundary
			resource={collateralsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<CompoundPositionCollateralsView
						selection={collateralsResource}
						countResource={collateralsResource.count}
						title='Collateral'
						id='collaterals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
