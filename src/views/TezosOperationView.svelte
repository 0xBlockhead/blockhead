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
			'contentIndex',
		],
		content: {
			dl: [
				[
					'contentIndex',
					'operationKind',
					'sourceAddress',
					'destinationAddress',
					'delegateAddress',
					'contractAddress',
					'counter',
					'feeMutez',
					'gasLimit',
					'storageLimit',
					'amountMutez',
					'parameters',
					'status',
					'consumedGas',
					'storageSize',
					'paidStorageSizeDiff',
					'originatedContractAddresses',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'internal operations',
					when: 'open',
					items: [
						'$$internalOperations',
					],
				},
				{
					label: 'big map diffs',
					when: 'open',
					items: [
						'$$bigMapDiffs',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosOperation>
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
	entityType={EntityType.TezosOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
