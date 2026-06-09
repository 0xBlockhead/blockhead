<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(vaults)/vault/[chainId]/[vaultId]',
			{
				chainId: String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`)),
				vaultId: entityId.id,
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Vault>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.Vault}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}
</EntityView>
