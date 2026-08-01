<!-- Generated from APP.ts. -->

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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TronContract_Timestamp>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TronContractView from '$/views/TronContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TronContract_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<TronContractView
						selection={select(EntityType.TronContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							compiler: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const compiler = entity.compiler}
					{#if compiler != null}
						<div>
							<dt>Compiler</dt>
							<dd>
								{compiler}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifyStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifyStatus = entity.verifyStatus}
					{#if verifyStatus != null}
						<div>
							<dt>Verify status</dt>
							<dd>
								{verifyStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isProxy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isProxy = entity.isProxy}
					{#if isProxy != null}
						<div>
							<dt>Proxy</dt>
							<dd>
								{isProxy ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$implementation}
			>
				{#snippet children(tronContract)}
					{#if tronContract != null}
						<div>
							<dt>Implementation</dt>
							<dd>
								<TronContractView
									selection={select(EntityType.TronContract, tronContract[EntityMetaKey.Selector])}
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
