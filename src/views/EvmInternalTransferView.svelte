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
				label: 'internal index',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'internal index',
					},
				],
				[
					{
						label: 'parent transaction link derived from selector txHash',
					},
					{
						label: 'internal index',
					},
					{
						label: 'call type label',
					},
					'success',
					{
						label: 'created contract for create/create2 calls',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Transaction',
					items: [
						{
							label: 'parent EVM transaction derived from network/txHash',
						},
					],
				},
				{
					label: 'Accounts',
					items: [
						{
							label: 'from/to EVM accounts',
						},
					],
				},
				{
					label: 'Created contract',
					items: [
						{
							label: 'created EVM contract when callType creates a contract',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'explorer internals payload',
						},
						{
							label: 'trace-derived transfer index',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmInternalTransfer>
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
	entityType={EntityType.EvmInternalTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
