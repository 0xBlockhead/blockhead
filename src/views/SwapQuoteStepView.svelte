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
		'$quote',
		'index',
		'providerStepId',
	],
	content: {
		dl: [
			[
				'$quote',
				'index',
				'providerStepId',
				'stepType',
				'protocol',
			],
			[
				'poolId',
				'$liquidityPool',
				{
					label: 'token in/out',
				},
				{
					label: 'amount in/out',
				},
				'feeBps',
			],
			[
				'shareBps',
				'gasEstimate',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Quote observation',
				items: [
					{
						label: 'parent swap quote observation',
					},
				],
			},
			{
				label: 'Pool',
				items: [
					{
						label: 'liquidity pool when the source gives a stable pool selector',
					},
				],
			},
			{
				label: 'Tokens',
				items: [
					{
						label: 'EVM coin instance refs',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'provider route hop payload',
					},
					{
						label: 'router/path metadata',
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
			selection: EntityProxyResource<typeof schema, EntityType.SwapQuoteStep>
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
	entityType={EntityType.SwapQuoteStep}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
