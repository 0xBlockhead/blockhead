<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpCertifiedState>, 'prefetched'> = $props()

	const canister = $derived(selection.entitySelector.$canister)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCertifiedState}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP certified state'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/certified-state/[certificateHash=stringSegment]/[pathHash=stringSegment]',
				{
					network: (
						'caip2' in canister.$network.$network ?
							caip2StringFromValue(canister.$network.$network.caip2)
						:
							canister.$network.$network.slug
					),
					canisterId: canister.canisterId,
					certificateHash: selection.entitySelector.certificateHash,
					pathHash: selection.entitySelector.pathHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>certificate hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.certificateHash} />
				</dd>
			</div>

			<div>
				<dt>path hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.pathHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							treeHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const treeHash = entity.treeHash}
					{#if treeHash != null}
						<div>
							<dt>tree hash</dt>
							<dd>
								<TruncatedValue value={treeHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certifiedAtMs = entity.certifiedAtMs}
					{#if certifiedAtMs != null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{certifiedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetSignature = entity.subnetSignature}
					{#if subnetSignature != null}
						<div>
							<dt>subnet signature</dt>
							<dd>
								<TruncatedValue value={subnetSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationStatus = entity.verificationStatus}
					{#if verificationStatus != null}
						<div>
							<dt>verification status</dt>
							<dd>
								{verificationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
