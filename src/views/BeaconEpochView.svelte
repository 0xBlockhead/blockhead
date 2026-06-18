<script lang="ts">
	// Types/constants
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
		selector,
			href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(beacon-epochs)/epoch/[epochNumber]', {
				caip2: `${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`,
				epochNumber: String(selector.epoch),
			}),
		layout = EntityLayout.Summary,
		title: titleProp,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BeaconEpoch>
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

	const epoch = $derived(select(EntityType.BeaconEpoch,
		selector,
		({ sources: [
				Source.Beacon_Rest,
				Source.BeaconchaIn_Rest,
			], fields: { startSlot: true, endSlot: true, ...(open && ({ slotCount: true, finalized: true, globalParticipationRate: true, validatorsCount: true, attestationsCount: true, attesterSlashingsCount: true, proposerSlashingsCount: true, withdrawalsCount: true })) } }),
	))


	// (Derived)
	const title = $derived(
		titleProp ?? `Epoch #${selector.epoch.toLocaleString()}`,
	)

	const epochSelectorKey = $derived(
		stringify(selector),
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
	entitySelector={selector}
	href={href}
	{title}
	{layout}
	bind:open
	idDragPlainText={String(selector.epoch)}
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-badge="small">
			#{String(selector.epoch)}
		</span>
	{/snippet}

	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Epoch </span>
		<span data-badge="small">
			#{String(selector.epoch)}
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
