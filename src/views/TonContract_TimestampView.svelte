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
			selection: EntityProxyResource<typeof schema, EntityType.TonContract_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonContract_Timestamp>>
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
	const tonContractTimestamp = $derived(selection({}))
	const titleFallback = $derived('TON contract timestamp')
	const viewDomId = $derived('ton-contract-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TonContract_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonContractTimestamp}>
			{#snippet Pending()}
				{title || 'TON contract timestamp'}
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
				<dt>contract</dt>
				<dd>
					<TonContractView
						selection={select(EntityType.TonContract, selection.entitySelector.$contract, {})}
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
				resource={
					selection({
						fields: {
							interfaceKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const interfaceKind = prefetched.interfaceKind}
					{#if interfaceKind !== undefined && interfaceKind !== null}
						<div>
							<dt>interface kind</dt>
							<dd>
								{String((interfaceKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const interfaceKind = resolvedEntity.interfaceKind}
					{#if interfaceKind !== undefined && interfaceKind !== null}
						<div>
							<dt>interface kind</dt>
							<dd>
								{String((interfaceKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							walletVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const walletVersion = prefetched.walletVersion}
					{#if walletVersion !== undefined && walletVersion !== null}
						<div>
							<dt>wallet version</dt>
							<dd>
								{String((walletVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const walletVersion = resolvedEntity.walletVersion}
					{#if walletVersion !== undefined && walletVersion !== null}
						<div>
							<dt>wallet version</dt>
							<dd>
								{String((walletVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							codeHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const codeHash = prefetched.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const codeHash = resolvedEntity.codeHash}
					{#if codeHash !== undefined && codeHash !== null}
						<div>
							<dt>code hash</dt>
							<dd>
								<TruncatedValue value={String((codeHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedSourceUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedSourceUrl = prefetched.verifiedSourceUrl}
					{#if verifiedSourceUrl !== undefined && verifiedSourceUrl !== null}
						<div>
							<dt>verified source URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(verifiedSourceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(verifiedSourceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedSourceUrl = resolvedEntity.verifiedSourceUrl}
					{#if verifiedSourceUrl !== undefined && verifiedSourceUrl !== null}
						<div>
							<dt>verified source URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(verifiedSourceUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(verifiedSourceUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedAtMs = prefetched.verifiedAtMs}
					{#if verifiedAtMs !== undefined && verifiedAtMs !== null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								{String((verifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAtMs = resolvedEntity.verifiedAtMs}
					{#if verifiedAtMs !== undefined && verifiedAtMs !== null}
						<div>
							<dt>verified AT ms</dt>
							<dd>
								{String((verifiedAtMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verification: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verification = prefetched.verification}
					{#if verification !== undefined && verification !== null}
						<div>
							<dt>verification</dt>
							<dd>
								{String((verification) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verification = resolvedEntity.verification}
					{#if verification !== undefined && verification !== null}
						<div>
							<dt>verification</dt>
							<dd>
								{String((verification) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
