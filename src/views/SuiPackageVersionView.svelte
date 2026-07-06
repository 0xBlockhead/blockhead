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
			selection: EntityProxyResource<typeof schema, EntityType.SuiPackageVersion>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiPackageVersion>>
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
	const suiPackageVersion = $derived(selection({}))
	const titleFallback = $derived('Sui package version')
	const viewDomId = $derived('sui-package-version-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SuiNetworkView from '$/views/SuiNetworkView.svelte'
	import SuiPackageView from '$/views/SuiPackageView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiPackageVersion}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiPackageVersion}>
			{#snippet Pending()}
				{title || 'Sui package version'}
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
				<dt>network</dt>
				<dd>
					<SuiNetworkView
						selection={select(EntityType.SuiNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.SuiPackage, false>('$package')}
			>
				{#snippet children(suiPackage)}
					{#if suiPackage != null && suiPackage[EntityMetaKey.Selector] != null}
						<div>
							<dt>package</dt>
							<dd>
								<SuiPackageView
									selection={select(EntityType.SuiPackage, suiPackage[EntityMetaKey.Selector])}
									prefetched={suiPackage}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>package ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									packageId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const packageId = selection.entitySelector.packageId ?? prefetched.packageId}
							{#if packageId !== undefined && packageId !== null}
								{String((packageId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const packageId = resolvedEntity.packageId}
							{#if packageId !== undefined && packageId !== null}
								{String((packageId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>version</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									version: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const version = selection.entitySelector.version ?? prefetched.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const version = resolvedEntity.version}
							{#if version !== undefined && version !== null}
								{String((version) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
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
							{@const digest = selection.entitySelector.digest ?? prefetched.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const digest = resolvedEntity.digest}
							{#if digest !== undefined && digest !== null}
								<TruncatedValue value={String((digest) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							upgradePolicy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const upgradePolicy = prefetched.upgradePolicy}
					{#if upgradePolicy !== undefined && upgradePolicy !== null}
						<div>
							<dt>upgrade policy</dt>
							<dd>
								{String((upgradePolicy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const upgradePolicy = resolvedEntity.upgradePolicy}
					{#if upgradePolicy !== undefined && upgradePolicy !== null}
						<div>
							<dt>upgrade policy</dt>
							<dd>
								{String((upgradePolicy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
