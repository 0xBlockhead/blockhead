<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.Eip8004AgentRegistration> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.agentId ?? '') || 'EIP-8004 agent registration')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Eip8004AgentRegistration_TimestampsView from '$/views/Eip8004AgentRegistration_TimestampsView.svelte'
	import Eip8004AgentRegistrationFilesView from '$/views/Eip8004AgentRegistrationFilesView.svelte'
	import EvmNftView from '$/views/EvmNftView.svelte'
</script>


<EntityView
	entityType={EntityType.Eip8004AgentRegistration}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.agentId ?? '') || 'EIP-8004 agent registration'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.namespace ?? '') || (pendingEntity.agentId ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{String(pendingEntity.chainId)}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					{pendingEntity.namespace}
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<NumberValue
						value={pendingEntity.chainId}
					/>
				</dd>
			</div>

			<div>
				<dt>Identity registry</dt>
				<dd>
					{String(pendingEntity.identityRegistry)}
				</dd>
			</div>

			<div>
				<dt>Agent ID</dt>
				<dd>
					{pendingEntity.agentId}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$evmNft}
			>
				{#snippet children(evmNft)}
					{#if evmNft != null}
						<div>
							<dt>EVM NFT</dt>
							<dd>
								<EvmNftView
									selection={select(EntityType.EvmNft, evmNft[EntityMetaKey.Selector])}
									prefetched={evmNft}
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

	{#snippet Details({ open: detailsOpen })}
		{@const eip8004AgentRegistrationEip8004AgentRegistrationTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={eip8004AgentRegistrationEip8004AgentRegistrationTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Eip8004AgentRegistration_TimestampsView
						selection={eip8004AgentRegistrationEip8004AgentRegistrationTimestampsViewTimestampsResource}
						countResource={eip8004AgentRegistrationEip8004AgentRegistrationTimestampsViewTimestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const eip8004AgentRegistrationEip8004AgentRegistrationFilesViewFilesResource = selection.$$files}
		<ResourceBoundary
			resource={eip8004AgentRegistrationEip8004AgentRegistrationFilesViewFilesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Eip8004AgentRegistrationFilesView
						selection={eip8004AgentRegistrationEip8004AgentRegistrationFilesViewFilesResource}
						countResource={eip8004AgentRegistrationEip8004AgentRegistrationFilesViewFilesResource.count}
						title='Files'
						id='files'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
