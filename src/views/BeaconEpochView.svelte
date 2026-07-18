<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BeaconEpoch>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BeaconEpoch>>
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
	const beaconEpoch = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived((String((pendingEntity.epoch) ?? '') ? 'Epoch #' + String((pendingEntity.epoch) ?? '') : '') || 'beacon epoch')
	const viewDomId = $derived('beacon-epoch-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.epoch ?? '')}
	href={
		href ?? (pendingEntity.epoch !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
			epoch: String(pendingEntity.epoch ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$network.caip2) ?? ''),
		}) : pendingEntity.epoch !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
			epoch: String(pendingEntity.epoch ?? ''),
			network: String(pendingEntity.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = pendingEntity.epoch}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-row="inline align-center gap-2 wrap">
				<span>Epoch </span>
				<span data-badge="small">
					#{String((serialValue) ?? '')}
				</span>
			</span>
		{/if}
	{/snippet}

	{#snippet Value()}
		{@const serialValue = pendingEntity.epoch}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							startSlot: true,
							endSlot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					<div>
						<dt>Slot range</dt>
						<dd>
							<NumberValue value={entity.startSlot} />
							to
							<NumberValue value={entity.endSlot} />
						</dd>
					</div>
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<div>
					<dt>Slot count</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									sources: selection.sources,
									fields: {
										slotCount: true,
									},
								})
							}
						>
							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const slotCount = resolvedEntity.slotCount}
								{#if slotCount !== undefined && slotCount !== null}
									<NumberValue
										value={slotCount}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								finalized: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const finalized = resolvedEntity.finalized}
						{#if finalized !== undefined && finalized !== null}
							<div>
								<dt>Finalized</dt>
								<dd>
									{finalized ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								globalParticipationRate: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const globalParticipationRate = resolvedEntity.globalParticipationRate}
						{#if globalParticipationRate !== undefined && globalParticipationRate !== null}
							<div>
								<dt>Participation</dt>
								<dd>
									<NumberValue
										value={Number(globalParticipationRate)}
										options={{ style: 'percent' }}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								validatorsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const validatorsCount = resolvedEntity.validatorsCount}
						{#if validatorsCount !== undefined && validatorsCount !== null}
							<div>
								<dt>Validators</dt>
								<dd>
									<NumberValue
										value={validatorsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								attestationsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const attestationsCount = resolvedEntity.attestationsCount}
						{#if attestationsCount !== undefined && attestationsCount !== null}
							<div>
								<dt>Attestations</dt>
								<dd>
									<NumberValue
										value={attestationsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								withdrawalsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const withdrawalsCount = resolvedEntity.withdrawalsCount}
						{#if withdrawalsCount !== undefined && withdrawalsCount !== null}
							<div>
								<dt>Withdrawals</dt>
								<dd>
									<NumberValue
										value={withdrawalsCount}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							fields: {
								attesterSlashingsCount: true,
								proposerSlashingsCount: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{#if entity.attesterSlashingsCount !== undefined || entity.proposerSlashingsCount !== undefined}
							<div>
								<dt>Slashings</dt>
								<dd>
									{#if entity.attesterSlashingsCount !== undefined}
										<NumberValue value={entity.attesterSlashingsCount} /> attester
									{/if}

									{#if entity.proposerSlashingsCount !== undefined}
										<NumberValue value={entity.proposerSlashingsCount} /> proposer
									{/if}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BeaconSlotsView
				selection={
						selection.$$beaconSlots({
							sources: [
								Source.Beacon_Rest,
							],
							limit: 32,
							count: true,
						})
					}
				title='Slots'
				id='BeaconSlotsView-beacon-slots'
			/>
		{/if}
	{/snippet}
</EntityView>
