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
			label: 'network',
		},
		{
			label: 'request id',
		},
		{
			label: 'canister',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'network',
				},
				{
					label: 'request id',
				},
				{
					label: 'canister',
				},
				{
					label: 'method',
				},
				{
					label: 'request kind',
				},
				{
					label: 'caller',
				},
				{
					label: 'ingress expiry',
				},
				{
					label: 'latest status',
				},
				{
					label: 'certified time',
				},
				{
					label: 'reply hash',
				},
				{
					label: 'reject summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Status history',
				items: [
					{
						label: 'timestamped request-status observations',
					},
				],
			},
			{
				label: 'Canister',
				items: [
					{
						label: 'target ICP canister',
					},
				],
			},
			{
				label: 'Method',
				items: [
					{
						label: 'canister method when resolved',
					},
				],
			},
			{
				label: 'Request metadata',
				items: [
					{
						label: 'caller',
					},
					{
						label: 'ingress expiry',
					},
					{
						label: 'request kind',
					},
				],
			},
			{
				label: 'Certified status proof',
				items: [
					{
						label: 'certificate/witness evidence',
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
			selection: EntityProxyResource<typeof schema, EntityType.IcpRequestStatus>
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
	entityType={EntityType.IcpRequestStatus}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
