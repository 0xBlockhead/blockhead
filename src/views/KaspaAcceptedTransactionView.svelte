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
		'$acceptingBlock',
		'$transaction',
		'acceptedIndex',
	],
	content: {
		dl: [
			[
				'$acceptingBlock',
				'$transaction',
				'acceptedIndex',
				'acceptingBlockHash',
				'transactionId',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Accepting block',
				items: [
					{
						label: 'Kaspa block that accepted the transaction',
					},
				],
			},
			{
				label: 'Transaction',
				items: [
					{
						label: 'accepted Kaspa transaction',
					},
				],
			},
			{
				label: 'Virtual-chain context',
				items: [
					{
						label: 'virtual-chain observations that added or removed the accepting block',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getVirtualChainFromBlock/getVirtualChainFromBlockV2 payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAcceptedTransaction>
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
	entityType={EntityType.KaspaAcceptedTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
