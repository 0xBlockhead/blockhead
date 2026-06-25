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
		'logIndex',
		'transferIndex',
		{
			label: 'parent transaction link from selector txHash',
		},
	],
	content: {
		dl: [
			[
				'logIndex',
				'transferIndex',
				{
					label: 'parent transaction link from selector txHash',
				},
				{
					label: 'standard label',
				},
				'amount',
			],
			[
				{
					label: 'token id for ERC-721/ERC-1155',
				},
				{
					label: 'from/to EVM network accounts',
				},
				'$tokenContract',
				'$coinInstance',
				{
					label: 'token metadata',
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
						label: 'from/to EVM network accounts',
					},
				],
			},
			{
				label: 'Token',
				items: [
					'$tokenContract',
					{
						label: 'EVM coin instance',
					},
				],
			},
			{
				label: 'Log evidence',
				items: [
					{
						label: 'Transfer/TransferSingle/TransferBatch log payload',
					},
					{
						label: 'expanded batch item index',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmTokenTransfer>
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
	entityType={EntityType.EvmTokenTransfer}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
