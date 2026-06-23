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
				label: 'linked Network',
			},
			{
				label: 'chain id',
			},
			{
				label: 'latest head observation',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'chain id',
					},
					{
						label: 'latest head/sync observation',
					},
					{
						label: 'bounded block count',
					},
					{
						label: 'bounded contract/class/transaction counts',
					},
					{
						label: 'L2Beat deployment mapping when source-backed',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Blocks',
					items: [
						{
							label: 'Starknet block rows',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'Starknet transaction rows',
						},
					],
				},
				{
					label: 'Contracts',
					items: [
						{
							label: 'Starknet contract rows',
						},
					],
				},
				{
					label: 'Classes',
					items: [
						{
							label: 'Starknet class rows',
						},
					],
				},
				{
					label: 'Network observations',
					items: [
						{
							label: 'timestamped head/sync observations',
						},
					],
				},
				{
					label: 'Scaling',
					items: [
						{
							label: 'ScalingDeploymentClaim mapping when source-backed',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetNetwork>
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
	entityType={EntityType.StarknetNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
