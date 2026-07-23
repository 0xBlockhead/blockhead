<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.AvalancheSubnet>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AvalancheSubnet>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const avalancheSubnet = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			threshold: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			threshold: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.subnetId) ?? '')].filter(Boolean).join(' ') || 'avalanche subnet')
	const viewDomId = $derived('avalanche-subnet-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'threshold')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={avalancheSubnet}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'threshold')}
			{@const threshold0 = pendingEntity.threshold}
			{#if threshold0 !== undefined && threshold0 !== null}
				<NumberValue
					value={threshold0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={avalancheSubnet}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threshold0 = resolvedEntity.threshold}
					{#if threshold0 !== undefined && threshold0 !== null}
						<NumberValue
							value={threshold0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subnet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									subnetId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subnetId = resolvedEntity.subnetId}
							{#if subnetId !== undefined && subnetId !== null}
								<TruncatedValue value={String((subnetId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							threshold: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threshold = resolvedEntity.threshold}
					{#if threshold !== undefined && threshold !== null}
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
					id='AvalancheSubnet_TimestampsView-timestamps'
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
					id='AvalancheBlockchainsView-blockchains'
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
					id='AvalancheValidatorsView-validators'
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
					id='AvalancheDelegatorsView-delegators'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
