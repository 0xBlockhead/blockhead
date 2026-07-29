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
	}: EntitySelectionViewProps<EntityType.Eip8004AgentRegistration> = $props()

	const titleFallback = $derived(selection.entitySelector.agentId || 'EIP-8004 agent registration')


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
		{selection.entitySelector.agentId || 'EIP-8004 agent registration'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.namespace || selection.entitySelector.agentId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.chainId}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Namespace</dt>
				<dd>
					{selection.entitySelector.namespace}
				</dd>
			</div>

			<div>
				<dt>Chain ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.chainId}
					/>
				</dd>
			</div>

			<div>
				<dt>Identity registry</dt>
				<dd>
					{selection.entitySelector.identityRegistry}
				</dd>
			</div>

			<div>
				<dt>Agent ID</dt>
				<dd>
					{selection.entitySelector.agentId}
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
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Eip8004AgentRegistration_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const filesResource = selection.$$files}
		<ResourceBoundary
			resource={filesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Eip8004AgentRegistrationFilesView
						selection={filesResource}
						countResource={filesResource.count}
						title='Files'
						id='files'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
