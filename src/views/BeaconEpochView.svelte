<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import BeaconEpochSchema from '$/schema/BeaconEpoch.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
			href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(beacon-epochs)/epoch/[epochNumber]', {
				caip2Namespace: entityId.$network.caip2.namespace,
				caip2Reference: entityId.$network.caip2.reference,
				epochNumber: String(entityId.epoch),
			}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: typeof BeaconEpochSchema.id.infer
			href?: string
			layout?: EntityLayout
			title?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const epoch = subscribe(EntityType.BeaconEpoch,
		entityId,
		({ sources: [
				Source.Beacon_Rest,
				Source.BeaconchaIn_Rest,
			], fields: { startSlot: true, endSlot: true, ...(open && ({ slotCount: true, finalized: true, globalParticipationRate: true, validatorsCount: true, attestationsCount: true, attesterSlashingsCount: true, proposerSlashingsCount: true, withdrawalsCount: true })) } }),
	)


	// (Derived)
	const title = $derived(
		titleProp ?? `Epoch #${entityId.epoch.toLocaleString()}`,
	)

	const epochIdKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import BeaconSlotsView from '$/views/BeaconSlotsView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconEpoch}
	{entityId}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(entityId.epoch)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(entityId.epoch)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Epoch </span>
		<span data-badge="small">
			#{String(entityId.epoch)}
		</span>
		</span>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<div>
				<dt>Slot range</dt>
				<dd>
					<ResourceBoundary
						resource={epoch}
						placeholderText="Loading epoch…"
					>
						{#snippet children(epoch)}
							{#if (
								epoch.fields.startSlot !== undefined
								&& epoch.fields.endSlot !== undefined
							)}
								<NumberValue value={epoch.fields.startSlot} />
								to
								<NumberValue value={epoch.fields.endSlot} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Slot count</dt>
					<dd>
						<ResourceBoundary
							resource={epoch}
							placeholderText="Loading epoch…"
						>
							{#snippet children(epoch)}
								{#if epoch.fields.slotCount !== undefined}
									<NumberValue value={epoch.fields.slotCount} />
								{:else}
									<span data-text="muted">Slot span unavailable from beacon API.</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

					<ResourceBoundary
						resource={epoch}
						placeholderText="Loading epoch…"
					>
						{#snippet children(epoch)}
				{#if epoch.fields.finalized !== undefined}
					<div>
						<dt>Finalized</dt>
						<dd>{epoch.fields.finalized ? 'Yes' : 'No'}</dd>
					</div>
				{/if}

				{#if epoch.fields.globalParticipationRate !== undefined}
					<div>
						<dt>Participation</dt>
						<dd>{(epoch.fields.globalParticipationRate * 100).toFixed(2)}%</dd>
					</div>
				{/if}

				{#if epoch.fields.validatorsCount !== undefined}
					<div>
						<dt>Validators</dt>
						<dd><NumberValue value={epoch.fields.validatorsCount} /></dd>
					</div>
				{/if}

				{#if epoch.fields.attestationsCount !== undefined}
					<div>
						<dt>Attestations</dt>
						<dd><NumberValue value={epoch.fields.attestationsCount} /></dd>
					</div>
				{/if}

				{#if epoch.fields.withdrawalsCount !== undefined}
					<div>
						<dt>Withdrawals</dt>
						<dd><NumberValue value={epoch.fields.withdrawalsCount} /></dd>
					</div>
				{/if}

				{#if (
					epoch.fields.attesterSlashingsCount !== undefined
					|| epoch.fields.proposerSlashingsCount !== undefined
				)}
					<div>
						<dt>Slashings</dt>
						<dd>
							{#if epoch.fields.attesterSlashingsCount !== undefined}
								<NumberValue value={epoch.fields.attesterSlashingsCount} /> attester
							{/if}
							{#if epoch.fields.proposerSlashingsCount !== undefined}
								<NumberValue value={epoch.fields.proposerSlashingsCount} /> proposer
							{/if}
						</dd>
					</div>
				{/if}
						{/snippet}
					</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${epochIdKey}:carousel-slots`}
			sectionIdPrefix={epochIdKey}
			sections={[
				{ id: 'beacon-slots', label: 'Slots' },
			]}
			data-card
		>
			{#snippet Summary({ open: _isOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Slots</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBeaconSlots()}
				<BeaconSlotsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.BeaconEpoch,
						entityId,
						fieldName: '$$beaconSlots',
					}}
					id={`${epochIdKey}:beacon-slots`}
					title="Slots"
				/>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
