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
			'scope',
			'$$timestamps',
		],
		content: {
			dl: [
				[
					'scope',
					'$$timestamps',
					'$registryContract',
					'$ethRegistrarController',
					'$reverseRegistrar',
					'$nameWrapper',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Hub observations',
					items: [
						'$$timestamps',
					],
				},
				{
					label: 'Anchor refs',
					items: [
						'$registryContract',
						'$ethRegistrarController',
						'$reverseRegistrar',
						'$nameWrapper',
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'SourceBinding.Blockscout_Rest',
						},
						{
							label: 'SourceBinding.Constants_Internal',
						},
						{
							label: 'SourceBinding.Etherscan_Rest',
						},
						{
							label: 'SourceBinding.TheGraph_Graphql',
						},
						{
							label: 'SourceBinding.Voltaire_JsonRpc',
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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalEnsNetwork>
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
	entityType={EntityType._GlobalEnsNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
