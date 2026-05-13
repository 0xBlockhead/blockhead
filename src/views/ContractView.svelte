<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'


	// Components
	import Address from '$/views/Address.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'


	// Props
	let {
		children,
		entityId,
		title = 'Contract',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.EvmContract>
			title?: string
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
			| 'Details'
		>
	> = $props()


	const contract = useEntity(
		EntityType.EvmContract,
		entityId,
		{
			$: [
				Source.Sourcify_Rest,
				Source.Blockscout_Rest,
			],
			abi: {},
		},
	)
</script>


<EntityView
	entityType={EntityType.EvmContract}
	{entityId}
	{title}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Chain ID</dt>
				<dd>{String(entityId.$network.chainId)}</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<Address
						network={entityId.$network}
						address={entityId.address}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.EvmContract}
			{entityId}
		>
			<ResourceBoundary resource={contract}>
				{#snippet children(live)}
					<dl>
						{#if live.abi !== undefined}
							<div>
								<dt>ABI</dt>
								<dd>
									<TruncatedValue
										value={live.abi}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{:else}
							<div>
								<dt>ABI</dt>
								<dd>No ABI available yet.</dd>
							</div>
						{/if}
					</dl>
				{/snippet}
			</ResourceBoundary>
		</EntityDetails>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
