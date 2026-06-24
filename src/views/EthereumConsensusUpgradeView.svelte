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
			'upgradeId',
		],
		content: {
			dl: [
				[
					'upgradeId',
					'name',
					'slug',
					'activationBlock',
					'activationTimestampMs',
					'activationEpoch',
					'previousForkVersion',
					'currentForkVersion',
					'protocol',
					'linkEthereumOrg',
					'linkConsensusDocs',
					'linkForkcast',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'proposals',
					when: 'open',
					items: [
						'$$proposals',
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
			selection: EntityProxyResource<typeof schema, EntityType.EthereumConsensusUpgrade>
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
	entityType={EntityType.EthereumConsensusUpgrade}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
