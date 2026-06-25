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
		'latestSlot',
		{
			label: 'block number',
		},
		'epoch',
	],
	content: {
		dl: [
			[
				'latestSlot',
				{
					label: 'block number',
				},
				'epoch',
				'era',
				'syncProgress',
				'source',
				'timestampMs',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Network',
				items: [
					{
						label: 'CardanoNetwork',
					},
				],
			},
			{
				label: 'Tip',
				items: [
					'latestSlot',
					{
						label: 'latest block number',
					},
					'epoch',
					'era',
				],
			},
			{
				label: 'Node sync',
				items: [
					'syncProgress',
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Blockfrost/Koios/Ogmios/local-state-query payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNetwork_Timestamp>
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
	entityType={EntityType.CardanoNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
