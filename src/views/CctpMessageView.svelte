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
			'sourceDomain',
			'nonce',
		],
		content: {
			dl: [
				[
					'sourceDomain',
					'nonce',
					'cctpVersion',
					'messageHash',
					'messageBytes',
					'sourceTransactionHash',
					'sourceLogIndex',
					'destinationDomain',
					'sender',
					'recipient',
					'destinationCaller',
					'burnToken',
					'mintRecipient',
					'amount',
					'messageSender',
					'maxFee',
					'feeExecuted',
					'expirationBlock',
					'hookData',
					'minFinalityThreshold',
					'finalityThresholdExecuted',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'attestation timestamps',
					when: 'open',
					items: [
						'$$attestationTimestamps',
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
			selection: EntityProxyResource<typeof schema, EntityType.CctpMessage>
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
	entityType={EntityType.CctpMessage}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
