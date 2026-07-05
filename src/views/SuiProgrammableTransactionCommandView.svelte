<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiProgrammableTransactionCommand>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.SuiProgrammableTransactionCommand>>
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
	const suiProgrammableTransactionCommand = $derived(selection({}))
	const titleFallback = $derived('Sui programmable transaction command')
	const viewDomId = $derived('sui-programmable-transaction-command-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SuiTransactionView from '$/views/SuiTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.SuiProgrammableTransactionCommand}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={suiProgrammableTransactionCommand}>
			{#snippet Pending()}
				{title || 'Sui programmable transaction command'}
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
				<dt>transaction</dt>
				<dd>
					<SuiTransactionView
						selection={select(EntityType.SuiTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>command index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commandIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commandIndex = selection.entitySelector.commandIndex ?? prefetched.commandIndex}
							{#if commandIndex !== undefined && commandIndex !== null}
								{String((commandIndex) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commandIndex = resolvedEntity.commandIndex}
							{#if commandIndex !== undefined && commandIndex !== null}
								{String((commandIndex) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>command kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commandKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const commandKind = prefetched.commandKind}
							{#if commandKind !== undefined && commandKind !== null}
								{String((commandKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const commandKind = resolvedEntity.commandKind}
							{#if commandKind !== undefined && commandKind !== null}
								{String((commandKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
					{@const packageId = prefetched.packageId}
					{#if packageId !== undefined && packageId !== null}
						<div>
							<dt>package ID</dt>
							<dd>
								{String((packageId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageId = resolvedEntity.packageId}
					{#if packageId !== undefined && packageId !== null}
						<div>
							<dt>package ID</dt>
							<dd>
								{String((packageId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const moduleName = prefetched.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const moduleName = resolvedEntity.moduleName}
					{#if moduleName !== undefined && moduleName !== null}
						<div>
							<dt>module name</dt>
							<dd>
								{String((moduleName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							functionName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const functionName = prefetched.functionName}
					{#if functionName !== undefined && functionName !== null}
						<div>
							<dt>function name</dt>
							<dd>
								{String((functionName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const functionName = resolvedEntity.functionName}
					{#if functionName !== undefined && functionName !== null}
						<div>
							<dt>function name</dt>
							<dd>
								{String((functionName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>type arguments</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									typeArguments: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const typeArguments = prefetched.typeArguments}
							{#if typeArguments !== undefined && typeArguments !== null}
								{(typeArguments?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const typeArguments = resolvedEntity.typeArguments}
							{#if typeArguments !== undefined && typeArguments !== null}
								{(typeArguments?.values ?? []).map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
