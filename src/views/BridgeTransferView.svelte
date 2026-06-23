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
				label: 'transfer id or source transaction hash',
			},
			{
				label: 'source -> destination network labels',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'transfer id or source transaction hash',
					},
					{
						label: 'source -> destination network labels',
					},
				],
				[
					'source',
					{
						label: 'rail',
					},
					{
						label: 'settlement/verification/asset outcome',
					},
					{
						label: 'sender',
					},
					{
						label: 'recipient',
					},
					{
						label: 'from/to networks',
					},
					{
						label: 'from/to tokens',
					},
					{
						label: 'source transaction',
					},
					{
						label: 'destination transaction',
					},
					{
						label: 'amount in/out',
					},
					{
						label: 'latest status',
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
							label: 'timestamped bridge transfer observations',
						},
					],
				},
				{
					label: 'Transactions',
					items: [
						{
							label: 'source/destination EVM transaction rows',
						},
					],
				},
				{
					label: 'Participants',
					items: [
						{
							label: 'sender/recipient account refs',
						},
					],
				},
				{
					label: 'Assets/networks',
					items: [
						{
							label: 'token and network refs',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'status API/indexer/log payload fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.BridgeTransfer>
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
	entityType={EntityType.BridgeTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
