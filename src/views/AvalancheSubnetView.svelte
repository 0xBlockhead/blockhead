<!-- Generated from APP.ts. -->

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

	const avalancheSubnet = $derived(selection({
		fields: {
			label: true,
			threshold: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.subnetId || 'avalanche subnet')


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
				{@const threshold = entity.threshold}
				{#if threshold != null}
					<NumberValue
						value={threshold}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subnet ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.subnetId} />
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheSubnet_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockchainsResource = selection.$$blockchains}
		<ResourceBoundary
			resource={blockchainsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheBlockchainsView
						selection={blockchainsResource}
						countResource={blockchainsResource.count}
						title='blockchains'
						id='blockchains'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const validatorsResource = selection.$$validators}
		<ResourceBoundary
			resource={validatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheValidatorsView
						selection={validatorsResource}
						countResource={validatorsResource.count}
						title='validators'
						id='validators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const delegatorsResource = selection.$$delegators}
		<ResourceBoundary
			resource={delegatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalancheDelegatorsView
						selection={delegatorsResource}
						countResource={delegatorsResource.count}
						title='delegators'
						id='delegators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
