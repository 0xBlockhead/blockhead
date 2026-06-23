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
			'source',
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
					{
						label: 'network name',
					},
					{
						label: 'node/database versions',
					},
					{
						label: 'git commit',
					},
					{
						label: 'RPC protocol version',
					},
					{
						label: 'connected peer count',
					},
					{
						label: 'uptime',
					},
					{
						label: 'VM version count',
					},
					{
						label: 'last synced time',
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
							label: 'parent connected Avalanche node state',
						},
					],
				},
				{
					label: 'Versions',
					items: [
						{
							label: 'node/database/RPC/VM versions',
						},
					],
				},
				{
					label: 'Peers/uptime',
					items: [
						{
							label: 'peer count',
						},
						{
							label: 'uptime observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'AvalancheGo Info RPC payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAvalancheNodeState_Timestamp>
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
	entityType={EntityType.BlockheadAvalancheNodeState_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
