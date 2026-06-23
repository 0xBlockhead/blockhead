<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'formatted latest balance/symbol',
			},
			{
				label: 'account link',
			},
			{
				label: 'native asset or token contract',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'formatted latest balance/symbol',
					},
					{
						label: 'account link',
					},
					{
						label: 'native asset or token contract',
					},
					'decimals',
					{
						label: 'overview empty state',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Latest observations',
					items: [
						{
							label: 'timestamped latest/current balance observations',
						},
					],
				},
				{
					label: 'Block history',
					items: [
						{
							label: 'block-bounded balance observations',
						},
					],
				},
				{
					label: 'Account',
					items: [
						{
							label: 'parent EVM network account',
						},
					],
				},
				{
					label: 'Coin',
					items: [
						{
							label: 'EVM coin instance or token contract',
						},
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
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
	entityType={EntityType.EvmNetworkActorCoinBalance}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
