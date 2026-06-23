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
				label: 'observed time/source',
			},
			{
				label: 'latest checkpoint sequence/digest',
			},
			'epoch',
		],
		content: {
			dl: [
				[
					{
						label: 'observed time/source',
					},
					{
						label: 'latest checkpoint sequence/digest',
					},
					'epoch',
					{
						label: 'protocol version',
					},
					{
						label: 'transaction count',
					},
					{
						label: 'history',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Network',
					items: [
						{
							label: 'SuiNetwork',
						},
					],
				},
				{
					label: 'Checkpoint head',
					items: [
						{
							label: 'latest checkpoint sequence/digest',
						},
						'epoch',
					],
				},
				{
					label: 'Protocol/activity',
					items: [
						{
							label: 'protocol version',
						},
						{
							label: 'total transaction count',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'Sui GraphQL/gRPC/JSON-RPC system state payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.SuiNetwork_Timestamp>
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
	entityType={EntityType.SuiNetwork_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
