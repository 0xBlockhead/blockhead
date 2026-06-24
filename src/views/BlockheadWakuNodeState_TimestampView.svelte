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
			label: 'node state',
		},
		{
			label: 'observation time',
		},
		'health',
	],
	content: {
		dl: [
			[
				{
					label: 'node state',
				},
				{
					label: 'observation time',
				},
				'source',
				'health',
				'version',
				{
					label: 'peer count',
				},
				{
					label: 'listen address count',
				},
				{
					label: 'ENR URI',
				},
				{
					label: 'enabled protocols',
				},
				{
					label: 'subscribed pubsub/content topics',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Node',
				items: [
					{
						label: 'parent connected Waku node state',
					},
				],
			},
			{
				label: 'Health',
				items: [
					{
						label: 'health endpoint result',
					},
				],
			},
			{
				label: 'Peers/addresses',
				items: [
					{
						label: 'peer count',
					},
					{
						label: 'listen addresses',
					},
					{
						label: 'ENR',
					},
				],
			},
			{
				label: 'Protocols',
				items: [
					{
						label: 'relay',
					},
					{
						label: 'store',
					},
					{
						label: 'filter',
					},
					{
						label: 'lightpush',
					},
					{
						label: 'RLN relay flags',
					},
				],
			},
			{
				label: 'Subscriptions',
				items: [
					{
						label: 'pubsub/content-topic lists',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWakuNodeState_Timestamp>
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
	entityType={EntityType.BlockheadWakuNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
