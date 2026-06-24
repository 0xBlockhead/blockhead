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
			'hash',
		],
		content: {
			dl: [
				[
					'hash',
					'timestampMs',
					'successful',
					'fee',
					'nonce',
					'callGasLimit',
					'verificationGasLimit',
					'preVerificationGas',
					'maxFeePerGas',
					'maxPriorityFeePerGas',
					'gas',
					'gasUsed',
					'gasPrice',
					'entryPointVersion',
					'initCode',
					'callData',
					'sponsorType',
					'paymasterAndData',
					'signature',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmUserOperation>
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
	entityType={EntityType.EvmUserOperation}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
