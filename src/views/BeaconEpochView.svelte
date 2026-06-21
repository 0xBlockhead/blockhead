<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
				href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber=beaconEpochNumber]', {
				caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
				epochNumber: String(selection.entitySelector.epoch),
			}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BeaconEpoch>
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


	const epoch = $derived(selection(
		({ sources: [
				Source.Beacon_Rest,
				Source.BeaconchaIn_Rest,
			], fields: { startSlot: true, endSlot: true, ...(open && ({ slotCount: true, finalized: true, globalParticipationRate: true, validatorsCount: true, attestationsCount: true, attesterSlashingsCount: true, proposerSlashingsCount: true, withdrawalsCount: true })) } }),
	))


	// (Derived)
	const title = $derived(
		titleProp ?? `Epoch #${selection.entitySelector.epoch.toLocaleString()}`,
	)

	const epochSelectorKey = $derived(
		stringify(selection.entitySelector),
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
	entitySelector={selection.entitySelector}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(selection.entitySelector.epoch)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selection.entitySelector.epoch)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Epoch </span>
		<span data-badge="small">
			#{String(selection.entitySelector.epoch)}
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
								epoch.startSlot !== undefined
								&& epoch.endSlot !== undefined
							)}
								<NumberValue value={epoch.startSlot} />
								to
								<NumberValue value={epoch.endSlot} />
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
								{#if epoch.slotCount !== undefined}
									<NumberValue value={epoch.slotCount} />
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
				{#if epoch.finalized !== undefined}
					<div>
						<dt>Finalized</dt>
						<dd>{epoch.finalized ? 'Yes' : 'No'}</dd>
					</div>
				{/if}

				{#if epoch.globalParticipationRate !== undefined}
					<div>
						<dt>Participation</dt>
						<dd>{(epoch.globalParticipationRate * 100).toFixed(2)}%</dd>
					</div>
				{/if}

				{#if epoch.validatorsCount !== undefined}
					<div>
						<dt>Validators</dt>
						<dd><NumberValue value={epoch.validatorsCount} /></dd>
					</div>
				{/if}

				{#if epoch.attestationsCount !== undefined}
					<div>
						<dt>Attestations</dt>
						<dd><NumberValue value={epoch.attestationsCount} /></dd>
					</div>
				{/if}

				{#if epoch.withdrawalsCount !== undefined}
					<div>
						<dt>Withdrawals</dt>
						<dd><NumberValue value={epoch.withdrawalsCount} /></dd>
					</div>
				{/if}

				{#if (
					epoch.attesterSlashingsCount !== undefined
					|| epoch.proposerSlashingsCount !== undefined
				)}
					<div>
						<dt>Slashings</dt>
						<dd>
							{#if epoch.attesterSlashingsCount !== undefined}
								<NumberValue value={epoch.attesterSlashingsCount} /> attester
							{/if}
							{#if epoch.proposerSlashingsCount !== undefined}
								<NumberValue value={epoch.proposerSlashingsCount} /> proposer
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
			id={`${epochSelectorKey}:carousel-slots`}
			sectionIdPrefix={epochSelectorKey}
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
					selection={epoch.$$beaconSlots({
						sources: [
							Source.Beacon_Rest,
						],
					})}
					id={`${epochSelectorKey}:beacon-slots`}
					title="Slots"
				/>
			{/snippet}
	</CollapsibleTabs>

	{/snippet}
</EntityView>
