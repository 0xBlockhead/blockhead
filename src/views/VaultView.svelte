<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve(
				'/(assets)/(vaults)/vault/[chainId=eip155ChainId]/[vaultId]',
			{
				chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)),
				vaultId: selection.entitySelector.id,
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.Vault>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
		>
	> = $props()


	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.Vault}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selection.entitySelector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}
</EntityView2>
