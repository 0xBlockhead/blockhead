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
			label: 'request',
		},
		'timestampMs',
		'status',
	],
	content: {
		dl: [
			[
				{
					label: 'request',
				},
				'timestampMs',
				'source',
				'status',
				{
					label: 'certified time',
				},
			],
			[
				'replyHash',
				{
					label: 'reject code/message',
				},
				'certificateHash',
				{
					label: 'witness presence',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Request',
				items: [
					{
						label: 'parent request-status row',
					},
				],
			},
			{
				label: 'Certified proof',
				items: [
					'certificateHash',
					'witness',
					{
						label: 'verification context',
					},
				],
			},
			{
				label: 'Reply/reject payload',
				items: [
					{
						label: 'reply hash or reject code/message',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'read_state request_status payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpRequestStatus_Timestamp>
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
	entityType={EntityType.IcpRequestStatus_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
