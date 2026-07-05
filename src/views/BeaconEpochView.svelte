<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BeaconEpoch>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BeaconEpoch>>
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
		sources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
	}))
	const titleFallback = $derived((String((selection.entitySelector.epoch ?? prefetched.epoch) ?? '') ? 'Epoch #' + String((selection.entitySelector.epoch ?? prefetched.epoch) ?? '') : '') || 'beacon epoch')
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
	idDragPlainText={String(selection.entitySelector.epoch ?? prefetched.epoch ?? '')}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.namespace !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined && pendingEntity.epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
			caip2: `${String(pendingEntity.$network.caip2.namespace ?? '')}:${String(pendingEntity.$network.caip2.reference ?? '')}`,
			epoch: String(pendingEntity.epoch ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = selection.entitySelector.epoch ?? prefetched.epoch}
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
		{@const serialValue = selection.entitySelector.epoch ?? prefetched.epoch}
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
									fields: {
										slotCount: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const slotCount = prefetched.slotCount}
								{#if slotCount !== undefined && slotCount !== null}
									<NumberValue value={Number(slotCount)} />
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const slotCount = resolvedEntity.slotCount}
								{#if slotCount !== undefined && slotCount !== null}
									<NumberValue value={Number(slotCount)} />
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
							fields: {
								finalized: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const finalized = prefetched.finalized}
						{#if finalized !== undefined && finalized !== null}
							<div>
								<dt>Finalized</dt>
								<dd>
									{finalized ? 'Yes' : 'No'}
								</dd>
							</div>
						{/if}
					{/snippet}

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
							fields: {
								globalParticipationRate: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const globalParticipationRate = prefetched.globalParticipationRate}
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
							fields: {
								validatorsCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const validatorsCount = prefetched.validatorsCount}
						{#if validatorsCount !== undefined && validatorsCount !== null}
							<div>
								<dt>Validators</dt>
								<dd>
									<NumberValue value={Number(validatorsCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const validatorsCount = resolvedEntity.validatorsCount}
						{#if validatorsCount !== undefined && validatorsCount !== null}
							<div>
								<dt>Validators</dt>
								<dd>
									<NumberValue value={Number(validatorsCount)} />
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
								attestationsCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const attestationsCount = prefetched.attestationsCount}
						{#if attestationsCount !== undefined && attestationsCount !== null}
							<div>
								<dt>Attestations</dt>
								<dd>
									<NumberValue value={Number(attestationsCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const attestationsCount = resolvedEntity.attestationsCount}
						{#if attestationsCount !== undefined && attestationsCount !== null}
							<div>
								<dt>Attestations</dt>
								<dd>
									<NumberValue value={Number(attestationsCount)} />
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
								withdrawalsCount: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const withdrawalsCount = prefetched.withdrawalsCount}
						{#if withdrawalsCount !== undefined && withdrawalsCount !== null}
							<div>
								<dt>Withdrawals</dt>
								<dd>
									<NumberValue value={Number(withdrawalsCount)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const withdrawalsCount = resolvedEntity.withdrawalsCount}
						{#if withdrawalsCount !== undefined && withdrawalsCount !== null}
							<div>
								<dt>Withdrawals</dt>
								<dd>
									<NumberValue value={Number(withdrawalsCount)} />
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
						selection[EntityProxyField]<EntityType.BeaconSlot>('$$beaconSlots', {
							sources: [
								Source.Beacon_Rest,
							],
							limit: 32,
						})
					}
				title='Slots'
				id='BeaconSlotsView-$$beaconSlots'
			/>
		{/if}
	{/snippet}
</EntityView>
