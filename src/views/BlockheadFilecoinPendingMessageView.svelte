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
		'nodeId',
		'messageCid',
		{
			label: 'observation time',
		},
	],
	content: {
		dl: [
			[
				'nodeId',
				'messageCid',
				{
					label: 'observation time',
				},
				'$network',
				{
					label: 'from actor',
				},
			],
			[
				{
					label: 'to actor',
				},
				'nonce',
				'method',
				'valueAttoFil',
				'gasLimit',
			],
			[
				{
					label: 'fee cap',
				},
				'gasPremiumAttoFil',
				'signatureType',
				'local',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Message',
				items: [
					{
						label: 'Filecoin message when the pending message can be normalized',
					},
				],
			},
			{
				label: 'Actors',
				items: [
					{
						label: 'from/to Filecoin actor refs',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'signed message JSON',
					},
					{
						label: 'signature metadata',
					},
				],
			},
			{
				label: 'Node state',
				items: [
					{
						label: 'source node',
					},
					{
						label: 'local queue status',
					},
					{
						label: 'observation freshness',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadFilecoinPendingMessage>
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
	entityType={EntityType.BlockheadFilecoinPendingMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
