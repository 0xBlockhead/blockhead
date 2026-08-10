<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.SuiPackageUpgrade>, 'prefetched'> = $props()

	const packageValue = $derived(selection.entitySelector.$package)


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
	title={title ?? 'Sui package upgrade'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/package/[originalPackageId=stringSegment]/(suiPackage)/upgrade/[upgradedPackageId=stringSegment]',
				{
					network: (
						'caip2' in packageValue.$network.$network ?
							caip2StringFromValue(packageValue.$network.$network.caip2)
						:
							packageValue.$network.$network.slug
					),
					originalPackageId: packageValue.originalPackageId,
					upgradedPackageId: selection.entitySelector.upgradedPackageId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>package</dt>
				<dd>
					<SuiPackageView
						selection={select(EntityType.SuiPackage, selection.entitySelector.$package)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>upgraded package ID</dt>
				<dd>
					{selection.entitySelector.upgradedPackageId}
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
								{upgradedVersion}
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
								<Timestamp timestamp={timestampMs} />
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
						{@const suiTransactionInitial = untrack(() => suiTransaction)}
						<div>
							<dt>transaction</dt>
							<dd>
								<SuiTransactionView
									selection={select(EntityType.SuiTransaction, (suiTransaction ?? suiTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const suiPackageVersionInitial = untrack(() => suiPackageVersion)}
						<div>
							<dt>package version</dt>
							<dd>
								<SuiPackageVersionView
									selection={select(EntityType.SuiPackageVersion, (suiPackageVersion ?? suiPackageVersionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
