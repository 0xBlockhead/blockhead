<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BnbBeaconTokenMigration_Timestamp>, 'prefetched'> = $props()

	const migration = $derived(selection.entitySelector.$migration)
	const bnbBeaconTokenMigrationTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BnbBeaconTokenMigrationView from '$/views/BnbBeaconTokenMigrationView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTokenMigration_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			(
				'slug' in migration.$targetNetwork ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(bnb-beacon)/bnb-beacon/token/[symbol=stringSegment]/(bnbBeaconToken)/migration/[targetNetwork=networkSlug]/[targetAddress=stringSegment]/(bnbBeaconTokenMigration)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							network: (
								'caip2' in migration.$token.$network.$network ?
									caip2StringFromValue(migration.$token.$network.$network.caip2)
								:
									migration.$token.$network.$network.slug
							),
							symbol: migration.$token.symbol,
							targetNetwork: migration.$targetNetwork.slug,
							targetAddress: migration.targetAddress,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconTokenMigrationTimestamp}>
			{#snippet children(entity)}
				{(entity.status ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>migration</dt>
				<dd>
					<BnbBeaconTokenMigrationView
						selection={select(EntityType.BnbBeaconTokenMigration, selection.entitySelector.$migration)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={bnbBeaconTokenMigrationTimestamp}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAtMs = entity.observedAtMs}
					{#if observedAtMs != null}
						<div>
							<dt>observed AT ms</dt>
							<dd>
								<Timestamp timestamp={observedAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
