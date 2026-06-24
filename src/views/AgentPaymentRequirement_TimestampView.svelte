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
			'subjectKind',
			'subjectSelector',
			'paymentProtocol',
			'timestampMs',
			'source',
		],
		content: {
			dl: [
				[
					'subjectKind',
					'subjectSelector',
					'paymentProtocol',
					'timestampMs',
					'source',
					'required',
					'httpStatus',
					'requestMethod',
					'resourceUrl',
					'paymentRequiredHeader',
					'paymentSignatureHeader',
					'paymentResponseHeader',
					'paymentRequirements',
					'paymentPayload',
					'paymentResponsePayload',
					'facilitatorUrl',
					'scheme',
					'assetSelector',
					'networkSelector',
					'price',
					'payTo',
					'maxAmountRequired',
					'maxTimeoutSeconds',
					'evidenceUri',
					'error',
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
			selection: EntityProxyResource<typeof schema, EntityType.AgentPaymentRequirement_Timestamp>
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
	entityType={EntityType.AgentPaymentRequirement_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
