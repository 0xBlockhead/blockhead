<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


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


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import Address from '$/views/Address.svelte'
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

	{#snippet Content()}
		<dl>
			<div>
				<dt>Status</dt>
				<dd>{status}</dd>
			</div>

			{#if accounts[0]}
				<div>
					<dt>Account</dt>
					<dd>
						<Address
							actorId={{
								$network: {
									chainId: chainId ?? 1,
								},
								address: accounts[0],
							}}
							isLinked={false}
						/>
					</dd>
				</div>
			{/if}

			{#if chainId !== undefined}
				<div>
					<dt>Chain</dt>
					<dd>{String(chainId)}</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadWalletConnection}
			{entityId}
		>
			{#if error}
				<p role="alert">
					{error}
				</p>
			{/if}

			{#if accounts.length > 0}
				<ul
					data-column="gap-1"
					data-list="unstyled"
				>
					{#each accounts as address (address)}
						<li>
							<ActorView
								entityId={{
									$network: {
										chainId: chainId ?? 1,
									},
									address,
								}}
								href={resolve('/~/(accounts)/accounts/account/[accountId]', {
									accountId: address,
								})}
								open={false}
							/>
						</li>
					{/each}
				</ul>
			{/if}

			<div data-row>
				<button
					type="button"
					onclick={onRemove}
				>
					Remove
				</button>
			</div>
		</EntityDetails>
	{/snippet}
</EntityView>
