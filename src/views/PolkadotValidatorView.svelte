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
			{
				label: 'network',
			},
			{
				label: 'stash account id',
			},
			{
				label: 'latest era controller/commission/stake summary',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'network',
					},
					{
						label: 'stash account id',
					},
					{
						label: 'latest era controller/commission/stake summary',
					},
					{
						label: 'era count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Era history',
					items: [
						{
							label: 'era-bounded validator observations',
						},
					],
				},
				{
					label: 'Controller',
					items: [
						{
							label: 'Polkadot account through the latest era when resolved',
						},
					],
				},
				{
					label: 'Network set',
					items: [
						{
							label: 'validator-set context',
						},
					],
				},
				{
					label: 'Nominators/exposure',
					items: [
						{
							label: 'era-bounded exposure rows when modeled',
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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotValidator>
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
	entityType={EntityType.PolkadotValidator}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
