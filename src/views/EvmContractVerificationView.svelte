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
		'match',
		'creationMatch',
		'runtimeMatch',
	],
	content: {
		dl: [
			[
				'match',
				'creationMatch',
				'runtimeMatch',
				{
					label: 'verified timestamp',
				},
				'matchId',
				'$sourceBundle',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent EVM contract',
					},
				],
			},
			{
				label: 'Compilation',
				items: [
					{
						label: 'Sourcify compilation metadata',
					},
				],
			},
			{
				label: 'Source bundle',
				items: [
					{
						label: 'Sourcify source bundle',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'Sourcify verification metadata',
					},
					{
						label: 'creation/runtime match fields',
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmContractVerification>
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
	entityType={EntityType.EvmContractVerification}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
