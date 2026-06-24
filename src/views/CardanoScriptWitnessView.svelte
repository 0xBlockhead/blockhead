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
			label: 'witness index',
		},
		{
			label: 'script kind/language',
		},
		{
			label: 'script hash',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'witness index',
				},
				{
					label: 'script kind/language',
				},
				{
					label: 'script hash',
				},
				{
					label: 'execution units',
				},
				{
					label: 'parent transaction',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Datum',
				items: [
					{
						label: 'datum JSON/hash',
					},
				],
			},
			{
				label: 'Redeemer',
				items: [
					{
						label: 'redeemer JSON/ex-units',
					},
				],
			},
			{
				label: 'Script',
				items: [
					{
						label: 'script bytes/source when sourceable',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoScriptWitness>
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
	entityType={EntityType.CardanoScriptWitness}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
