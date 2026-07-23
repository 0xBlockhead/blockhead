<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.EvmContractVerification>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.EvmContractVerification>
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
	const evmContractVerification = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			match: true,
			runtimeMatch: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			match: true,
			runtimeMatch: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.match) ?? ''), String((pendingEntity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')
	const viewDomId = $derived('evm-contract-verification-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && '$contract' in selection.entitySelector
			&& selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
			&& selection.entitySelector.$contract.address != null
			&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract ?
				selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
				&& selection.entitySelector.$contract.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
				address: String(selection.entitySelector.$contract.address ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$contract.$network != null && 'slug' in selection.entitySelector.$contract.$network
					&& selection.entitySelector.$contract.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]/verification', {
					address: String(selection.entitySelector.$contract.address ?? ''),
					network: String(selection.entitySelector.$contract.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.match) ?? ''), String((resolvedEntity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.match) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.match) ?? ''), String((resolvedEntity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(
								selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
								&& selection.entitySelector.$contract.address != null
								&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract ?
									selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
									&& selection.entitySelector.$contract.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$contract.$network != null && 'slug' in selection.entitySelector.$contract.$network
										&& selection.entitySelector.$contract.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										address: String(selection.entitySelector.$contract.address ?? ''),
										network: String(selection.entitySelector.$contract.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
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
						sources: selection.sources,
						fields: {
							match: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							creationMatch: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							runtimeMatch: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							verifiedAtMs: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							matchId: true,
						},
					})
				}
			>
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
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							(
								selection.entitySelector.$contract != null && 'address' in selection.entitySelector.$contract
								&& selection.entitySelector.$contract.address != null
								&& selection.entitySelector.$contract != null && '$network' in selection.entitySelector.$contract ?
									selection.entitySelector.$contract.$network != null && 'caip2' in selection.entitySelector.$contract.$network
									&& selection.entitySelector.$contract.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
									address: String(selection.entitySelector.$contract.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$contract.$network != null && 'slug' in selection.entitySelector.$contract.$network
										&& selection.entitySelector.$contract.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
										address: String(selection.entitySelector.$contract.address ?? ''),
										network: String(selection.entitySelector.$contract.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$compilation}
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
				resource={selection.$sourceBundle}
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
