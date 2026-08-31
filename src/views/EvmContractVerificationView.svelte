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
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmContractVerification> = $props()

	const contract = $derived(selection.entitySelector.$contract)
	const evmContractVerification = $derived(selection({
		fields: {
			match: true,
			runtimeMatch: true,
		},
	}))
	const titleFallback = $derived([(prefetched.match ?? ''), (prefetched.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmContractCompilationView from '$/views/EvmContractCompilationView.svelte'
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmContractVerification}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/verification',
				{
					network: (
						'caip2' in contract.$network ?
							caip2StringFromValue(contract.$network.caip2)
						:
							contract.$network.slug
					),
					address: contract.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet children(entity)}
				{[(entity.match ?? ''), (entity.runtimeMatch ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmContractVerification}>
			{#snippet children(entity)}
				{(entity.match ?? '') || [(entity.match ?? ''), (entity.runtimeMatch ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmContractView
				selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={evmContractVerification}
			>
				{#snippet children(entity)}
					{@const match = entity.match}
					{#if match != null}
						<div>
							<dt>Match</dt>
							<dd>
								{match}
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
				{#snippet children(entity)}
					{@const creationMatch = entity.creationMatch}
					{#if creationMatch != null}
						<div>
							<dt>Creation match</dt>
							<dd>
								{creationMatch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={evmContractVerification}
			>
				{#snippet children(entity)}
					{@const runtimeMatch = entity.runtimeMatch}
					{#if runtimeMatch != null}
						<div>
							<dt>Runtime match</dt>
							<dd>
								{runtimeMatch}
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
				{#snippet children(entity)}
					{@const verifiedAtMs = entity.verifiedAtMs}
					{#if verifiedAtMs != null}
						<div>
							<dt>Verified at</dt>
							<dd>
								<Timestamp timestamp={verifiedAtMs} />
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
				{#snippet children(entity)}
					{@const matchId = entity.matchId}
					{#if matchId != null}
						<div>
							<dt>Match ID</dt>
							<dd>
								{matchId}
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
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$compilation}
			>
				{#snippet children(evmContractCompilation)}
					{#if evmContractCompilation != null}
						{@const evmContractCompilationInitial = untrack(() => evmContractCompilation)}
						<div>
							<dt>Compilation</dt>
							<dd>
								<EvmContractCompilationView
									selection={select(EntityType.EvmContractCompilation, (evmContractCompilation ?? evmContractCompilationInitial)[EntityMetaKey.Selector])}
									prefetched={evmContractCompilation ?? evmContractCompilationInitial}
									layout={EntityLayout.Value}
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
					{#if evmContractSourceBundle != null}
						<div>
							<dt>Source bundle</dt>
							<dd>
								<EvmContractSourceBundleView
									selection={select(EntityType.EvmContractSourceBundle, evmContractSourceBundle[EntityMetaKey.Selector])}
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
