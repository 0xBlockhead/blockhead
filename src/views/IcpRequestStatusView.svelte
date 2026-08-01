<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IcpRequestStatus> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpRequestStatus}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP request status'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>request ID</dt>
				<dd>
					{selection.entitySelector.requestId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$canister}
			>
				{#snippet children(icpCanister)}
					{#if icpCanister != null}
						<div>
							<dt>canister</dt>
							<dd>
								<IcpCanisterView
									selection={select(EntityType.IcpCanister, icpCanister[EntityMetaKey.Selector])}
									prefetched={icpCanister}
									layout={EntityLayout.Value}
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
							methodName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const methodName = entity.methodName}
					{#if methodName != null}
						<div>
							<dt>method name</dt>
							<dd>
								{methodName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestKind = entity.requestKind}
					{#if requestKind != null}
						<div>
							<dt>request kind</dt>
							<dd>
								{requestKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							callerPrincipal: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const callerPrincipal = entity.callerPrincipal}
					{#if callerPrincipal != null}
						<div>
							<dt>caller principal</dt>
							<dd>
								{callerPrincipal}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							ingressExpiryNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ingressExpiryNs = entity.ingressExpiryNs}
					{#if ingressExpiryNs != null}
						<div>
							<dt>ingress expiry ns</dt>
							<dd>
								{ingressExpiryNs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
