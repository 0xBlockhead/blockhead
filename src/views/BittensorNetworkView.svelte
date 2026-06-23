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
				label: 'latest finalized block',
			},
			{
				label: 'latest runtime',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'linked Network',
					},
					{
						label: 'latest finalized block',
					},
					{
						label: 'latest runtime',
					},
					{
						label: 'subnet count',
					},
					{
						label: 'environment',
					},
					{
						label: 'stack',
					},
					{
						label: 'native asset',
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
							label: 'Subtensor/Substrate block rows',
						},
					],
				},
				{
					label: 'Subnets',
					items: [
						{
							label: 'subnet rows by netuid',
						},
					],
				},
				{
					label: 'Neurons',
					items: [
						{
							label: 'neuron rows scoped under decoded subnets',
						},
					],
				},
				{
					label: 'Network snapshots',
					items: [
						{
							label: 'timestamped finality/runtime/node observations',
						},
					],
				},
				{
					label: 'Resources',
					items: [
						{
							label: 'faucets/block explorers from parent Network',
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
			selection: EntityProxyResource<typeof schema, EntityType.BittensorNetwork>
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
	entityType={EntityType.BittensorNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
