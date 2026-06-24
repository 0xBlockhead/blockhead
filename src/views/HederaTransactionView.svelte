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
			'consensusTimestamp',
		],
		content: {
			dl: [
				[
					'consensusTimestamp',
					'transactionId',
					'nonce',
					'transactionType',
					'payerAccount',
					'result',
					'chargedTxFeeTinybar',
					'validStartTimestamp',
					'nodeAccountId',
					'scheduled',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'hbar transfers',
					when: 'open',
					items: [
						'$$hbarTransfers',
					],
				},
				{
					label: 'token transfers',
					when: 'open',
					items: [
						'$$tokenTransfers',
					],
				},
				{
					label: 'contract results',
					when: 'open',
					items: [
						'$$contractResults',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaTransaction>
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
	entityType={EntityType.HederaTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
