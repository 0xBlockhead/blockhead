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
			'timestampMs',
			'source',
		],
		content: {
			dl: [
				[
					'timestampMs',
					'source',
					'name',
					'symbol',
					'totalSupply',
					'maxSupply',
					'treasuryAccount',
					'supplyKey',
					'adminKey',
					'freezeKey',
					'wipeKey',
					'kycKey',
					'pauseKey',
					'feeScheduleKey',
					'deleted',
					'paused',
					'customFees',
					'expiryTimestamp',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'custom fees',
					when: 'open',
					items: [
						'$$customFees',
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
			selection: EntityProxyResource<typeof schema, EntityType.HederaToken_Timestamp>
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
	entityType={EntityType.HederaToken_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
