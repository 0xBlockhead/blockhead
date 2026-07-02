<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const beaconEpoch = $derived(selection({
		sources: [
			Source.Beacon_Rest,
			Source.BeaconchaIn_Rest,
		],
		fields: {
			slotCount: true,
			finalized: true,
			globalParticipationRate: true,
			validatorsCount: true,
			attestationsCount: true,
			withdrawalsCount: true,
		},
	}))
	const titleFallback = $derived((String((({ ...selection.entitySelector, ...prefetched }).epoch) ?? '') ? 'Epoch #' + String((({ ...selection.entitySelector, ...prefetched }).epoch) ?? '') : '') || 'beacon epoch')
	const viewDomId = $derived('beacon-epoch-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	idDragPlainText={String(({ ...selection.entitySelector, ...prefetched }).epoch ?? '')}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			epoch: String(({ ...selection.entitySelector, ...prefetched }).epoch),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).epoch}
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
		{@const serialValue = ({ ...selection.entitySelector, ...prefetched }).epoch}
		{#if serialValue !== undefined && serialValue !== null}
			<span data-badge="small">
				#{String((serialValue) ?? '')}
			</span>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Slot range</dt>
				<dd>
					<ResourceBoundary resource={beaconEpoch}>
						{#snippet children(entity)}
							<NumberValue value={entity.startSlot} />
							to
							<NumberValue value={entity.endSlot} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Slot count</dt>
					<dd>
						<ResourceBoundary resource={beaconEpoch}>
							{#snippet Pending()}
								{@const slotCount = prefetched.slotCount ?? selection.entitySelector.slotCount}
								{#if slotCount !== undefined && slotCount !== null}
									<NumberValue value={Number(slotCount)} />
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const slotCount = entity.slotCount ?? selection.entitySelector.slotCount ?? prefetched.slotCount}
								{#if slotCount !== undefined && slotCount !== null}
									<NumberValue value={Number(slotCount)} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={beaconEpoch}>
					{#snippet Pending()}
						{@const finalized = prefetched.finalized ?? selection.entitySelector.finalized}
						{#if finalized !== undefined && finalized !== null}
							<div>
								<dt>Finalized</dt>
								<dd>
									{String((finalized) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const finalized = entity.finalized ?? selection.entitySelector.finalized ?? prefetched.finalized}
						{#if finalized !== undefined && finalized !== null}
							<div>
								<dt>Finalized</dt>
								<dd>
									{String((finalized) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={beaconEpoch}>
					{#snippet Pending()}
						{@const globalParticipationRate = prefetched.globalParticipationRate ?? selection.entitySelector.globalParticipationRate}
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
						{@const globalParticipationRate = entity.globalParticipationRate ?? selection.entitySelector.globalParticipationRate ?? prefetched.globalParticipationRate}
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
				<ResourceBoundary resource={beaconEpoch}>
					{#snippet Pending()}
						{@const validatorsCount = prefetched.validatorsCount ?? selection.entitySelector.validatorsCount}
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
						{@const validatorsCount = entity.validatorsCount ?? selection.entitySelector.validatorsCount ?? prefetched.validatorsCount}
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
				<ResourceBoundary resource={beaconEpoch}>
					{#snippet Pending()}
						{@const attestationsCount = prefetched.attestationsCount ?? selection.entitySelector.attestationsCount}
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
						{@const attestationsCount = entity.attestationsCount ?? selection.entitySelector.attestationsCount ?? prefetched.attestationsCount}
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
				<ResourceBoundary resource={beaconEpoch}>
					{#snippet Pending()}
						{@const withdrawalsCount = prefetched.withdrawalsCount ?? selection.entitySelector.withdrawalsCount}
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
						{@const withdrawalsCount = entity.withdrawalsCount ?? selection.entitySelector.withdrawalsCount ?? prefetched.withdrawalsCount}
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
				<ResourceBoundary resource={beaconEpoch}>
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
