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
			'sessionId',
		],
		content: {
			dl: [
				[
					'sessionId',
					'role',
					'status',
					'bip21Uri',
					'endpointUrl',
					'receiverAddress',
					'amountSats',
					'disableOutputSubstitution',
					'minFeeRateSatPerVbyte',
					'additionalFeeOutputIndex',
					'maxAdditionalFeeContributionSats',
					'originalPsbtHash',
					'proposalPsbtHash',
					'finalTransactionId',
					'errorCode',
					'createdAt',
					'updatedAt',
					'completedAt',
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadPayjoinSession>
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
	entityType={EntityType.BlockheadPayjoinSession}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
