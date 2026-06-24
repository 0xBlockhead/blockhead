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
			label: 'contract',
		},
		{
			label: 'method name',
		},
		{
			label: 'latest method id/schema',
		},
	],
	content: {
		dl: [
			[
				{
					label: 'contract',
				},
				{
					label: 'method name',
				},
				{
					label: 'latest method id/schema availability',
				},
				{
					label: 'latest invocation exit/result summary',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Contract',
				items: [
					{
						label: 'parent contract identity',
					},
				],
			},
			{
				label: 'Schema/history',
				items: [
					{
						label: 'method schema and invocation snapshots',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'callable surface',
					},
					{
						label: 'verifier payload',
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
			selection: EntityProxyResource<typeof schema, EntityType.TonContractGetMethod>
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
	entityType={EntityType.TonContractGetMethod}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
