<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AvalancheSubnet>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalancheSubnet>>
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
	const avalancheSubnet = $derived(selection({
		fields: {
			label: true,
			threshold: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.subnetId) ?? '')].filter(Boolean).join(' ') || 'avalanche subnet')
	const viewDomId = $derived('avalanche-subnet-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={avalancheSubnet}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.subnetId) ?? '')].filter(Boolean).join(' ') || 'avalanche subnet'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalancheSubnet}>
			{#snippet Pending()}
				{@const threshold0 = pendingEntity.threshold}
				{#if threshold0 !== undefined && threshold0 !== null}
					<NumberValue value={Number(threshold0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const threshold0 = resolvedEntity.threshold}
				{#if threshold0 !== undefined && threshold0 !== null}
					<NumberValue value={Number(threshold0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subnet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subnetId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subnetId = pendingEntity.subnetId}
							{#if subnetId !== undefined && subnetId !== null}
								<TruncatedValue value={String((subnetId) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							threshold: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const threshold = pendingEntity.threshold}
					{#if threshold !== undefined && threshold !== null}
						<div>
							<dt>threshold</dt>
							<dd>
								<NumberValue value={Number(threshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const threshold = resolvedEntity.threshold}
					{#if threshold !== undefined && threshold !== null}
						<div>
							<dt>threshold</dt>
							<dd>
								<NumberValue value={Number(threshold)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvalancheSubnet_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No observations yet.'
				id='AvalancheSubnet_TimestampsView-timestamps'
			/>

			<AvalancheBlockchainsView
				selection={
						selection.$$blockchains({
							count: true,
						})
					}
				title='blockchains'
				emptyText='No blockchains found.'
				id='AvalancheBlockchainsView-blockchains'
			/>

			<AvalancheValidatorsView
				selection={
						selection.$$validators({
							count: true,
						})
					}
				title='validators'
				emptyText='No validators found.'
				id='AvalancheValidatorsView-validators'
			/>

			<AvalancheDelegatorsView
				selection={
						selection.$$delegators({
							count: true,
						})
					}
				title='delegators'
				emptyText='No delegators found.'
				id='AvalancheDelegatorsView-delegators'
			/>
		{/if}
	{/snippet}
</EntityView>
