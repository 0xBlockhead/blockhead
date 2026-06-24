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
			label: 'transaction hash',
		},
		{
			label: 'kind',
		},
		{
			label: 'latest status',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'transaction hash',
				},
				{
					label: 'kind',
				},
				{
					label: 'block',
				},
				{
					label: 'sender',
				},
				'nonce',
				'version',
				{
					label: 'fee/resource bounds',
				},
				{
					label: 'calldata count',
				},
				{
					label: 'signature count',
				},
				{
					label: 'latest status/fee',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Execution observations',
				items: [
					{
						label: 'timestamped receipt/status observations',
					},
				],
			},
			{
				label: 'Events',
				items: [
					{
						label: 'transaction event rows',
					},
				],
			},
			{
				label: 'Sender',
				items: [
					{
						label: 'sender Starknet contract',
					},
				],
			},
			{
				label: 'Block',
				items: [
					{
						label: 'parent Starknet block',
					},
				],
			},
			{
				label: 'Payload',
				items: [
					{
						label: 'calldata/signature/resource bounds',
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
			selection: EntityProxyResource<typeof schema, EntityType.StarknetTransaction>
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
	entityType={EntityType.StarknetTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
