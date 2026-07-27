<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.EvmContractVerification> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const evmContractVerification = $derived(selection({
		fields: {
			match: true,
			runtimeMatch: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.match ?? ''), (pendingEntity.runtimeMatch ?? '')].filter(Boolean).join(' ') || 'EVM contract verification')


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
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddress]/(evmContract)/verification',
			{
				network: (
					'caip2' in selection.entitySelector.$contract.$network ?
						String(caip2StringFromValue(selection.entitySelector.$contract.$network.caip2))
					:
						String(selection.entitySelector.$contract.$network.slug)
				),
				address: String(selection.entitySelector.$contract.address),
			}
		)
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
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$compilation}
			>
				{#snippet children(evmContractCompilation)}
					{#if evmContractCompilation != null}
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
					{#if evmContractSourceBundle != null}
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
