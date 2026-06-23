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
				label: 'message hash',
			},
			{
				label: 'observation time',
			},
			{
				label: 'content topic',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'message hash',
					},
					{
						label: 'observation time',
					},
					'source',
					{
						label: 'pubsub topic',
					},
					{
						label: 'content topic',
					},
					{
						label: 'payload hash',
					},
					{
						label: 'payload size',
					},
					'version',
					{
						label: 'ephemeral flag',
					},
					{
						label: 'sender peer id',
					},
					{
						label: 'protocol path',
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
					label: 'Topics',
					items: [
						{
							label: 'pubsub/content-topic grouping',
						},
					],
				},
				{
					label: 'Payload',
					items: [
						{
							label: 'hash/size only unless caller retains decrypted local payload',
						},
					],
				},
				{
					label: 'Protocol path',
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
							label: 'lightpush observation context',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'connected Waku REST node payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWakuMessageObservation_Timestamp>
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
	entityType={EntityType.BlockheadWakuMessageObservation_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
