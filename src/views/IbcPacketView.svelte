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
			'sequence',
			'direction',
		],
		content: {
			dl: [
				[
					'sequence',
					'direction',
					'sourcePort',
					'sourceChannel',
					'destinationPort',
					'destinationChannel',
					'timeoutHeight',
					'timeoutTimestampNs',
					'dataHash',
					'commitmentHash',
					'acknowledgementHash',
					'receiptExists',
					'status',
					'sendTxHash',
					'receiveTxHash',
					'acknowledgeTxHash',
					'timeoutTxHash',
				],
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.IbcPacket>
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
	entityType={EntityType.IbcPacket}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
