<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContractVerification>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmContractVerification>>
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
	const evmContractVerification = $derived(selection({
		fields: {
			match: true,
			runtimeMatch: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.match) ?? ''), String((prefetched.runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')
	const viewDomId = $derived('evm-contract-verification-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractVerification}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$contract !== undefined && pendingEntity.$contract.$network !== undefined && pendingEntity.$contract.$network.caip2 !== undefined && pendingEntity.$contract.$network.caip2.namespace !== undefined && pendingEntity.$contract !== undefined && pendingEntity.$contract.$network !== undefined && pendingEntity.$contract.$network.caip2 !== undefined && pendingEntity.$contract.$network.caip2.reference !== undefined && pendingEntity.$contract !== undefined && pendingEntity.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]/verification', {
			caip2: `${String(pendingEntity.$contract.$network.caip2.namespace ?? '')}:${String(pendingEntity.$contract.$network.caip2.reference ?? '')}`,
			address: String(pendingEntity.$contract.address ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet Pending()}
				{[String((prefetched.match) ?? ''), String((prefetched.runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.match) ?? ''), String((resolvedEntity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet Pending()}
				{[String((prefetched.match) ?? '')].filter(Boolean).join(' ') || [String((prefetched.match) ?? ''), String((prefetched.runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.match) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.match) ?? ''), String((resolvedEntity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet Pending()}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							match: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const match = prefetched.match}
					{#if match !== undefined && match !== null}
						<div>
							<dt>Match</dt>
							<dd>
								{String((match) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const match = resolvedEntity.match}
					{#if match !== undefined && match !== null}
						<div>
							<dt>Match</dt>
							<dd>
								{String((match) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							creationMatch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const creationMatch = prefetched.creationMatch}
					{#if creationMatch !== undefined && creationMatch !== null}
						<div>
							<dt>Creation match</dt>
							<dd>
								{String((creationMatch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const creationMatch = resolvedEntity.creationMatch}
					{#if creationMatch !== undefined && creationMatch !== null}
						<div>
							<dt>Creation match</dt>
							<dd>
								{String((creationMatch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeMatch: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeMatch = prefetched.runtimeMatch}
					{#if runtimeMatch !== undefined && runtimeMatch !== null}
						<div>
							<dt>Runtime match</dt>
							<dd>
								{String((runtimeMatch) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeMatch = resolvedEntity.runtimeMatch}
					{#if runtimeMatch !== undefined && runtimeMatch !== null}
						<div>
							<dt>Runtime match</dt>
							<dd>
								{String((runtimeMatch) ?? '')}
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
							<dt>Verified at</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedAtMs = resolvedEntity.verifiedAtMs}
					{#if verifiedAtMs !== undefined && verifiedAtMs !== null}
						<div>
							<dt>Verified at</dt>
							<dd>
								<Timestamp timestamp={Number(verifiedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							matchId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const matchId = prefetched.matchId}
					{#if matchId !== undefined && matchId !== null}
						<div>
							<dt>Match ID</dt>
							<dd>
								{String((matchId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const matchId = resolvedEntity.matchId}
					{#if matchId !== undefined && matchId !== null}
						<div>
							<dt>Match ID</dt>
							<dd>
								{String((matchId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract, {})}
						href={
							(selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.namespace !== undefined && selection.entitySelector.$contract.$network !== undefined && selection.entitySelector.$contract.$network.caip2 !== undefined && selection.entitySelector.$contract.$network.caip2.reference !== undefined && selection.entitySelector.$contract.address !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$contract.$network.caip2.reference ?? '')}`,
								address: String(selection.entitySelector.$contract.address ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContractCompilation, false>('$compilation')}
			>
				{#snippet children(evmContractCompilation)}
					{#if evmContractCompilation != null && evmContractCompilation[EntityMetaKey.Selector] != null}
						<div>
							<dt>Compilation</dt>
							<dd>
								<EvmContractCompilationView
									selection={select(EntityType.EvmContractCompilation, evmContractCompilation[EntityMetaKey.Selector])}
									prefetched={evmContractCompilation}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmContractSourceBundle, false>('$sourceBundle')}
			>
				{#snippet children(evmContractSourceBundle)}
					{#if evmContractSourceBundle != null && evmContractSourceBundle[EntityMetaKey.Selector] != null}
						<div>
							<dt>Source bundle</dt>
							<dd>
								<EvmContractSourceBundleView
									selection={select(EntityType.EvmContractSourceBundle, evmContractSourceBundle[EntityMetaKey.Selector])}
									prefetched={evmContractSourceBundle}
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
