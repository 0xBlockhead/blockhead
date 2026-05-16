<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'


	// Props
	let {
		icon,
		accounts,
		chainId,
		status,
		error,
		onRemove,
		entityId,
		title,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			icon?: string
			accounts: `0x${string}`[]
			chainId: number | null
			status: 'connecting' | 'connected' | 'error'
			error: string | null
			onRemove: () => void
			entityId: EntityId<typeof schema, EntityType.BlockheadWalletConnection>
			title: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Icon'
			| 'Content'
			| 'Details'
		>
	> = $props()


	const persisted = useEntity(
		EntityType.BlockheadWalletConnection,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			selected: {},
			connectedAt: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Icon()}
		{#if icon}
			<IconComponent
				src={icon}
				alt={title}
			/>
		{/if}
	{/snippet}

	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Id</dt>
				<dd data-text="mono">
					{@render Id()}
				</dd>
			</div>

			<div>
				<dt>Status</dt>
				<dd>{status}</dd>
			</div>

			{#if accounts[0]}
				<div>
					<dt>Account</dt>
					<dd>
						{#if chainId !== null}
							<ActorNetworkView
								entityId={{
									$network: { chainId },
									$actor: {
										address: accounts[0],
									},
								}}
								href={resolve('/~/(accounts)/accounts/account/[accountId]', {
									accountId: accounts[0],
								})}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						{:else}
							<ActorView
								entityId={{
									address: accounts[0],
								}}
								href={resolve('/~/(accounts)/accounts/account/[accountId]', {
									accountId: accounts[0],
								})}
								layout={EntityLayout.Id}
								open={false}
								showTypeAnnotation={false}
							/>
						{/if}
					</dd>
				</div>
			{/if}

			{#if chainId !== null}
				<div>
					<dt>Chain</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
			{#if open}
				<ResourceBoundary resource={persisted}>
					{#snippet children(connection)}
						<div>
							<dt>Selected</dt>
							<dd>{connection.selected ? 'Yes' : 'No'}</dd>
						</div>

						<div>
							<dt>Connected at</dt>
							<dd>
								<Timestamp
									timestamp={connection.connectedAt}
									format={TimestampFormat.Both}
								/>
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadWalletConnection}
			{entityId}
		/>

			{#if error}
				<p role="alert">
					{error}
				</p>
			{/if}

			{#if accounts.length}
				<ul
					data-column="gap-1"
					data-list="unstyled"
				>
					{#each accounts as address (address)}
						<li>
							{#if chainId !== null}
								<ActorNetworkView
									entityId={{
										$network: { chainId },
										$actor: { address },
									}}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: address,
									})}
									open={false}
								/>
							{:else}
								<ActorView
									entityId={{ address }}
									href={resolve('/~/(accounts)/accounts/account/[accountId]', {
										accountId: address,
									})}
									open={false}
								/>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<p data-text="muted">
					No accounts are connected to this wallet yet.
				</p>
			{/if}

			<div data-row>
				<button
					type="button"
					onclick={onRemove}
				>
					Remove
				</button>
			</div>
	{/snippet}
</EntityView>
