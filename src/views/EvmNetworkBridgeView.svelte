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
				label: 'source/target networks',
			},
			{
				label: 'bridge URL',
			},
			{
				label: 'registry relationship type',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'source/target networks',
					},
					{
						label: 'bridge URL',
					},
					{
						label: 'registry relationship type',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Networks',
					items: [
						{
							label: 'from/to EVM networks',
						},
					],
				},
				{
					label: 'Navigation',
					items: [
						{
							label: 'bridge URL',
						},
					],
				},
				{
					label: 'Registry evidence',
					items: [
						{
							label: 'Chainlist parent.bridges URL row',
						},
					],
				},
				{
					label: 'Non-goals',
					items: [
						{
							label: 'not bridge protocol identity',
						},
						{
							label: 'not route support',
						},
						{
							label: 'not liquidity',
						},
						{
							label: 'not settlement proof',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkBridge>
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
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
