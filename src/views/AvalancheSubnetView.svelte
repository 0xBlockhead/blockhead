<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AvalancheSubnet> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const avalancheSubnet = $derived(selection({
		fields: {
			label: true,
			threshold: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || (pendingEntity.subnetId ?? '') || 'avalanche subnet')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalancheSubnet_TimestampsView from '$/views/AvalancheSubnet_TimestampsView.svelte'
	import AvalancheBlockchainsView from '$/views/AvalancheBlockchainsView.svelte'
	import AvalancheValidatorsView from '$/views/AvalancheValidatorsView.svelte'
	import AvalancheDelegatorsView from '$/views/AvalancheDelegatorsView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalancheSubnet}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalancheSubnet}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheSubnet}>
			{#snippet children(entity)}
				{@const threshold0 = entity.threshold}
				{#if threshold0 != null}
					<NumberValue
						value={threshold0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subnet ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.subnetId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={avalancheSubnet}
			>
				{#snippet children(entity)}
					{@const threshold = entity.threshold}
					{#if threshold != null}
						<div>
							<dt>threshold</dt>
							<dd>
								<NumberValue
									value={threshold}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const avalancheSubnetAvalancheSubnetTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={avalancheSubnetAvalancheSubnetTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheSubnet_TimestampsView
						selection={avalancheSubnetAvalancheSubnetTimestampsViewTimestampsResource}
						countResource={avalancheSubnetAvalancheSubnetTimestampsViewTimestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const avalancheSubnetAvalancheBlockchainsViewBlockchainsResource = selection.$$blockchains}
		<ResourceBoundary
			resource={avalancheSubnetAvalancheBlockchainsViewBlockchainsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheBlockchainsView
						selection={avalancheSubnetAvalancheBlockchainsViewBlockchainsResource}
						countResource={avalancheSubnetAvalancheBlockchainsViewBlockchainsResource.count}
						title='blockchains'
						id='blockchains'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const avalancheSubnetAvalancheValidatorsViewValidatorsResource = selection.$$validators}
		<ResourceBoundary
			resource={avalancheSubnetAvalancheValidatorsViewValidatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheValidatorsView
						selection={avalancheSubnetAvalancheValidatorsViewValidatorsResource}
						countResource={avalancheSubnetAvalancheValidatorsViewValidatorsResource.count}
						title='validators'
						id='validators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const avalancheSubnetAvalancheDelegatorsViewDelegatorsResource = selection.$$delegators}
		<ResourceBoundary
			resource={avalancheSubnetAvalancheDelegatorsViewDelegatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheDelegatorsView
						selection={avalancheSubnetAvalancheDelegatorsViewDelegatorsResource}
						countResource={avalancheSubnetAvalancheDelegatorsViewDelegatorsResource.count}
						title='delegators'
						id='delegators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
