<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const evmContractVerification = $derived(selection({
		fields: {
			match: true,
			runtimeMatch: true,
			creationMatch: true,
			verifiedAtMs: true,
			matchId: true,
			$compilation: true,
			$sourceBundle: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).match) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')
	const viewDomId = $derived('evm-contract-verification-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractVerification}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]/verification', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).caip2.reference)}`,
			address: String(({ ...selection.entitySelector, ...prefetched }).$contract.address),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).match) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
		{:else}
			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).match) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.match) ?? ''), String((entity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).match) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).match) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
		{:else}
			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).match) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).match) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).runtimeMatch) ?? '')].filter(Boolean).join(' ') || title || 'EVM contract verification'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.match) ?? '')].filter(Boolean).join(' ') || [String((entity.match) ?? ''), String((entity.runtimeMatch) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmContractView
					selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
					href={
						resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
							caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
							address: String(selection.entitySelector.$contract.address),
						})
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmContractView
							selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
									caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
									address: String(selection.entitySelector.$contract.address),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmContractView
							selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
							href={
								resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
									caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
									address: String(selection.entitySelector.$contract.address),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					{@const creationMatch = prefetched.creationMatch ?? selection.entitySelector.creationMatch}
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
					{@const creationMatch = entity.creationMatch ?? selection.entitySelector.creationMatch ?? prefetched.creationMatch}
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

			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					{@const verifiedAtMs = prefetched.verifiedAtMs ?? selection.entitySelector.verifiedAtMs}
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
					{@const verifiedAtMs = entity.verifiedAtMs ?? selection.entitySelector.verifiedAtMs ?? prefetched.verifiedAtMs}
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

			<ResourceBoundary resource={evmContractVerification}>
				{#snippet Pending()}
					{@const matchId = prefetched.matchId ?? selection.entitySelector.matchId}
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
					{@const matchId = entity.matchId ?? selection.entitySelector.matchId ?? prefetched.matchId}
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
	{/snippet}
</EntityView>
