<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[],
			],
		},
		details: {
			tabs: [
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'token transfers',
					when: 'open',
					items: [
						'$$tokenTransfers',
					],
				},
				{
					label: 'internal transfers',
					when: 'open',
					items: [
						'$$internalTransfers',
					],
				},
				{
					label: 'owned coins',
					when: 'open',
					items: [
						'$$ownedCoins',
					],
				},
				{
					label: 'erc20 token allowances',
					when: 'open',
					items: [
						'$$erc20TokenAllowances',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
