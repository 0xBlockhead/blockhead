<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.SuiPackageUpgrade> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'Sui package upgrade'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
	import SuiPackageVersionView from '$/views/SuiPackageVersionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackageUpgrade}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Sui package upgrade
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>package</dt>
				<dd>
					<SuiPackageView
						selection={select(EntityType.SuiPackage, selection.entitySelector.$package)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>upgraded package ID</dt>
				<dd>
					{pendingEntity.upgradedPackageId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							upgradedVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const upgradedVersion = entity.upgradedVersion}
					{#if upgradedVersion != null}
						<div>
							<dt>upgraded version</dt>
							<dd>
								{String(upgradedVersion)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							previousPackageId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const previousPackageId = entity.previousPackageId}
					{#if previousPackageId != null}
						<div>
							<dt>previous package ID</dt>
							<dd>
								{previousPackageId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							policy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const policy = entity.policy}
					{#if policy != null}
						<div>
							<dt>policy</dt>
							<dd>
								{policy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							digest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const digest = entity.digest}
					{#if digest != null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={digest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet children(suiTransaction)}
					{#if suiTransaction != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<SuiTransactionView
									selection={select(EntityType.SuiTransaction, suiTransaction[EntityMetaKey.Selector])}
									prefetched={suiTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$packageVersion}
			>
				{#snippet children(suiPackageVersion)}
					{#if suiPackageVersion != null}
						<div>
							<dt>package version</dt>
							<dd>
								<SuiPackageVersionView
									selection={select(EntityType.SuiPackageVersion, suiPackageVersion[EntityMetaKey.Selector])}
									prefetched={suiPackageVersion}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
