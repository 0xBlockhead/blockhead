<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(assets)/(vaults)/vault/[chainId]/[vaultId]',
			{
				chainId: String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)),
				vaultId: selector.id,
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.Vault>
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
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={selector.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}
</EntityView>
