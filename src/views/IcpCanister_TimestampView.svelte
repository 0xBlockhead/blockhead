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
			selection: EntityProxyResource<typeof schema, EntityType.IcpCanister_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpCanister_Timestamp>>
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
	const icpCanisterTimestamp = $derived(selection({}))
	const titleFallback = $derived('ICP canister timestamp')
	const viewDomId = $derived('icp-canister-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanister_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpCanisterTimestamp}>
			{#snippet Pending()}
				{title || 'ICP canister timestamp'}
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
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.IcpSubnet, false>('$subnet')}
			>
				{#snippet children(icpSubnet)}
					{#if icpSubnet != null && icpSubnet[EntityMetaKey.Selector] != null}
						<div>
							<dt>subnet</dt>
							<dd>
								<IcpSubnetView
									selection={select(EntityType.IcpSubnet, icpSubnet[EntityMetaKey.Selector])}
									prefetched={icpSubnet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetId = prefetched.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetId = resolvedEntity.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canisterKind = prefetched.canisterKind}
					{#if canisterKind !== undefined && canisterKind !== null}
						<div>
							<dt>canister kind</dt>
							<dd>
								{String((canisterKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canisterKind = resolvedEntity.canisterKind}
					{#if canisterKind !== undefined && canisterKind !== null}
						<div>
							<dt>canister kind</dt>
							<dd>
								{String((canisterKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							candidInterfaceHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const candidInterfaceHash = prefetched.candidInterfaceHash}
					{#if candidInterfaceHash !== undefined && candidInterfaceHash !== null}
						<div>
							<dt>candid interface hash</dt>
							<dd>
								<TruncatedValue value={String((candidInterfaceHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const candidInterfaceHash = resolvedEntity.candidInterfaceHash}
					{#if candidInterfaceHash !== undefined && candidInterfaceHash !== null}
						<div>
							<dt>candid interface hash</dt>
							<dd>
								<TruncatedValue value={String((candidInterfaceHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleHash = prefetched.moduleHash}
					{#if moduleHash !== undefined && moduleHash !== null}
						<div>
							<dt>module hash</dt>
							<dd>
								<TruncatedValue value={String((moduleHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleHash = resolvedEntity.moduleHash}
					{#if moduleHash !== undefined && moduleHash !== null}
						<div>
							<dt>module hash</dt>
							<dd>
								<TruncatedValue value={String((moduleHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>controllers</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									controllers: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const controllers = prefetched.controllers}
							{#if controllers !== undefined && controllers !== null}
								{(controllers?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const controllers = resolvedEntity.controllers}
							{#if controllers !== undefined && controllers !== null}
								{(controllers?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cyclesBalance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cyclesBalance = prefetched.cyclesBalance}
					{#if cyclesBalance !== undefined && cyclesBalance !== null}
						<div>
							<dt>cycles balance</dt>
							<dd>
								{String((cyclesBalance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cyclesBalance = resolvedEntity.cyclesBalance}
					{#if cyclesBalance !== undefined && cyclesBalance !== null}
						<div>
							<dt>cycles balance</dt>
							<dd>
								{String((cyclesBalance) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memorySizeBytes: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memorySizeBytes = prefetched.memorySizeBytes}
					{#if memorySizeBytes !== undefined && memorySizeBytes !== null}
						<div>
							<dt>memory size bytes</dt>
							<dd>
								{String((memorySizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memorySizeBytes = resolvedEntity.memorySizeBytes}
					{#if memorySizeBytes !== undefined && memorySizeBytes !== null}
						<div>
							<dt>memory size bytes</dt>
							<dd>
								{String((memorySizeBytes) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freezingThresholdSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const freezingThresholdSeconds = prefetched.freezingThresholdSeconds}
					{#if freezingThresholdSeconds !== undefined && freezingThresholdSeconds !== null}
						<div>
							<dt>freezing threshold seconds</dt>
							<dd>
								{String((freezingThresholdSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const freezingThresholdSeconds = resolvedEntity.freezingThresholdSeconds}
					{#if freezingThresholdSeconds !== undefined && freezingThresholdSeconds !== null}
						<div>
							<dt>freezing threshold seconds</dt>
							<dd>
								{String((freezingThresholdSeconds) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							idleCyclesBurnedPerDay: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const idleCyclesBurnedPerDay = prefetched.idleCyclesBurnedPerDay}
					{#if idleCyclesBurnedPerDay !== undefined && idleCyclesBurnedPerDay !== null}
						<div>
							<dt>idle cycles burned per day</dt>
							<dd>
								{String((idleCyclesBurnedPerDay) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const idleCyclesBurnedPerDay = resolvedEntity.idleCyclesBurnedPerDay}
					{#if idleCyclesBurnedPerDay !== undefined && idleCyclesBurnedPerDay !== null}
						<div>
							<dt>idle cycles burned per day</dt>
							<dd>
								{String((idleCyclesBurnedPerDay) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canisterVersion = prefetched.canisterVersion}
					{#if canisterVersion !== undefined && canisterVersion !== null}
						<div>
							<dt>canister version</dt>
							<dd>
								{String((canisterVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canisterVersion = resolvedEntity.canisterVersion}
					{#if canisterVersion !== undefined && canisterVersion !== null}
						<div>
							<dt>canister version</dt>
							<dd>
								{String((canisterVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reservedCycles: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reservedCycles = prefetched.reservedCycles}
					{#if reservedCycles !== undefined && reservedCycles !== null}
						<div>
							<dt>reserved cycles</dt>
							<dd>
								{String((reservedCycles) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reservedCycles = resolvedEntity.reservedCycles}
					{#if reservedCycles !== undefined && reservedCycles !== null}
						<div>
							<dt>reserved cycles</dt>
							<dd>
								{String((reservedCycles) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
