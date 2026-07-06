<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.SuiPackageUpgrade>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiPackageUpgrade>>
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
	const suiPackageUpgrade = $derived(selection({}))
	const titleFallback = $derived('Sui package upgrade')
	const viewDomId = $derived('sui-package-upgrade-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
	import SuiPackageVersionView from '$/views/SuiPackageVersionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackageUpgrade}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiPackageUpgrade}>
			{#snippet Pending()}
				{title || 'Sui package upgrade'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									upgradedPackageId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const upgradedPackageId = selection.entitySelector.upgradedPackageId ?? prefetched.upgradedPackageId}
							{#if upgradedPackageId !== undefined && upgradedPackageId !== null}
								{String((upgradedPackageId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const upgradedPackageId = resolvedEntity.upgradedPackageId}
							{#if upgradedPackageId !== undefined && upgradedPackageId !== null}
								{String((upgradedPackageId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
				{#snippet Pending()}
					{@const upgradedVersion = prefetched.upgradedVersion}
					{#if upgradedVersion !== undefined && upgradedVersion !== null}
						<div>
							<dt>upgraded version</dt>
							<dd>
								{String((upgradedVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const upgradedVersion = resolvedEntity.upgradedVersion}
					{#if upgradedVersion !== undefined && upgradedVersion !== null}
						<div>
							<dt>upgraded version</dt>
							<dd>
								{String((upgradedVersion) ?? '')}
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
				{#snippet Pending()}
					{@const previousPackageId = prefetched.previousPackageId}
					{#if previousPackageId !== undefined && previousPackageId !== null}
						<div>
							<dt>previous package ID</dt>
							<dd>
								{String((previousPackageId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const previousPackageId = resolvedEntity.previousPackageId}
					{#if previousPackageId !== undefined && previousPackageId !== null}
						<div>
							<dt>previous package ID</dt>
							<dd>
								{String((previousPackageId) ?? '')}
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
				{#snippet Pending()}
					{@const policy = prefetched.policy}
					{#if policy !== undefined && policy !== null}
						<div>
							<dt>policy</dt>
							<dd>
								{String((policy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const policy = resolvedEntity.policy}
					{#if policy !== undefined && policy !== null}
						<div>
							<dt>policy</dt>
							<dd>
								{String((policy) ?? '')}
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
				{#snippet Pending()}
					{@const digest = prefetched.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const digest = resolvedEntity.digest}
					{#if digest !== undefined && digest !== null}
						<div>
							<dt>digest</dt>
							<dd>
								<TruncatedValue value={String((digest) ?? '')} />
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
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
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
				resource={selection[EntityProxyField]<EntityType.SuiTransaction, false>('$transaction')}
			>
				{#snippet children(suiTransaction)}
					{#if suiTransaction != null && suiTransaction[EntityMetaKey.Selector] != null}
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
				resource={selection[EntityProxyField]<EntityType.SuiPackageVersion, false>('$packageVersion')}
			>
				{#snippet children(suiPackageVersion)}
					{#if suiPackageVersion != null && suiPackageVersion[EntityMetaKey.Selector] != null}
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
